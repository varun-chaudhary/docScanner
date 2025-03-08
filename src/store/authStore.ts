import { create } from 'zustand';
import { User } from '../types';
import { loginUser, registerUser, checkAndResetCredits } from '../utils/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  refreshUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  
  login: (username: string, password: string) => {
    const user = loginUser(username, password);
    
    if (user) {
      const updatedUser = checkAndResetCredits(user.id);
      
      set({
        user: updatedUser || user,
        isAuthenticated: true,
        isAdmin: (updatedUser || user).role === 'admin',
      });
      return true;
    }
    
    return false;
  },
  
  register: (username: string, password: string) => {
    const user = registerUser(username, password);
    
    if (user) {
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },
  
  refreshUser: () => {
    const { user } = get();
    if (user) {
      const updatedUser = checkAndResetCredits(user.id);
      if (updatedUser) {
        set({
          user: updatedUser,
          isAdmin: updatedUser.role === 'admin',
        });
      }
    }
  },
}));