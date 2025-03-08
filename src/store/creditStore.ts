import { create } from 'zustand';
import { CreditRequest } from '../types';
import { 
  requestCredits, 
  getUserCreditRequests, 
  getAllCreditRequests,
  approveCreditRequest,
  denyCreditRequest
} from '../utils/creditManager';
import { useAuthStore } from './authStore';

interface CreditState {
  userRequests: CreditRequest[];
  allRequests: CreditRequest[];
  requestError: string | null;
  fetchUserRequests: () => void;
  fetchAllRequests: () => void;
  submitCreditRequest: (amount: number, reason: string) => boolean;
  approveRequest: (requestId: string) => boolean;
  denyRequest: (requestId: string) => boolean;
}

export const useCreditStore = create<CreditState>((set) => ({
  userRequests: [],
  allRequests: [],
  requestError: null,
  
  fetchUserRequests: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const requests = getUserCreditRequests(user.id);
    set({ userRequests: requests });
  },
  
  fetchAllRequests: () => {
    const isAdmin = useAuthStore.getState().isAdmin;
    if (!isAdmin) return;
    
    const requests = getAllCreditRequests();
    set({ allRequests: requests });
  },
  
  submitCreditRequest: (amount: number, reason: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ requestError: 'User not authenticated' });
      return false;
    }
    
    if (amount <= 0) {
      set({ requestError: 'Amount must be greater than 0' });
      return false;
    }
    
    const request = requestCredits(user.id, amount, reason);
    if (!request) {
      set({ requestError: 'Failed to submit request' });
      return false;
    }
    
    // Refresh user requests
    const requests = getUserCreditRequests(user.id);
    set({ userRequests: requests, requestError: null });
    
    return true;
  },
  
  approveRequest: (requestId: string) => {
    const isAdmin = useAuthStore.getState().isAdmin;
    if (!isAdmin) return false;
    
    const result = approveCreditRequest(requestId);
    if (!result) return false;
    
    // Refresh all requests
    const requests = getAllCreditRequests();
    set({ allRequests: requests });
    
    // Refresh user data
    useAuthStore.getState().refreshUser();
    
    return true;
  },
  
  denyRequest: (requestId: string) => {
    const isAdmin = useAuthStore.getState().isAdmin;
    if (!isAdmin) return false;
    
    const result = denyCreditRequest(requestId);
    if (!result) return false;
    
    // Refresh all requests
    const requests = getAllCreditRequests();
    set({ allRequests: requests });
    
    return true;
  },
}));