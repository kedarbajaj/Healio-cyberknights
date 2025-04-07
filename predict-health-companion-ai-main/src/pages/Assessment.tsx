
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import { useRequireAuth } from '@/hooks/useAuth';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Assessment = () => {
  const { isAuthenticated, loading } = useRequireAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user has completed assessment, redirect to dashboard
    if (!loading && user?.assessmentCompleted) {
      navigate('/dashboard');
    }
  }, [loading, user, navigate]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-healio-dark mb-2">Health Assessment</h1>
            <p className="text-gray-600">
              Complete this comprehensive health assessment to receive personalized health insights and recommendations.
            </p>
          </div>
          
          <AssessmentForm />
        </div>
      </div>
    </div>
  );
};

export default Assessment;
