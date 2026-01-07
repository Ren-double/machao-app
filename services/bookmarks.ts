import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@bookmarked_projects';

export interface BookmarkProject {
  id: string;
  name: string;
  author: string;
  repo: string;
  description: string;
  stars: string;
  forks: string;
  language: string;
  // Add other fields as needed
  [key: string]: any;
}

export const getBookmarks = async (): Promise<BookmarkProject[]> => {
  try {
    const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

export const addBookmark = async (project: BookmarkProject): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    if (!bookmarks.some(b => b.id === project.id)) {
      bookmarks.unshift(project);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Failed to add bookmark:', error);
    throw error;
  }
};

export const removeBookmark = async (projectId: string): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const newBookmarks = bookmarks.filter(b => b.id !== projectId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
    throw error;
  }
};

export const checkIsBookmarked = async (projectId: string): Promise<boolean> => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some(b => b.id === projectId);
  } catch (error) {
    return false;
  }
};
