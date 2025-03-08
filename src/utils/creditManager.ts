import { CreditRequest } from '../types';
import { getUser, addCredits } from './auth';

// In a real app, this would be stored in a database
let creditRequests: CreditRequest[] = [];

export const requestCredits = (userId: string, amount: number, reason: string): CreditRequest | null => {
  const user = getUser(userId);
  if (!user) return null;

  const newRequest: CreditRequest = {
    id: (creditRequests.length + 1).toString(),
    userId,
    username: user.username,
    amount,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  creditRequests.push(newRequest);
  return newRequest;
};

export const getUserCreditRequests = (userId: string): CreditRequest[] => {
  return creditRequests.filter((req) => req.userId === userId);
};

export const getAllCreditRequests = (): CreditRequest[] => {
  return creditRequests;
};

export const approveCreditRequest = (requestId: string): CreditRequest | null => {
  const index = creditRequests.findIndex((req) => req.id === requestId);
  if (index === -1) return null;
  
  const request = creditRequests[index];
  if (request.status !== 'pending') return null;
  
  // Update request status
  const updatedRequest = {
    ...request,
    status: 'approved' as const,
  };
  
  creditRequests[index] = updatedRequest;
  
  // Add credits to user
  addCredits(request.userId, request.amount);
  
  return updatedRequest;
};

export const denyCreditRequest = (requestId: string): CreditRequest | null => {
  const index = creditRequests.findIndex((req) => req.id === requestId);
  if (index === -1) return null;
  
  const request = creditRequests[index];
  if (request.status !== 'pending') return null;
  
  // Update request status
  const updatedRequest = {
    ...request,
    status: 'denied' as const,
  };
  
  creditRequests[index] = updatedRequest;
  
  return updatedRequest;
};