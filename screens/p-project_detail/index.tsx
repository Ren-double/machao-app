

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Defs, Pattern, Path, Rect, Polyline, Circle, Text as SvgText } from 'react-native-svg';
import styles from './styles';
import { getRepository, getStarHistory, GitHubProject } from '../../services/github';

interface ProjectData extends GitHubProject {
  avatar: string;
  contributors: string;
  lastUpdated: string;
  docsUrl: string;
}

type TrendPeriod = '7d' | '30d' | '90d';

const ProjectDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; owner: string; name: string }>();
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedTrendPeriod, setSelectedTrendPeriod] = useState<TrendPeriod>('7d');
  const [trendData, setTrendData] = useState<{date: string, count: number}[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [params.owner, params.name]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      
      if (!params.owner || !params.name) {
         // Fallback for old links or direct access
         if (params.id && params.id.startsWith('project')) {
            // It's a mock ID, ignore or handle gracefully
            Alert.alert('提示', '该项目为演示数据，无法查看详情');
            router.back();
            return;
         }
         throw new Error('Missing project information');
      }

      const repo = await getRepository(params.owner, params.name);
      
      if (repo) {
        // Fetch contributors count
        let contributorsCount = 'N/A';
        try {
          const contributorsUrl = `https://api.github.com/repos/${params.owner}/${params.name}/contributors?per_page=1&anon=true`;
          const resp = await fetch(contributorsUrl);
          const linkHeader = resp.headers.get('link');
          
          if (linkHeader) {
            const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
            if (match) {
              contributorsCount = match[1];
            } else {
              // If no last link, but we have link header, it might be just one page? 
              // Actually if per_page=1 and there are more, there should be a last link or next link.
              // If only next, we don't know total. But usually 'last' is present if many pages.
              // If no 'last' but 'next', it's at least 2.
              // If no link header, it means count <= 1.
              contributorsCount = '1+'; 
            }
          } else {
             // No link header means results fit in one page (which is 1 item).
             // Check if we got any data
             const data = await resp.json();
             contributorsCount = Array.isArray(data) ? data.length.toString() : '0';
          }
        } catch (e) {
          console.log('Failed to fetch contributors count', e);
        }

        // Map GitHub data to UI data
        const mappedData: ProjectData = {
            ...repo,
            avatar: `https://github.com/${repo.author}.png`,
            contributors: contributorsCount,
            lastUpdated: new Date().toLocaleDateString(), // We don't have updated_at in GitHubProject yet, so use current or fetch more
            docsUrl: repo.html_url, // Use html_url as docs fallback
        };
        
        setProjectData(mappedData);
        setIsBookmarked(repo.isBookmarked);
        
        // Add to history
        addToHistory(mappedData);

        // Load Trend Data
        loadTrendData(params.owner, params.name, repo.stargazers_count);
      }
    } catch (error: any) {
      console.error('加载项目数据失败:', error);
      if (error.message === 'ProjectNotFound') {
        Alert.alert('错误', '项目未找到');
      } else if (error.message === 'RateLimitExceeded') {
        Alert.alert('错误', '访问太频繁，请稍后再试');
      } else if (error.message === 'Network request failed' || error.name === 'TypeError') {
        Alert.alert('网络错误', '连接失败，请检查网络或VPN设置');
      } else {
        Alert.alert('错误', '加载项目数据失败，请重试');
      }
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendData = async (owner: string, name: string, totalStars: number) => {
    setLoadingTrend(true);
    try {
      const history = await getStarHistory(owner, name);
      
      const gains = new Map<string, number>();
      history.forEach(ts => {
        const date = ts.split('T')[0];
        gains.set(date, (gains.get(date) || 0) + 1);
      });
      
      const points: {date: string, count: number}[] = [];
      const now = new Date();
      let currentCount = totalStars;
      
      // Calculate for 90 days to cover all periods
      for (let i = 0; i < 90; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        points.unshift({ date: dateStr, count: currentCount });
        
        const gain = gains.get(dateStr) || 0;
        currentCount -= gain;
      }
      
      setTrendData(points);
    } catch (e) {
      console.error('Failed to load trend data', e);
    } finally {
      setLoadingTrend(false);
    }
  };

  const addToHistory = async (project: ProjectData) => {
    try {
      const historyJson = await AsyncStorage.getItem('@browseHistory');
      let history = historyJson ? JSON.parse(historyJson) : [];
      
      // Remove duplicate
      history = history.filter((item: any) => item.id !== project.id);
      
      // Add new item to top
      const newItem = {
        id: project.id,
        title: project.name,
        owner: project.author,
        repo: project.repo,
        description: project.description,
        stars: project.stars,
        forks: project.forks,
        language: project.language,
        languageColor: '#6b7280', // Default color
        languageBg: '#f3f4f6',
        timeAgo: '刚刚'
      };
      
      history.unshift(newItem);
      if (history.length > 50) history = history.slice(0, 50);
      
      await AsyncStorage.setItem('@browseHistory', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/p-home');
    }
  };

  const handleBookmarkPress = async () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    
    try {
      const bookmarksJson = await AsyncStorage.getItem('@bookmarked_projects');
      let bookmarks = bookmarksJson ? JSON.parse(bookmarksJson) : [];
      
      if (newBookmarkedState) {
        // Add
        if (projectData) {
          // Check if already exists
          if (!bookmarks.some((b: any) => b.id === projectData.id)) {
            // Simplify data for storage if needed, or store full projectData
            // For now, store full projectData as it matches the need for list display
            bookmarks.unshift(projectData);
          }
        }
      } else {
        // Remove
        if (projectData) {
          bookmarks = bookmarks.filter((b: any) => b.id !== projectData.id);
        }
      }
      
      await AsyncStorage.setItem('@bookmarked_projects', JSON.stringify(bookmarks));
      showToast(newBookmarkedState ? '收藏成功' : '取消收藏');
    } catch (e) {
      console.error('Failed to update bookmarks', e);
      showToast('操作失败');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const handleTrendPeriodPress = (period: TrendPeriod) => {
    setSelectedTrendPeriod(period);
    // 这里可以添加切换趋势图数据的逻辑
  };

  const handleGithubPress = async () => {
    if (projectData?.html_url) {
      try {
        const supported = await Linking.canOpenURL(projectData.html_url);
        if (supported) {
          await Linking.openURL(projectData.html_url);
        } else {
          Alert.alert('错误', '无法打开链接');
        }
      } catch (error) {
        console.error('打开GitHub链接失败:', error);
        Alert.alert('错误', '打开链接失败');
      }
    }
  };

  const handleDocsPress = async () => {
    if (projectData?.docsUrl) {
      try {
        const supported = await Linking.canOpenURL(projectData.docsUrl);
        if (supported) {
          await Linking.openURL(projectData.docsUrl);
        } else {
          Alert.alert('错误', '无法打开链接');
        }
      } catch (error) {
        console.error('打开文档链接失败:', error);
        Alert.alert('错误', '打开链接失败');
      }
    }
  };

  const handleReadmePress = () => {
    if (projectData && params.owner && params.name) {
      router.push({
        pathname: '/p-readme',
        params: {
          owner: params.owner,
          repo: params.name,
          default_branch: projectData.default_branch
        }
      });
    }
  };

  const getLanguageTagStyle = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return styles.languageJavaScript;
      case 'python':
        return styles.languagePython;
      case 'java':
        return styles.languageJava;
      case 'go':
        return styles.languageGo;
      default:
        return styles.languageJavaScript;
    }
  };

  const renderChart = () => {
    if (loadingTrend) return <View style={{height: 150, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: '#6b7280'}}>加载趋势数据...</Text></View>;
    if (trendData.length === 0) return <View style={{height: 150, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: '#6b7280'}}>暂无趋势数据</Text></View>;

    const days = selectedTrendPeriod === '7d' ? 7 : selectedTrendPeriod === '30d' ? 30 : 90;
    const data = trendData.slice(-days);
    
    if (data.length < 2) return <View style={{height: 150, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: '#6b7280'}}>数据不足</Text></View>;

    const width = 300;
    const height = 150;
    const padding = 20;
    
    const counts = data.map(d => d.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const range = max - min || 1;
    
    const formatYLabel = (val: number) => {
        if (val >= 1000) return (val/1000).toFixed(1) + 'k';
        return Math.round(val).toString();
    };

    const yLabels = [
        max, 
        min + range * 0.66, 
        min + range * 0.33, 
        min
    ].map(formatYLabel);

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((d.count - min) / range) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');
    
    const dots = data.map((d, i) => {
        // Show fewer dots for longer periods
        if (selectedTrendPeriod !== '7d' && i % Math.ceil(data.length / 7) !== 0) return null;
        
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((d.count - min) / range) * (height - 2 * padding);
        return <Circle key={i} cx={x} cy={y} r="3" fill="#2563eb"/>;
    });

    return (
        <Svg width="100%" height="150" viewBox={`0 0 ${width} ${height}`}>
             <Defs>
                <Pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                  <Path d="M 50 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#grid)" />
              
              <Polyline 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2" 
                strokeLinecap="round"
                points={points}
              />
              
              {dots}
              
              <SvgText x="25" y="25" textAnchor="end" fontSize="10" fill="#6b7280">{yLabels[0]}</SvgText>
              <SvgText x="25" y="65" textAnchor="end" fontSize="10" fill="#6b7280">{yLabels[1]}</SvgText>
              <SvgText x="25" y="105" textAnchor="end" fontSize="10" fill="#6b7280">{yLabels[2]}</SvgText>
              <SvgText x="25" y="145" textAnchor="end" fontSize="10" fill="#6b7280">{yLabels[3]}</SvgText>
        </Svg>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!projectData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>项目数据加载失败</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProjectData}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={16} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>项目详情</Text>
        <TouchableOpacity 
          style={[
            styles.headerButton,
            isBookmarked && styles.bookmarkedButton
          ]} 
          onPress={handleBookmarkPress}
        >
          <FontAwesome6 
            name="bookmark" 
            size={16} 
            color={isBookmarked ? '#2563eb' : '#6b7280'}
            solid={isBookmarked}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 项目基本信息 */}
        <View style={styles.projectInfoCard}>
          <View style={styles.projectInfoHeader}>
            <View style={styles.projectInfoContent}>
              <Text style={styles.projectName}>{projectData.name}</Text>
              <Text style={styles.projectAuthor}>{projectData.author}</Text>
              <Text style={styles.projectDescription}>{projectData.description}</Text>
            </View>
            <Image source={{ uri: projectData.avatar }} style={styles.projectAvatar} />
          </View>
          
          {/* 项目统计信息 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <FontAwesome6 name="star" size={14} color="#f59e0b" solid />
                <Text style={styles.statValue}>{projectData.stars}</Text>
              </View>
              <Text style={styles.statLabel}>星标</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <FontAwesome6 name="code-branch" size={14} color="#6b7280" />
                <Text style={styles.statValue}>{projectData.forks}</Text>
              </View>
              <Text style={styles.statLabel}>分支</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <FontAwesome6 name="users" size={14} color="#6b7280" />
                <Text style={styles.statValue}>{projectData.contributors}</Text>
              </View>
              <Text style={styles.statLabel}>贡献者</Text>
            </View>
          </View>
          
          {/* 编程语言和更新时间 */}
          <View style={styles.metaContainer}>
            <View style={[styles.languageTag, getLanguageTagStyle(projectData.language)]}>
              <Text style={styles.languageTagText}>{projectData.language}</Text>
            </View>
            <Text style={styles.lastUpdated}>{projectData.lastUpdated}</Text>
          </View>
        </View>

        {/* 项目趋势图 */}
        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>星标趋势</Text>
            <View style={styles.trendPeriodContainer}>
              <TouchableOpacity 
                style={[
                  styles.trendPeriodButton,
                  selectedTrendPeriod === '7d' && styles.trendPeriodButtonActive
                ]}
                onPress={() => handleTrendPeriodPress('7d')}
              >
                <Text style={[
                  styles.trendPeriodButtonText,
                  selectedTrendPeriod === '7d' && styles.trendPeriodButtonTextActive
                ]}>
                  7天
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.trendPeriodButton,
                  selectedTrendPeriod === '30d' && styles.trendPeriodButtonActive
                ]}
                onPress={() => handleTrendPeriodPress('30d')}
              >
                <Text style={[
                  styles.trendPeriodButtonText,
                  selectedTrendPeriod === '30d' && styles.trendPeriodButtonTextActive
                ]}>
                  30天
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.trendPeriodButton,
                  selectedTrendPeriod === '90d' && styles.trendPeriodButtonActive
                ]}
                onPress={() => handleTrendPeriodPress('90d')}
              >
                <Text style={[
                  styles.trendPeriodButtonText,
                  selectedTrendPeriod === '90d' && styles.trendPeriodButtonTextActive
                ]}>
                  90天
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 趋势图表 */}
          <View style={styles.chartContainer}>
            {renderChart()}
          </View>
          
          {/* 今日增长 */}
          <View style={styles.trendGrowthContainer}>
            <View style={styles.trendGrowthLeft}>
              {(() => {
                  const days = selectedTrendPeriod === '7d' ? 7 : selectedTrendPeriod === '30d' ? 30 : 90;
                  const data = trendData.slice(-days);
                  const growth = data.length >= 2 ? data[data.length - 1].count - data[data.length - 2].count : 0;
                  const prevGrowth = data.length >= 3 ? data[data.length - 2].count - data[data.length - 3].count : 0;
                  const percent = prevGrowth !== 0 ? ((growth - prevGrowth) / Math.abs(prevGrowth)) * 100 : 0;
                  
                  return (
                     <>
                        <FontAwesome6 name={growth >= 0 ? "arrow-up" : "arrow-down"} size={14} color={growth >= 0 ? "#10b981" : "#ef4444"} />
                        <Text style={styles.trendGrowthText}>今日新增 {growth >= 0 ? '+' : ''}{growth}</Text>
                        <Text style={styles.trendGrowthPercent}>较昨日 {percent >= 0 ? '+' : ''}{percent.toFixed(1)}%</Text>
                     </>
                  );
              })()}
            </View>
          </View>
        </View>

        {/* 项目链接 */}
        <View style={styles.linksCard}>
          <Text style={styles.linksTitle}>相关链接</Text>
          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkItem} onPress={handleReadmePress}>
              <View style={styles.linkItemLeft}>
                <FontAwesome6 name="book-open" size={18} color="#1f2937" />
                <Text style={styles.linkItemText}>阅读文档 (README)</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem} onPress={handleGithubPress}>
              <View style={styles.linkItemLeft}>
                <FontAwesome6 name="github" size={18} color="#1f2937" />
                <Text style={styles.linkItemText}>GitHub 仓库</Text>
              </View>
              <FontAwesome6 name="external-link" size={14} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem} onPress={handleDocsPress}>
              <View style={styles.linkItemLeft}>
                <FontAwesome6 name="book" size={18} color="#1f2937" />
                <Text style={styles.linkItemText}>官方文档</Text>
              </View>
              <FontAwesome6 name="external-link" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.githubButton} onPress={handleGithubPress}>
          <FontAwesome6 name="github" size={16} color="#ffffff" />
          <Text style={styles.githubButtonText}>前往 GitHub</Text>
        </TouchableOpacity>
      </View>

      {/* 轻提示 */}
      {isToastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProjectDetailScreen;

