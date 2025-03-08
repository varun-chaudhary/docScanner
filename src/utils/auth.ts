import { User } from '../types';

// In a real app, this would be stored in a database
let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    credits: 999,
    scansToday: 0,
    lastReset: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user',
    password: 'user123', 
    role: 'user',
    credits: 20,
    scansToday: 0,
    lastReset: new Date().toISOString(),
  },
];

export const registerUser = (username: string, password: string): User | null => {
  // Check if username already exists
  if (users.find((user) => user.username === username)) {
    return null;
  }

  const newUser: User = {
    id: (users.length + 1).toString(),
    username,
    password, 
    role: 'user',
    credits: 20,
    scansToday: 0,
    lastReset: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
};

export const loginUser = (username: string, password: string): User | null => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user || null;
};

export const getUser = (userId: string): User | null => {
  return users.find((user) => user.id === userId) || null;
};

export const updateUser = (updatedUser: User): User | null => {
  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index === -1) return null;
  
  users[index] = updatedUser;
  return updatedUser;
};

export const getAllUsers = (): User[] => {
  return users;
};

export const resetDailyCredits = (): void => {
  const today = new Date().toISOString().split('T')[0];
  
  users = users.map(user => {
    const lastResetDate = user.lastReset.split('T')[0];
    
    if (lastResetDate !== today) {
      return {
        ...user,
        credits: user.role === 'admin' ? user.credits : user.credits + 20,
        scansToday: 0,
        lastReset: new Date().toISOString()
      };
    }
    
    return user;
  });
};

// Check and reset credits if needed
export const checkAndResetCredits = (userId: string): User | null => {
  const user = getUser(userId);
  if (!user) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const lastResetDate = user.lastReset.split('T')[0];
  
  if (lastResetDate !== today) {
    const updatedUser = {
      ...user,
      credits: user.role === 'admin' ? user.credits : 20,
      scansToday: 0,
      lastReset: new Date().toISOString()
    };
    
    return updateUser(updatedUser);
  }
  
  return user;
};

// Deduct credit from user
export const deductCredit = (userId: string): boolean => {
  const user = checkAndResetCredits(userId);
  if (!user) return false;
  
  if (user.credits <= 0) return false;
  
  const updatedUser = {
    ...user,
    credits: user.credits - 1,
    scansToday: user.scansToday + 1
  };
  
  updateUser(updatedUser);
  return true;
};

// Add credits to user
export const addCredits = (userId: string, amount: number): User | null => {
  const user = getUser(userId);
  if (!user) return null;
  
  const updatedUser = {
    ...user,
    credits: user.credits + amount
  };
  
  return updateUser(updatedUser);
};