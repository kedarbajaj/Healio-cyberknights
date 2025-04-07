
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Heart, Activity, Brain, MessageCircle, Stethoscope, User } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-healio-dark">
                    Your AI-Powered Health Companion
                  </h1>
                  <p className="text-xl text-gray-600">
                    Healio uses advanced predictive analysis to assess your health risks and provide personalized recommendations.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button asChild size="lg" className="bg-healio-primary hover:bg-healio-primary/90">
                    <Link to="/signup">Start Your Assessment</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-healio-primary text-healio-primary hover:bg-healio-primary/10">
                    <Link to="/login">Login to Your Account</Link>
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative w-full h-[400px] bg-gradient-to-br from-healio-secondary/20 to-healio-primary/20 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="w-32 h-32 text-healio-primary opacity-50 animate-pulse-slow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-healio-dark mb-4">How Healio Helps You</h2>
              <p className="text-gray-600">Our AI-powered health companion provides comprehensive health analysis and personalized recommendations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Activity className="h-10 w-10 text-healio-primary" />}
                title="Health Risk Assessment"
                description="Receive a personalized health risk assessment based on your medical history and lifestyle."
              />
              
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-healio-primary" />}
                title="Predictive Analysis"
                description="AI-powered predictive analytics to identify potential health risks before they become serious."
              />
              
              <FeatureCard
                icon={<Stethoscope className="h-10 w-10 text-healio-primary" />}
                title="Symptom Checker"
                description="Describe your symptoms and get an initial assessment of potential health issues."
              />
              
              <FeatureCard
                icon={<User className="h-10 w-10 text-healio-primary" />}
                title="Personalized Recommendations"
                description="Get tailored health tips and lifestyle recommendations based on your unique health profile."
              />
              
              <FeatureCard
                icon={<MessageCircle className="h-10 w-10 text-healio-primary" />}
                title="Interactive Assessment"
                description="Complete a comprehensive health assessment including dietary preferences and document analysis."
              />
              
              <FeatureCard
                icon={<Heart className="h-10 w-10 text-healio-primary" />}
                title="Health Tracking"
                description="Monitor your health metrics over time and visualize your progress towards better health."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-healio-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-healio-dark mb-4">Ready to Take Control of Your Health?</h2>
              <p className="text-gray-600 mb-8">
                Start your health journey with Healio today and get personalized insights into your health risks and recommendations.
              </p>
              <Button asChild size="lg" className="bg-healio-primary hover:bg-healio-primary/90">
                <Link to="/signup">Create Your Free Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-healio-primary mr-2" />
              <span className="text-xl font-bold text-healio-dark">Healio</span>
            </div>
            <p className="text-sm text-gray-500">
              Healio - Your Health, Our Priority
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-healio-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
