
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);
  
  return { isAuthenticated, loading };
}
