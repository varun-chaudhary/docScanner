import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FileText, BarChart2, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <FileText className="mr-2" />
          DocScanner
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-gray-300">
              Credits: <span className="font-bold">{user.credits}</span>
            </span>
          )}
          
          <Link to="/scan" className="hover:text-gray-300">Scan Document</Link>
          <Link to="/profile" className="hover:text-gray-300">
            <User className="inline mr-1" size={18} />
            Profile
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="hover:text-gray-300">
              <BarChart2 className="inline mr-1" size={18} />
              Admin
            </Link>
          )}
          
          <button 
            onClick={handleLogout}
            className="flex items-center hover:text-gray-300"
          >
            <LogOut className="mr-1" size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;