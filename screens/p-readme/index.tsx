import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getReadme } from '../../services/github';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../../services/i18n';

const ReadmeScreen = () => {
  const params = useLocalSearchParams<{ owner: string; repo: string; default_branch: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadme();
  }, [params.owner, params.repo]);

  const loadReadme = async () => {
    if (!params.owner || !params.repo) return;
    setLoading(true);
    try {
      const markdown = await getReadme(params.owner, params.repo);
      const processed = processMarkdown(markdown);
      setContent(processed);
    } catch (e) {
      setContent(i18n.t('readme_load_error'));
    } finally {
      setLoading(false);
    }
  };

  const processMarkdown = (md: string) => {
    const baseUrl = `https://raw.githubusercontent.com/${params.owner}/${params.repo}/${params.default_branch || 'master'}/`;
    const proxyBase = 'https://images.weserv.nl/?url=';

    let processed = md.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      let finalUrl = url;
      if (!url.startsWith('http')) {
         const cleanPath = url.startsWith('/') ? url.slice(1) : url;
         const normalizedPath = cleanPath.startsWith('./') ? cleanPath.slice(2) : cleanPath;
         finalUrl = baseUrl + normalizedPath;
      }
      
      return `![${alt}](${proxyBase}${encodeURIComponent(finalUrl)})`;
    });

    // Remove HTML tags that might interfere with rendering
    processed = processed
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p.*?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<div.*?>/gi, '')
      .replace(/<\/div>/gi, '')
      .replace(/<img.*?>/gi, '')
      .replace(/<a.*?>/gi, '')
      .replace(/<\/a>/gi, '')
      .replace(/<h\d.*?>/gi, '\n# ')
      .replace(/<\/h\d>/gi, '\n')
      .replace(/<center>/gi, '')
      .replace(/<\/center>/gi, '')
      // Aggressive tag removal for remaining tags that might cause issues,
      // but being careful not to remove things that look like tags in code blocks.
      // Ideally we would only strip tags outside code blocks, but that's complex.
      // For now, let's fix the specific <p issue reported.
      .replace(/<p/gi, ''); // Simple strip of floating <p if any remaining
      
    return processed;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'README', headerBackTitle: i18n.t('back') }} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Markdown style={markdownStyles}>
            {content}
          </Markdown>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  image: {
    borderRadius: 8,
    marginVertical: 10,
  },
  code_block: {
    backgroundColor: '#f6f8fa',
    padding: 10,
    borderRadius: 6,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  link: {
    color: '#0969da',
  },
};

export default ReadmeScreen;
