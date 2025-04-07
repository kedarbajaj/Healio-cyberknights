
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (type === 'login') {
        await login(email, password);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        await signup(email, name, password);
        toast.success('Account created successfully');
        navigate('/assessment');
      }
    } catch (error) {
      toast.error(type === 'login' ? 'Login failed' : 'Signup failed');
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {type === 'login' ? 'Sign in to Healio' : 'Create your Healio account'}
        </CardTitle>
        <CardDescription>
          {type === 'login'
            ? 'Enter your credentials to access your account'
            : 'Enter your details to create an account'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {type === 'login' && (
                <a href="#" className="text-sm text-healio-primary hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-healio-primary hover:bg-healio-primary/90">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
          
          <div className="text-center text-sm">
            {type === 'login' ? (
              <p>
                Don't have an account?{' '}
                <a href="/signup" className="text-healio-primary hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-healio-primary hover:underline">
                  Sign in
                </a>
              </p>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
