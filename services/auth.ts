import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  username: string;
  password?: string; // Encrypted in real app, plain text for this demo as requested "save locally"
  nickname: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  githubId?: string;
  joinDate?: string;
  lastActive?: string;
}

const USERS_KEY = '@users_db';
const CURRENT_USER_KEY = '@userProfile';

export const registerUser = async (username: string, password: string): Promise<User> => {
  throw new Error('Registration is disabled. Please use GitHub login.');
};

export const loginUser = async (username: string, password: string): Promise<User> => {
   throw new Error('Password login is disabled. Please use GitHub login.');
};

export const loginWithGitHub = async (githubProfile: any): Promise<User> => {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};
  
  // Find user by githubId
  let existingUser = Object.values(users).find(u => u.githubId === githubProfile.id.toString());

  const now = new Date().toISOString();

  if (existingUser) {
    // Update existing user info with latest from GitHub
    existingUser.nickname = githubProfile.name || githubProfile.login;
    existingUser.avatar = githubProfile.avatar_url;
    existingUser.bio = githubProfile.bio || existingUser.bio;
    existingUser.location = githubProfile.location || existingUser.location;
    existingUser.website = githubProfile.blog || existingUser.website;
    existingUser.lastActive = githubProfile.updated_at || now; // Use GitHub updated_at or now
    
    // Save updated user
    users[existingUser.username] = existingUser;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existingUser));
    return existingUser;
  }

  // Create new user linked to GitHub
  const username = githubProfile.login;
  // Handle collision if username exists but not linked to GitHub (edge case, just append suffix)
  let finalUsername = username;
  if (users[finalUsername]) {
    finalUsername = `${username}_gh`;
  }

  const newUser: User = {
    username: finalUsername,
    nickname: githubProfile.name || githubProfile.login,
    avatar: githubProfile.avatar_url,
    bio: githubProfile.bio || 'GitHub User',
    location: githubProfile.location || '',
    website: githubProfile.blog || '',
    githubId: githubProfile.id.toString(),
    joinDate: githubProfile.created_at || now, // Use GitHub created_at
    lastActive: githubProfile.updated_at || now,
  };

  users[finalUsername] = newUser;
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const deleteUser = async (): Promise<void> => {
  const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserJson) return;

  const currentUser = JSON.parse(currentUserJson);
  const username = currentUser.username;

  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  if (usersJson) {
    const users = JSON.parse(usersJson);
    delete users[username];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  await AsyncStorage.removeItem(CURRENT_USER_KEY);
  // Optional: Clear user-specific data like history/bookmarks if they were namespaced
  // For this MVP, we might leave them or clear them. 
  // Let's clear common data keys to ensure a fresh start
  await AsyncStorage.removeItem('@browseHistory');
  await AsyncStorage.removeItem('@bookmarked_projects');
  await AsyncStorage.removeItem('@registrationDate');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};
