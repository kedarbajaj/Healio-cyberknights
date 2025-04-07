
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-healio-primary mr-2" />
              <span className="text-2xl font-bold text-healio-dark">Healio</span>
            </Link>
          </div>
          
          <nav>
            <ul className="flex space-x-8">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-healio-dark hover:text-healio-primary transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/assessment" className="text-healio-dark hover:text-healio-primary transition-colors">
                      Assessment
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">Welcome, {user?.name}</span>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="border-healio-primary text-healio-primary hover:bg-healio-primary hover:text-white"
                      >
                        Log out
                      </Button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-healio-dark hover:text-healio-primary transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Button asChild>
                      <Link to="/signup" className="bg-healio-primary hover:bg-healio-primary/90">
                        Sign Up
                      </Link>
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
