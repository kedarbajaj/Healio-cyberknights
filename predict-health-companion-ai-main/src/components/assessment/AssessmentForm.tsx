
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AssessmentData } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DocumentUpload from './DocumentUpload';
import { Salad, FileText } from 'lucide-react';

const initialAssessmentData: AssessmentData = {
  personalInfo: {
    age: 30,
    gender: '',
    height: 170,
    weight: 70,
    bloodType: '',
    ethnicity: '',
  },
  familyHistory: {
    heartDisease: false,
    diabetes: false,
    cancer: false,
    autoimmune: false,
    other: '',
  },
  lifestyle: {
    smokingStatus: 'never',
    alcoholConsumption: 'occasional',
    exerciseFrequency: 'moderate',
    dietType: 'balanced',
    foodPreferences: [],
    dietaryRestrictions: [],
    sleepHours: 7,
    stressLevel: 5,
  },
  symptoms: [],
  allergies: [],
  medications: [],
  medicalConditions: [],
  uploadedDocuments: [],
};

export const AssessmentForm: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('personal');
  const [formData, setFormData] = useState<AssessmentData>(initialAssessmentData);
  const [symptom, setSymptom] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medication, setMedication] = useState('');
  const [condition, setCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [foodPreference, setFoodPreference] = useState('');
  
  const { saveAssessment } = useUser();
  const navigate = useNavigate();
  
  const handlePersonalInfoChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value,
      },
    });
  };
  
  const handleFamilyHistoryChange = (field: string, value: boolean | string) => {
    setFormData({
      ...formData,
      familyHistory: {
        ...formData.familyHistory,
        [field]: value,
      },
    });
  };
  
  const handleLifestyleChange = (field: string, value: string | number | string[]) => {
    setFormData({
      ...formData,
      lifestyle: {
        ...formData.lifestyle,
        [field]: value,
      },
    });
  };
  
  const handleAddSymptom = () => {
    if (symptom.trim()) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptom.trim()],
      });
      setSymptom('');
    }
  };
  
  const handleAddAllergy = () => {
    if (allergy.trim()) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergy.trim()],
      });
      setAllergy('');
    }
  };
  
  const handleAddMedication = () => {
    if (medication.trim()) {
      setFormData({
        ...formData,
        medications: [...formData.medications, medication.trim()],
      });
      setMedication('');
    }
  };
  
  const handleAddCondition = () => {
    if (condition.trim()) {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, condition.trim()],
      });
      setCondition('');
    }
  };

  const handleAddDietaryRestriction = () => {
    if (dietaryRestriction.trim()) {
      setFormData({
        ...formData,
        lifestyle: {
          ...formData.lifestyle,
          dietaryRestrictions: [...(formData.lifestyle.dietaryRestrictions || []), dietaryRestriction.trim()]
        }
      });
      setDietaryRestriction('');
    }
  };

  const handleAddFoodPreference = () => {
    if (foodPreference.trim()) {
      setFormData({
        ...formData,
        lifestyle: {
          ...formData.lifestyle,
          foodPreferences: [...(formData.lifestyle.foodPreferences || []), foodPreference.trim()]
        }
      });
      setFoodPreference('');
    }
  };
  
  const handleRemoveItem = (array: string[], index: number, field: string) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };
  
  const handleRemoveDietaryItem = (array: string[], index: number, field: string) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      lifestyle: {
        ...formData.lifestyle,
        [field]: newArray,
      }
    });
  };
  
  const handleDocumentUpload = (documentUrl: string) => {
    setFormData({
      ...formData,
      uploadedDocuments: [...(formData.uploadedDocuments || []), documentUrl],
    });
    toast.success('Document uploaded successfully');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await saveAssessment(formData);
      toast.success('Health assessment completed successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save assessment data');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextTab = () => {
    switch (currentTab) {
      case 'personal':
        setCurrentTab('family');
        break;
      case 'family':
        setCurrentTab('lifestyle');
        break;
      case 'lifestyle':
        setCurrentTab('diet');
        break;
      case 'diet':
        setCurrentTab('medical');
        break;
      case 'medical':
        setCurrentTab('documents');
        break;
      default:
        break;
    }
  };
  
  const prevTab = () => {
    switch (currentTab) {
      case 'family':
        setCurrentTab('personal');
        break;
      case 'lifestyle':
        setCurrentTab('family');
        break;
      case 'diet':
        setCurrentTab('lifestyle');
        break;
      case 'medical':
        setCurrentTab('diet');
        break;
      case 'documents':
        setCurrentTab('medical');
        break;
      default:
        break;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-100/50 to-purple-100/50">
        <CardTitle className="text-healio-dark text-center">Comprehensive Health Assessment</CardTitle>
        <CardDescription className="text-center">
          Provide your health information to receive a personalized risk assessment and recommendations
        </CardDescription>
      </CardHeader>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="family">Family History</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="personal">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.personalInfo.age}
                    onChange={(e) => handlePersonalInfoChange('age', parseInt(e.target.value) || 0)}
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.personalInfo.gender}
                    onValueChange={(value) => handlePersonalInfoChange('gender', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.personalInfo.height}
                    onChange={(e) => handlePersonalInfoChange('height', parseInt(e.target.value) || 0)}
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.personalInfo.weight}
                    onChange={(e) => handlePersonalInfoChange('weight', parseInt(e.target.value) || 0)}
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type (optional)</Label>
                  <select 
                    id="bloodType"
                    className="flex h-10 w-full rounded-md border border-blue-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.personalInfo.bloodType}
                    onChange={(e) => handlePersonalInfoChange('bloodType', e.target.value)}
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ethnicity">Ethnicity (optional)</Label>
                  <Input
                    id="ethnicity"
                    type="text"
                    value={formData.personalInfo.ethnicity}
                    onChange={(e) => handlePersonalInfoChange('ethnicity', e.target.value)}
                    placeholder="e.g. Caucasian, Asian, African, etc."
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <Button type="button" onClick={nextTab} className="bg-blue-600 hover:bg-blue-700">Next Step</Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="family">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-700">Family Medical History</h3>
                <p className="text-sm text-gray-600">
                  Select any conditions that have occurred in your close biological family members (parents, siblings, grandparents).
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heart-disease"
                      checked={formData.familyHistory.heartDisease}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('heartDisease', checked === true)}
                      className="border-blue-300"
                    />
                    <Label htmlFor="heart-disease">Heart Disease</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diabetes"
                      checked={formData.familyHistory.diabetes}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('diabetes', checked === true)}
                      className="border-blue-300"
                    />
                    <Label htmlFor="diabetes">Diabetes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cancer"
                      checked={formData.familyHistory.cancer}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('cancer', checked === true)}
                      className="border-blue-300"
                    />
                    <Label htmlFor="cancer">Cancer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoimmune"
                      checked={formData.familyHistory.autoimmune}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('autoimmune', checked === true)}
                      className="border-blue-300"
                    />
                    <Label htmlFor="autoimmune">Autoimmune Disorders</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="other-conditions">Other relevant conditions</Label>
                  <Textarea
                    id="other-conditions"
                    placeholder="Please describe any other relevant family health conditions"
                    value={formData.familyHistory.other}
                    onChange={(e) => handleFamilyHistoryChange('other', e.target.value)}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <Button type="button" variant="outline" onClick={prevTab} className="border-blue-300 text-blue-600">Previous</Button>
              <Button type="button" onClick={nextTab} className="bg-blue-600 hover:bg-blue-700">Next Step</Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="lifestyle">
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Smoking Status</Label>
                  <RadioGroup
                    value={formData.lifestyle.smokingStatus}
                    onValueChange={(value) => handleLifestyleChange('smokingStatus', value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="smoking-never" />
                      <Label htmlFor="smoking-never">Never Smoked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="former" id="smoking-former" />
                      <Label htmlFor="smoking-former">Former Smoker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current" id="smoking-current" />
                      <Label htmlFor="smoking-current">Current Smoker</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <Label>Alcohol Consumption</Label>
                  <RadioGroup
                    value={formData.lifestyle.alcoholConsumption}
                    onValueChange={(value) => handleLifestyleChange('alcoholConsumption', value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="alcohol-none" />
                      <Label htmlFor="alcohol-none">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasional" id="alcohol-occasional" />
                      <Label htmlFor="alcohol-occasional">Occasional (1-2 drinks/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="alcohol-moderate" />
                      <Label htmlFor="alcohol-moderate">Moderate (3-7 drinks/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="heavy" id="alcohol-heavy" />
                      <Label htmlFor="alcohol-heavy">Heavy (8+ drinks/week)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <Label>Exercise Frequency</Label>
                  <RadioGroup
                    value={formData.lifestyle.exerciseFrequency}
                    onValueChange={(value) => handleLifestyleChange('exerciseFrequency', value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rarely" id="exercise-rarely" />
                      <Label htmlFor="exercise-rarely">Rarely (0-1 times/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasionally" id="exercise-occasionally" />
                      <Label htmlFor="exercise-occasionally">Occasionally (1-2 times/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="exercise-moderate" />
                      <Label htmlFor="exercise-moderate">Moderate (3-4 times/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="exercise-regular" />
                      <Label htmlFor="exercise-regular">Regular (5+ times/week)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Average Sleep Hours</Label>
                    <span className="text-sm font-medium">{formData.lifestyle.sleepHours} hours</span>
                  </div>
                  <Slider
                    value={[formData.lifestyle.sleepHours]}
                    min={4}
                    max={12}
                    step={0.5}
                    onValueChange={(values) => handleLifestyleChange('sleepHours', values[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>4 hours</span>
                    <span>12 hours</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Stress Level</Label>
                    <span className="text-sm font-medium">{formData.lifestyle.stressLevel}/10</span>
                  </div>
                  <Slider
                    value={[formData.lifestyle.stressLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(values) => handleLifestyleChange('stressLevel', values[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low stress</span>
                    <span>High stress</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <Button type="button" variant="outline" onClick={prevTab} className="border-blue-300 text-blue-600">Previous</Button>
              <Button type="button" onClick={nextTab} className="bg-blue-600 hover:bg-blue-700">Next Step</Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="diet">
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-blue-700">Dietary Preferences</h3>
                
                <div className="space-y-3">
                  <Label>Diet Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.lifestyle.dietType === 'vegan' ? 'bg-green-50 border-green-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => handleLifestyleChange('dietType', 'vegan')}
                    >
                      <Salad className="h-12 w-12 text-green-600 mb-2" />
                      <span className="font-medium">Vegan</span>
                      <span className="text-xs text-gray-500 text-center mt-1">Plant-based diet with no animal products</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.lifestyle.dietType === 'vegetarian' ? 'bg-green-50 border-green-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => handleLifestyleChange('dietType', 'vegetarian')}
                    >
                      <Salad className="h-12 w-12 text-green-600 mb-2" />
                      <span className="font-medium">Vegetarian</span>
                      <span className="text-xs text-gray-500 text-center mt-1">Plant-based with dairy and/or eggs</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.lifestyle.dietType === 'non-vegetarian' ? 'bg-blue-50 border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => handleLifestyleChange('dietType', 'non-vegetarian')}
                    >
                      <FileText className="h-12 w-12 text-blue-600 mb-2" />
                      <span className="font-medium">Non-Vegetarian</span>
                      <span className="text-xs text-gray-500 text-center mt-1">Includes meat, poultry, seafood</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Food Preferences</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add foods you prefer"
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <Button type="button" onClick={handleAddFoodPreference} className="bg-blue-600">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.lifestyle.foodPreferences?.map((item, index) => (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                          <span>{item}</span>
                          <button
                            type="button"
                            className="ml-2 text-blue-800 hover:text-blue-600"
                            onClick={() => handleRemoveDietaryItem(formData.lifestyle.foodPreferences || [], index, 'foodPreferences')}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Dietary Restrictions</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add allergies or restrictions"
                        value={dietaryRestriction}
                        onChange={(e) => setDietaryRestriction(e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <Button type="button" onClick={handleAddDietaryRestriction} className="bg-blue-600">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.lifestyle.dietaryRestrictions?.map((item, index) => (
                        <div key={index} className="flex items-center bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm">
                          <span>{item}</span>
                          <button
                            type="button"
                            className="ml-2 text-red-800 hover:text-red-600"
                            onClick={() => handleRemoveDietaryItem(formData.lifestyle.dietaryRestrictions || [], index, 'dietaryRestrictions')}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="meal-frequency">Meals per day</Label>
                  <select 
                    id="meal-frequency"
                    className="flex h-10 w-full rounded-md border border-blue-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.lifestyle.mealFrequency || "3"}
                    onChange={(e) => handleLifestyleChange('mealFrequency', e.target.value)}
                  >
                    <option value="1">1 meal per day</option>
                    <option value="2">2 meals per day</option>
                    <option value="3">3 meals per day</option>
                    <option value="4">4 meals per day</option>
                    <option value="5">5+ meals per day</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <Button type="button" variant="outline" onClick={prevTab} className="border-blue-300 text-blue-600">Previous</Button>
              <Button type="button" onClick={nextTab} className="bg-blue-600 hover:bg-blue-700">Next Step</Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="medical">
            <CardContent className="space-y-6">
              <div className="space-y-6">
                {/* Symptoms */}
                <div className="space-y-3">
                  <Label>Current Symptoms</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter any current symptoms"
                      value={symptom}
                      onChange={(e) => setSymptom(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <Button type="button" onClick={handleAddSymptom} className="bg-blue-600">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.symptoms.map((item, index) => (
                      <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="ml-2 text-blue-800 hover:text-blue-600"
                          onClick={() => handleRemoveItem(formData.symptoms, index, 'symptoms')}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Allergies */}
                <div className="space-y-3">
                  <Label>Allergies</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter any allergies"
                      value={allergy}
                      onChange={(e) => setAllergy(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <Button type="button" onClick={handleAddAllergy} className="bg-blue-600">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.allergies.map((item, index) => (
                      <div key={index} className="flex items-center bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-800 hover:text-red-600"
                          onClick={() => handleRemoveItem(formData.allergies, index, 'allergies')}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Medications */}
                <div className="space-y-3">
                  <Label>Current Medications</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter any medications you're taking"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <Button type="button" onClick={handleAddMedication} className="bg-blue-600">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.medications.map((item, index) => (
                      <div key={index} className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="ml-2 text-purple-800 hover:text-purple-600"
                          onClick={() => handleRemoveItem(formData.medications, index, 'medications')}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Medical Conditions */}
                <div className="space-y-3">
                  <Label>Diagnosed Medical Conditions</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter any diagnosed conditions"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <Button type="button" onClick={handleAddCondition} className="bg-blue-600">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.medicalConditions.map((item, index) => (
                      <div key={index} className="flex items-center bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="ml-2 text-orange-800 hover:text-orange-600"
                          onClick={() => handleRemoveItem(formData.medicalConditions, index, 'medicalConditions')}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <Button type="button" variant="outline" onClick={prevTab} className="border-blue-300 text-blue-600">Previous</Button>
              <Button type="button" onClick={nextTab} className="bg-blue-600 hover:bg-blue-700">Next Step</Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="documents">
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-blue-700">Upload Medical Documents</h3>
                <p className="text-sm text-gray-600">
                  Upload your medical records, test results, or other relevant health documents for more personalized recommendations.
                </p>
                
                <DocumentUpload onUploadComplete={handleDocumentUpload} />
                
                {formData.uploadedDocuments && formData.uploadedDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-md font-medium">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {formData.uploadedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <span className="text-sm">Document {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <Button type="button" variant="outline" onClick={prevTab} className="border-blue-300 text-blue-600">Previous</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? 'Submitting...' : 'Complete Assessment'}
              </Button>
            </CardFooter>
          </TabsContent>
        </form>
      </Tabs>
    </Card>
  );
};

export default AssessmentForm;
