
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AssessmentData, HealthRisk, HealthRecommendation, DietPlan } from '@/types';

interface UserContextType {
  user: User | null;
  assessment: AssessmentData | null;
  healthRisks: HealthRisk[];
  recommendations: HealthRecommendation[];
  dietPlan: DietPlan | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  saveAssessment: (data: AssessmentData) => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  email: 'demo@healio.com',
  name: 'Demo User',
  assessmentCompleted: false
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [healthRisks, setHealthRisks] = useState<HealthRisk[]>([]);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check localStorage on init
    const storedUser = localStorage.getItem('healio_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedAssessment = localStorage.getItem('healio_assessment');
    if (storedAssessment) {
      setAssessment(JSON.parse(storedAssessment));
    }
    
    const storedRisks = localStorage.getItem('healio_risks');
    if (storedRisks) {
      setHealthRisks(JSON.parse(storedRisks));
    }
    
    const storedRecommendations = localStorage.getItem('healio_recommendations');
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
    
    const storedDietPlan = localStorage.getItem('healio_diet');
    if (storedDietPlan) {
      setDietPlan(JSON.parse(storedDietPlan));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use a mock user
      if (email === 'demo@healio.com' && password === 'password') {
        setUser(MOCK_USER);
        localStorage.setItem('healio_user', JSON.stringify(MOCK_USER));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const newUser = {
        ...MOCK_USER,
        email,
        name,
      };
      
      setUser(newUser);
      localStorage.setItem('healio_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healio_user');
  };

  const saveAssessment = async (data: AssessmentData) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setAssessment(data);
      localStorage.setItem('healio_assessment', JSON.stringify(data));
      
      // Mock generating health risks based on the assessment data
      const mockRisks = generateMockHealthRisks(data);
      setHealthRisks(mockRisks);
      localStorage.setItem('healio_risks', JSON.stringify(mockRisks));
      
      // Mock generating recommendations
      const mockRecommendations = generateMockRecommendations(data, mockRisks);
      setRecommendations(mockRecommendations);
      localStorage.setItem('healio_recommendations', JSON.stringify(mockRecommendations));
      
      // Mock generating diet plan
      const mockDietPlan = generateMockDietPlan(data);
      setDietPlan(mockDietPlan);
      localStorage.setItem('healio_diet', JSON.stringify(mockDietPlan));
      
      // Update user to indicate assessment is completed
      if (user) {
        const updatedUser = {...user, assessmentCompleted: true};
        setUser(updatedUser);
        localStorage.setItem('healio_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Save assessment failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    assessment,
    healthRisks,
    recommendations,
    dietPlan,
    loading,
    login,
    signup,
    logout,
    saveAssessment,
    isAuthenticated: !!user
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Helper function to generate mock health risks based on assessment data
function generateMockHealthRisks(assessment: AssessmentData): HealthRisk[] {
  const risks: HealthRisk[] = [];
  
  // Heart disease risk
  if (assessment.familyHistory.heartDisease || assessment.lifestyle.smokingStatus !== 'never' || assessment.lifestyle.exerciseFrequency === 'rarely') {
    risks.push({
      condition: 'Heart Disease',
      riskLevel: assessment.familyHistory.heartDisease ? 'high' : 'moderate',
      score: assessment.familyHistory.heartDisease ? 75 : 45,
      factors: [
        assessment.familyHistory.heartDisease ? 'Family history of heart disease' : '',
        assessment.lifestyle.smokingStatus !== 'never' ? 'Smoking' : '',
        assessment.lifestyle.exerciseFrequency === 'rarely' ? 'Low physical activity' : '',
        assessment.lifestyle.stressLevel > 7 ? 'High stress levels' : '',
      ].filter(f => f !== '')
    });
  }
  
  // Diabetes risk
  if (assessment.familyHistory.diabetes || assessment.lifestyle.dietType === 'unhealthy' || assessment.personalInfo.age > 45) {
    risks.push({
      condition: 'Diabetes',
      riskLevel: assessment.familyHistory.diabetes ? 'high' : 'moderate',
      score: assessment.familyHistory.diabetes ? 70 : 40,
      factors: [
        assessment.familyHistory.diabetes ? 'Family history of diabetes' : '',
        assessment.lifestyle.dietType === 'unhealthy' ? 'Poor diet' : '',
        assessment.personalInfo.age > 45 ? 'Age over 45' : '',
        assessment.lifestyle.exerciseFrequency === 'rarely' ? 'Low physical activity' : '',
      ].filter(f => f !== '')
    });
  }
  
  // Mental health risk
  if (assessment.lifestyle.stressLevel > 7 || assessment.lifestyle.sleepHours < 6) {
    risks.push({
      condition: 'Anxiety/Depression',
      riskLevel: assessment.lifestyle.stressLevel > 8 ? 'high' : 'moderate',
      score: assessment.lifestyle.stressLevel > 8 ? 65 : 35,
      factors: [
        assessment.lifestyle.stressLevel > 7 ? 'High stress levels' : '',
        assessment.lifestyle.sleepHours < 6 ? 'Poor sleep' : '',
        assessment.lifestyle.exerciseFrequency === 'rarely' ? 'Low physical activity' : '',
      ].filter(f => f !== '')
    });
  }
  
  // Add a low risk condition to show contrast
  risks.push({
    condition: 'Respiratory Issues',
    riskLevel: 'low',
    score: 20,
    factors: ['General environmental factors']
  });
  
  return risks;
}

// Helper function to generate mock recommendations
function generateMockRecommendations(assessment: AssessmentData, risks: HealthRisk[]): HealthRecommendation[] {
  const recommendations: HealthRecommendation[] = [];
  
  // Exercise recommendations
  if (assessment.lifestyle.exerciseFrequency === 'rarely' || assessment.lifestyle.exerciseFrequency === 'occasionally') {
    recommendations.push({
      category: 'Exercise',
      title: 'Increase Physical Activity',
      description: 'Regular exercise can significantly reduce risk of heart disease and diabetes.',
      priority: 'high',
      actions: [
        'Aim for 30 minutes of moderate activity 5 days a week',
        'Start with walking 15-20 minutes daily',
        'Consider joining a fitness class or online workout program',
        'Try to incorporate movement throughout your day'
      ]
    });
  }
  
  // Diet recommendations
  if (assessment.lifestyle.dietType === 'unhealthy' || assessment.lifestyle.dietType === 'average') {
    recommendations.push({
      category: 'Nutrition',
      title: 'Improve Dietary Habits',
      description: 'Eating a balanced diet can help manage weight and reduce chronic disease risk.',
      priority: 'high',
      actions: [
        'Increase fruit and vegetable intake to 5+ servings daily',
        'Reduce processed food consumption',
        'Include lean proteins and whole grains in your diet',
        'Stay hydrated with at least 8 glasses of water per day'
      ]
    });
  }
  
  // Sleep recommendations
  if (assessment.lifestyle.sleepHours < 7) {
    recommendations.push({
      category: 'Sleep',
      title: 'Improve Sleep Quality',
      description: 'Quality sleep is essential for both physical and mental health.',
      priority: 'medium',
      actions: [
        'Aim for 7-8 hours of sleep per night',
        'Establish a consistent sleep schedule',
        'Create a restful bedroom environment',
        'Avoid screens 1 hour before bedtime'
      ]
    });
  }
  
  // Stress management
  if (assessment.lifestyle.stressLevel > 6) {
    recommendations.push({
      category: 'Mental Health',
      title: 'Stress Management',
      description: 'Managing stress effectively can improve both mental and physical wellbeing.',
      priority: 'medium',
      actions: [
        'Practice mindfulness or meditation for 10 minutes daily',
        'Try deep breathing exercises when feeling stressed',
        'Consider journaling to process emotions',
        'Make time for activities you enjoy'
      ]
    });
  }
  
  // Medical follow-up based on risks
  if (risks.some(r => r.riskLevel === 'high')) {
    recommendations.push({
      category: 'Medical',
      title: 'Schedule Medical Check-up',
      description: 'Regular check-ups can help monitor and manage health risks.',
      priority: 'high',
      actions: [
        'Schedule an appointment with your primary care physician',
        'Discuss your family history and current symptoms',
        'Ask about recommended screenings based on your age and risk factors',
        'Follow up on any abnormal test results'
      ]
    });
  }
  
  return recommendations;
}

// Helper function to generate mock diet plan
function generateMockDietPlan(assessment: AssessmentData): DietPlan {
  // Determine diet type based on assessment
  let dietType = 'balanced';
  
  if (assessment.familyHistory.diabetes) {
    dietType = 'low-carb';
  } else if (assessment.familyHistory.heartDisease) {
    dietType = 'heart-healthy';
  } else if (assessment.lifestyle.dietType === 'vegetarian') {
    dietType = 'plant-based';
  }
  
  const dietPlans: Record<string, DietPlan> = {
    'balanced': {
      type: 'Balanced Diet Plan',
      meals: {
        breakfast: ['Oatmeal with berries', 'Greek yogurt with honey and nuts', 'Whole grain toast with avocado'],
        lunch: ['Grilled chicken salad', 'Quinoa bowl with vegetables', 'Turkey and vegetable wrap'],
        dinner: ['Baked salmon with roasted vegetables', 'Stir-fried tofu with brown rice', 'Lean beef with sweet potato'],
        snacks: ['Apple with almond butter', 'Carrot sticks with hummus', 'Mixed nuts', 'Greek yogurt']
      },
      recommendations: [
        'Eat a variety of colorful fruits and vegetables',
        'Include lean proteins with each meal',
        'Limit processed foods and added sugars',
        'Stay hydrated throughout the day'
      ],
      restrictions: []
    },
    'low-carb': {
      type: 'Low-Carbohydrate Diet Plan',
      meals: {
        breakfast: ['Eggs with avocado and spinach', 'Greek yogurt with berries', 'Protein smoothie'],
        lunch: ['Grilled chicken over mixed greens', 'Tuna salad in lettuce wraps', 'Zucchini noodles with turkey meatballs'],
        dinner: ['Baked fish with asparagus', 'Cauliflower rice stir-fry with chicken', 'Steak with roasted brussels sprouts'],
        snacks: ['Cheese and cucumbers', 'Hard-boiled eggs', 'Celery with almond butter', 'Beef jerky']
      },
      recommendations: [
        'Focus on protein and healthy fats',
        'Choose non-starchy vegetables',
        'Monitor blood sugar levels regularly',
        'Stay hydrated with water or unsweetened beverages'
      ],
      restrictions: ['Limit refined carbohydrates and sugars', 'Avoid sugary drinks and desserts', 'Minimize fruit juice consumption']
    },
    'heart-healthy': {
      type: 'Heart-Healthy Diet Plan',
      meals: {
        breakfast: ['Overnight oats with berries', 'Whole grain toast with avocado', 'Fruit and spinach smoothie'],
        lunch: ['Lentil soup with whole grain bread', 'Mediterranean salad with olive oil dressing', 'Grilled fish tacos with slaw'],
        dinner: ['Baked salmon with quinoa', 'Vegetable and bean chili', 'Grilled chicken with roasted vegetables'],
        snacks: ['Handful of nuts', 'Apple slices', 'Edamame', 'Hummus with vegetable sticks']
      },
      recommendations: [
        'Include omega-3 fatty acids from fish or plant sources',
        'Choose whole grains over refined grains',
        'Use olive oil as your primary fat source',
        'Limit sodium intake'
      ],
      restrictions: ['Minimize saturated and trans fats', 'Limit red meat consumption', 'Avoid processed meats', 'Reduce sodium intake']
    },
    'plant-based': {
      type: 'Plant-Based Diet Plan',
      meals: {
        breakfast: ['Smoothie bowl with plant protein', 'Avocado toast with hemp seeds', 'Chia pudding with fruit'],
        lunch: ['Lentil and vegetable soup', 'Quinoa salad with chickpeas', 'Buddha bowl with tahini dressing'],
        dinner: ['Bean and vegetable chili', 'Stir-fried tofu with brown rice', 'Stuffed bell peppers with quinoa'],
        snacks: ['Trail mix', 'Roasted chickpeas', 'Apple with nut butter', 'Hummus with veggies']
      },
      recommendations: [
        'Ensure adequate protein from varied plant sources',
        'Include vitamin B12 supplementation',
        'Consume a variety of colorful vegetables and fruits',
        'Include sources of plant-based omega-3 fatty acids'
      ],
      restrictions: []
    }
  };
  
  return dietPlans[dietType];
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
