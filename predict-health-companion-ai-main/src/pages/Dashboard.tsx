
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useUser } from '@/contexts/UserContext';
import { useRequireAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import HealthMetrics from '@/components/dashboard/HealthMetrics';
import RiskFactors from '@/components/dashboard/RiskFactors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { isAuthenticated, loading } = useRequireAuth();
  const { user, assessment, healthRisks, recommendations, dietPlan } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user hasn't completed assessment, redirect to assessment page
    if (!loading && isAuthenticated && user && !user.assessmentCompleted) {
      toast.info('Please complete your health assessment first');
      navigate('/assessment');
    }
  }, [loading, user, isAuthenticated, navigate]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-healio-dark">Your Health Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Here's your personalized health overview and recommendations based on your assessment.
          </p>
        </header>
        
        {!user?.assessmentCompleted ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-8 space-y-4">
                <AlertCircle className="h-16 w-16 text-healio-warning" />
                <h2 className="text-xl font-semibold">Assessment Required</h2>
                <p className="text-gray-600 max-w-md">
                  To view your personalized health dashboard, please complete the health assessment first.
                </p>
                <Button onClick={() => navigate('/assessment')} className="bg-healio-primary hover:bg-healio-primary/90">
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Health Metrics */}
            <Card>
              <CardContent className="p-6">
                <HealthMetrics healthRisks={healthRisks} />
              </CardContent>
            </Card>
            
            {/* Recommendations */}
            <Card>
              <CardContent className="p-6">
                <RiskFactors recommendations={recommendations} dietPlan={dietPlan} />
              </CardContent>
            </Card>
            
            {/* Health Records */}
            <Card>
              <CardHeader>
                <CardTitle>Health Documents</CardTitle>
                <CardDescription>Uploaded medical records and documents</CardDescription>
              </CardHeader>
              <CardContent>
                {assessment?.uploadedDocuments && assessment.uploadedDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {assessment.uploadedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <FileText className="h-5 w-5 text-healio-primary mr-2" />
                        <span className="text-sm">Document {index + 1}</span>
                        <Button variant="link" size="sm" className="ml-auto text-healio-primary">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No documents uploaded yet</p>
                    <Button 
                      variant="link" 
                      className="text-healio-primary mt-2"
                      onClick={() => navigate('/assessment')}
                    >
                      Upload Documents
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
