import { User } from '../types';
import { getAllUsers } from './auth';
import { getAllDocuments, analyzeDocumentTopics } from './documentManager';

export interface AnalyticsData {
  totalUsers: number;
  totalDocuments: number;
  totalScansToday: number;
  topUsers: {
    username: string;
    scansToday: number;
  }[];
  creditUsage: {
    username: string;
    creditsUsed: number;
  }[];
  topDocumentTopics: {
    topic: string;
    count: number;
  }[];
}

export const generateAnalytics = (): AnalyticsData => {
  const users = getAllUsers();
  const documents = getAllDocuments();
  
  // Calculate total scans today
  const totalScansToday = users.reduce((total, user) => total + user.scansToday, 0);
  
  // Get top users by scans today
  const topUsers = [...users]
    .sort((a, b) => b.scansToday - a.scansToday)
    .slice(0, 5)
    .map(user => ({
      username: user.username,
      scansToday: user.scansToday
    }));
  
  // Calculate credit usage (20 - remaining credits for regular users)
  const creditUsage = users
    .filter(user => user.role === 'user')
    .map(user => ({
      username: user.username,
      creditsUsed: 20 - user.credits
    }))
    .sort((a, b) => b.creditsUsed - a.creditsUsed);
  
  // Get top document topics
  const wordFrequency = analyzeDocumentTopics();
  const topDocumentTopics = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));
  
  return {
    totalUsers: users.length,
    totalDocuments: documents.length,
    totalScansToday,
    topUsers,
    creditUsage,
    topDocumentTopics
  };
};