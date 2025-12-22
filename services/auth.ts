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
}

const USERS_KEY = '@users_db';
const CURRENT_USER_KEY = '@userProfile';

export const registerUser = async (username: string, password: string): Promise<User> => {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};

  if (users[username]) {
    throw new Error('用户名已存在');
  }

  const newUser: User = {
    username,
    password, // Note: In production, hash this!
    nickname: username,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: '这里还没有个人简介...',
    location: '未知',
    website: '',
    joinDate: new Date().toISOString(),
  };

  users[username] = newUser;
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Login automatically
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};

  const user = users[username];
  if (!user || user.password !== password) {
    throw new Error('用户名或密码错误');
  }

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const loginWithGitHub = async (githubProfile: any): Promise<User> => {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};
  
  // Find user by githubId
  let existingUser = Object.values(users).find(u => u.githubId === githubProfile.id.toString());

  if (existingUser) {
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
    joinDate: new Date().toISOString(),
  };

  users[finalUsername] = newUser;
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};
