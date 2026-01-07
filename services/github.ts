import { Alert } from 'react-native';
import { GITHUB_API_URL } from '../config';

const BASE_URL = GITHUB_API_URL;

export interface GitHubProject {
  id: string;
  name: string;
  author: string;
  repo: string;
  description: string;
  stars: string;
  stargazers_count: number;
  forks: string;
  language: string;
  dailyStars: string;
  isBookmarked: boolean;
  html_url: string;
  default_branch: string;
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
  total_count: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  default_branch: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const CACHE_DURATION = 60 * 1000; // 1 minute cache
const requestCache = new Map<string, { data: GitHubProject[], timestamp: number }>();

export const searchRepositories = async (
  query: string = 'stars:>1000',
  sort: string = 'stars',
  order: string = 'desc',
  page: number = 1,
  perPage: number = 10
): Promise<GitHubProject[]> => {
  const cacheKey = `${query}-${sort}-${order}-${page}-${perPage}`;
  const cached = requestCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 403 || response.status === 429) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();

    const projects = data.items.map((repo) => ({
      id: repo.id.toString(),
      name: repo.name,
      author: repo.owner.login,
      repo: repo.full_name,
      description: repo.description || 'No description provided',
      stars: formatNumber(repo.stargazers_count),
      stargazers_count: repo.stargazers_count,
      forks: formatNumber(repo.forks_count),
      language: repo.language || 'Unknown',
      dailyStars: '', // GitHub API doesn't provide daily stars directly in search
      isBookmarked: false,
      html_url: repo.html_url,
      default_branch: repo.default_branch,
    }));

    requestCache.set(cacheKey, { data: projects, timestamp: Date.now() });
    return projects;
  } catch (error: any) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      throw error;
    }
    console.error('Failed to fetch repositories:', error);
    return [];
  }
};

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubUserDetails extends GitHubUser {
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export const getUserDetails = async (username: string): Promise<GitHubUserDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.status === 403 || response.status === 429) {
       throw new Error('RATE_LIMIT_EXCEEDED');
    }

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to get user details:', error);
    return null;
  }
};

export const getUserRepos = async (username: string, page: number = 1): Promise<GitHubProject[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&page=${page}&per_page=10`, {
       headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (response.status === 403 || response.status === 429) {
       throw new Error('RATE_LIMIT_EXCEEDED');
    }

    if (!response.ok) throw new Error('Failed to fetch repos');
    
    const data: GitHubRepo[] = await response.json();
     
    return data.map((repo) => ({
      id: repo.id.toString(),
      name: repo.name,
      author: repo.owner.login,
      repo: repo.full_name,
      description: repo.description || 'No description provided',
      stars: formatNumber(repo.stargazers_count),
      stargazers_count: repo.stargazers_count,
      forks: formatNumber(repo.forks_count),
      language: repo.language || 'Unknown',
      dailyStars: '',
      isBookmarked: false,
      html_url: repo.html_url,
      default_branch: repo.default_branch,
    }));
  } catch (error) {
    console.error('Failed to get user repos:', error);
    return [];
  }
};

interface GitHubUserSearchResponse {
  items: GitHubUser[];
  total_count: number;
}

export const searchUsers = async (
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<GitHubUser[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 403 || response.status === 429) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubUserSearchResponse = await response.json();
    return data.items;
  } catch (error: any) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      throw error;
    }
    console.error('Failed to search users:', error);
    return [];
  }
};

export const getReadme = async (owner: string, repo: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.raw',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return '# No README found';
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch README:', error);
    return '# Failed to load README';
  }
};


export const getTrendingRepositories = async (
  since: 'daily' | 'weekly' | 'monthly' = 'daily',
  language: string = ''
): Promise<GitHubProject[]> => {
  // Since GitHub API doesn't have a direct "trending" endpoint, we simulate it using search
  // with date ranges.
  const date = new Date();
  
  if (since === 'daily') {
    date.setDate(date.getDate() - 1);
  } else if (since === 'weekly') {
    date.setDate(date.getDate() - 7);
  } else {
    date.setDate(date.getDate() - 30);
  }
  
  const dateString = date.toISOString().split('T')[0];
  let query = `created:>${dateString}`;
  
  if (language) {
    query += ` language:${language}`;
  }

  return searchRepositories(query, 'stars', 'desc');
};

export const getRepository = async (owner: string, repo: string): Promise<GitHubProject | null> => {
  try {
    const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('ProjectNotFound');
      }
      if (response.status === 403) {
        throw new Error('RateLimitExceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubRepo = await response.json();

    return {
      id: data.id.toString(),
      name: data.name,
      author: data.owner.login,
      repo: data.full_name,
      description: data.description || 'No description provided',
      stars: formatNumber(data.stargazers_count),
      stargazers_count: data.stargazers_count,
      forks: formatNumber(data.forks_count),
      language: data.language || 'Unknown',
      dailyStars: '',
      isBookmarked: false,
      html_url: data.html_url,
      default_branch: data.default_branch,
    };
  } catch (error: any) {
    console.error('Failed to fetch repository:', error);
    throw error; // Re-throw to let caller handle
  }
};

export interface GitHubTopic {
  name: string;
  display_name: string | null;
  short_description: string | null;
  description: string | null;
  created_by: string | null;
  released: string | null;
  created_at: string;
  updated_at: string;
  featured: boolean;
  curated: boolean;
  score: number;
}

interface GitHubTopicSearchResponse {
  items: GitHubTopic[];
  total_count: number;
}

export const getHotTopics = async (): Promise<GitHubTopic[]> => {
  try {
    // Search for topics with "react" or generic terms to get some data, 
    // or just search with a broad query since there is no "trending topics" endpoint.
    // We use a few popular keywords to simulate "hot" topics.
    const response = await fetch(
      `${BASE_URL}/search/topics?q=is:featured&per_page=6`,
      {
        headers: {
          'Accept': 'application/vnd.github.mercy-preview+json', // Topics API preview header
        },
      }
    );

    if (!response.ok) {
      // Fallback if preview header fails or other error
      console.warn('Topics API failed, falling back');
      return [];
    }

    const data: GitHubTopicSearchResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    return [];
  }
};

export const getStarHistory = async (owner: string, repo: string): Promise<string[]> => {
  try {
    // Get last 100 stargazers with timestamp
    // Note: This creates a limitation where we can only track the trend for the last 100 stars.
    // For very popular repos, this might only cover a few hours.
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/stargazers?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.star+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: { starred_at: string }[] = await response.json();
    return data.map(item => item.starred_at);
  } catch (error) {
    console.error('Failed to fetch star history:', error);
    return [];
  }
};
