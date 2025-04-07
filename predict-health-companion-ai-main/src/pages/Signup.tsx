
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import AuthForm from '@/components/auth/AuthForm';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
