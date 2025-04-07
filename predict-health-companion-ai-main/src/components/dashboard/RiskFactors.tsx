import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthRecommendation, DietPlan } from '@/types';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Info, ChartPie, Salad, FileText, Download } from 'lucide-react';
import { generateDietPlanPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';

interface RiskFactorsProps {
  recommendations: HealthRecommendation[];
  dietPlan: DietPlan | null;
}

export const RiskFactors: React.FC<RiskFactorsProps> = ({ recommendations, dietPlan }) => {
  const [activeTab, setActiveTab] = useState<string>('recommendations');

  const handleDownloadPDF = () => {
    if (dietPlan) {
      generateDietPlanPDF(dietPlan);
      toast.success('Diet plan PDF downloaded successfully');
    } else {
      toast.error('No diet plan available to download');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Health Recommendations</h2>
      
      <Tabs defaultValue="recommendations" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-2 bg-blue-100/50 p-1">
          <TabsTrigger 
            value="recommendations" 
            className={activeTab === "recommendations" ? "bg-blue-600 text-white" : "text-blue-800 hover:text-blue-600"}
          >
            Recommendations
          </TabsTrigger>
          <TabsTrigger 
            value="diet" 
            className={activeTab === "diet" ? "bg-blue-600 text-white" : "text-blue-800 hover:text-blue-600"}
          >
            Personalized Diet Plan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="mt-6 space-y-4">
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </TabsContent>
        
        <TabsContent value="diet" className="mt-6">
          {dietPlan ? (
            <DietPlanView dietPlan={dietPlan} onDownloadPDF={handleDownloadPDF} />
          ) : (
            <Card className="border-blue-200">
              <CardContent className="pt-6 text-center">
                <p>No diet plan available. Please complete your health assessment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RecommendationCard: React.FC<{ recommendation: HealthRecommendation }> = ({ recommendation }) => {
  return (
    <Card className="border-blue-200 shadow-sm hover:shadow-md transition-all overflow-hidden animate-fade-in">
      <CardHeader className={`pb-2 ${getPriorityHeaderClass(recommendation.priority)}`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-blue-800">{recommendation.title}</CardTitle>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(recommendation.priority)}`}>
            {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
          </div>
        </div>
        <CardDescription>{recommendation.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Label className="text-sm font-medium mb-2 block text-gray-700">Recommended Actions:</Label>
        <ul className="space-y-3 mt-3">
          {recommendation.actions.map((action, i) => (
            <li key={i} className="flex items-start bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-md">
              <Check className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-sm">{action}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const DietPlanView: React.FC<{ 
  dietPlan: DietPlan;
  onDownloadPDF: () => void;
}> = ({ dietPlan, onDownloadPDF }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-blue-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100">
          <div className="flex items-center space-x-2">
            {dietPlan.type === 'vegan' ? (
              <Salad className="h-6 w-6 text-green-600" />
            ) : dietPlan.type === 'vegetarian' ? (
              <Salad className="h-6 w-6 text-green-600" />
            ) : (
              <ChartPie className="h-6 w-6 text-blue-600" />
            )}
            <CardTitle className="text-xl text-blue-800">{dietPlan.type} Diet Plan</CardTitle>
          </div>
          <CardDescription>
            This plan is customized based on your health assessment and dietary preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Recommendations */}
          <div className="space-y-3">
            <div className="pb-2 border-b border-blue-100">
              <Label className="text-lg font-semibold text-blue-700">Dietary Recommendations</Label>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <ul className="space-y-3">
                {dietPlan.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Restrictions if any */}
          {dietPlan.restrictions.length > 0 && (
            <div className="space-y-3">
              <div className="pb-2 border-b border-blue-100">
                <Label className="text-lg font-semibold text-blue-700">Dietary Restrictions</Label>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-4 rounded-lg">
                <ul className="space-y-3">
                  {dietPlan.restrictions.map((restriction, i) => (
                    <li key={i} className="flex items-start">
                      <Info className="mr-2 h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Meal Plan */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-blue-100">
              <Label className="text-lg font-semibold text-blue-700">Meal Plan</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MealCard 
                title="Breakfast Options"
                items={dietPlan.meals.breakfast}
                bgClass="bg-gradient-to-r from-orange-50 to-yellow-50"
              />
              
              <MealCard 
                title="Lunch Options"
                items={dietPlan.meals.lunch}
                bgClass="bg-gradient-to-r from-blue-50 to-green-50"
              />
              
              <MealCard 
                title="Dinner Options"
                items={dietPlan.meals.dinner}
                bgClass="bg-gradient-to-r from-purple-50 to-blue-50"
              />
              
              <MealCard 
                title="Healthy Snacks"
                items={dietPlan.meals.snacks}
                bgClass="bg-gradient-to-r from-green-50 to-teal-50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={onDownloadPDF}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-md hover:bg-blue-100 transition-all"
            >
              <Download className="h-4 w-4 mr-1" /> Download PDF Diet Plan
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MealCard: React.FC<{ title: string, items: string[], bgClass: string }> = ({ title, items, bgClass }) => {
  return (
    <Card className="border-blue-100 shadow-sm overflow-hidden">
      <CardHeader className={`pb-2 ${bgClass}`}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-white pt-4">
        <ul className="list-disc pl-5 text-sm space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

function getPriorityHeaderClass(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100';
    case 'medium': return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100';
    case 'low': return 'bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100';
    default: return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100';
  }
}

function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-blue-100 text-blue-800';
  }
}

export default RiskFactors;
