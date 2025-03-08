import { create } from 'zustand';
import { Document, ScanResult } from '../types';
import { 
  addDocument, 
  getUserDocuments, 
  findSimilarDocuments 
} from '../utils/documentManager';
import { deductCredit } from '../utils/auth';
import { useAuthStore } from './authStore';

interface DocumentState {
  userDocuments: Document[];
  scanResults: ScanResult[];
  isScanning: boolean;
  scanError: string | null;
  fetchUserDocuments: () => void;
  scanDocument: (title: string, content: string) => Promise<boolean>;
  clearScanResults: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  userDocuments: [],
  scanResults: [],
  isScanning: false,
  scanError: null,
  
  fetchUserDocuments: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const documents = getUserDocuments(user.id);
    set({ userDocuments: documents });
  },
  
  scanDocument: async (title: string, content: string) => {
    set({ isScanning: true, scanError: null });
    
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isScanning: false, scanError: 'User not authenticated' });
      return false;
    }
    
    // Check if user has enough credits
    const hasCredits = deductCredit(user.id);
    if (!hasCredits) {
      set({ 
        isScanning: false, 
        scanError: 'Not enough credits. Please request more credits or wait until tomorrow.' 
      });
      return false;
    }
    
    // Refresh user data after credit deduction
    useAuthStore.getState().refreshUser();
    
    try {
      // Add document to user's collection
      addDocument(user.id, title, content);
      
      // Find similar documents
      const results = findSimilarDocuments(content);
      
      set({ 
        scanResults: results,
        isScanning: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        isScanning: false, 
        scanError: 'Error scanning document' 
      });
      return false;
    }
  },
  
  clearScanResults: () => {
    set({ scanResults: [], scanError: null });
  },
}));