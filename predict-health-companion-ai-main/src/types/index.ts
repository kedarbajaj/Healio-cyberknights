
export interface User {
  id: string;
  email: string;
  name: string;
  assessmentCompleted: boolean;
}

export interface AssessmentData {
  personalInfo: {
    age: number;
    gender: string;
    height: number; // in cm
    weight: number; // in kg
    bloodType?: string;
    ethnicity?: string;
  };
  familyHistory: {
    heartDisease: boolean;
    diabetes: boolean;
    cancer: boolean;
    autoimmune: boolean;
    other: string;
  };
  lifestyle: {
    smokingStatus: string;
    alcoholConsumption: string;
    exerciseFrequency: string;
    dietType: string;
    foodPreferences?: string[]; // New field for food preferences
    dietaryRestrictions?: string[]; // New field for dietary restrictions
    mealFrequency?: string; // New field for meal frequency
    sleepHours: number;
    stressLevel: number;
  };
  symptoms: string[];
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  uploadedDocuments?: string[];
}

export interface HealthRisk {
  condition: string;
  riskLevel: 'low' | 'moderate' | 'high';
  score: number;
  factors: string[];
}

export interface HealthRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actions: string[];
}

export interface DietPlan {
  type: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  recommendations: string[];
  restrictions: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  target?: {
    min: number;
    max: number;
  };
  history?: Array<{
    date: Date;
    value: number;
  }>;
}
