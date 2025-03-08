export interface User {
  id: string;
  username: string;
  password: string; 
  role: 'user' | 'admin';
  credits: number;
  scansToday: number;
  lastReset: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string; 
}

export interface CreditRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string; 
}

export interface ScanResult {
  documentId: string;
  title: string;
  similarity: number;
}