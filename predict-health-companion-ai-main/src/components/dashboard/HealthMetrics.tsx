
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  TooltipProps
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { HealthRisk } from '@/types';

interface HealthMetricsProps {
  healthRisks: HealthRisk[];
}

export const HealthMetrics: React.FC<HealthMetricsProps> = ({ healthRisks }) => {
  const [activeChart, setActiveChart] = useState<string>('bar');
  
  // Sample data for the trends chart
  const trendData = [
    { month: 'Jan', heartRisk: 82, diabetesRisk: 65, anxietyRisk: 45 },
    { month: 'Feb', heartRisk: 78, diabetesRisk: 63, anxietyRisk: 50 },
    { month: 'Mar', heartRisk: 75, diabetesRisk: 60, anxietyRisk: 55 },
    { month: 'Apr', heartRisk: 70, diabetesRisk: 58, anxietyRisk: 45 },
    { month: 'May', heartRisk: 65, diabetesRisk: 55, anxietyRisk: 40 },
    { month: 'Jun', heartRisk: 60, diabetesRisk: 50, anxietyRisk: 35 },
  ];

  // Transform health risks into chart data
  const riskChartData = healthRisks.map(risk => ({
    name: risk.condition,
    value: risk.score,
    fill: getRiskColor(risk.riskLevel),
  }));

  // Data for the radar chart
  const radarData = [
    { subject: 'Heart Health', A: 120, B: 110, fullMark: 150 },
    { subject: 'Diet Quality', A: 98, B: 130, fullMark: 150 },
    { subject: 'Exercise', A: 86, B: 130, fullMark: 150 },
    { subject: 'Sleep', A: 99, B: 100, fullMark: 150 },
    { subject: 'Stress Level', A: 85, B: 90, fullMark: 150 },
    { subject: 'BMI', A: 65, B: 85, fullMark: 150 },
  ];

  // COLORS for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Health Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/70 border-b border-blue-100">
            <CardTitle className="text-blue-800">Health Risk Assessment</CardTitle>
            <CardDescription>Current risk scores based on your assessment</CardDescription>
            
            <div className="flex space-x-2 mt-2">
              <Button 
                variant={activeChart === 'bar' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveChart('bar')}
                className={activeChart === 'bar' ? 'bg-blue-600' : 'border-blue-300 text-blue-600'}
              >
                Bar Chart
              </Button>
              <Button 
                variant={activeChart === 'pie' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveChart('pie')}
                className={activeChart === 'pie' ? 'bg-blue-600' : 'border-blue-300 text-blue-600'}
              >
                Pie Chart
              </Button>
              <Button 
                variant={activeChart === 'radar' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveChart('radar')}
                className={activeChart === 'radar' ? 'bg-blue-600' : 'border-blue-300 text-blue-600'}
              >
                Radar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-80">
            {activeChart === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskChartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Risk Score" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {activeChart === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Risk Score']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {activeChart === 'radar' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar name="Your Health" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Ideal" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/70 border-b border-blue-100">
            <CardTitle className="text-blue-800">Risk Score Trends</CardTitle>
            <CardDescription>How your risk factors have changed over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="heartRisk" 
                  name="Heart Disease" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="diabetesRisk" 
                  name="Diabetes" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="anxietyRisk" 
                  name="Anxiety/Depression" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthRisks.map((risk) => (
          <Card key={risk.condition} className="border-blue-200 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-blue-800">{risk.condition}</CardTitle>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(risk.riskLevel)}`}>
                  {risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)} Risk
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>
                  <span className="font-medium">{risk.score}/100</span>
                </div>
                <Progress 
                  value={risk.score} 
                  className={`h-2 ${getRiskProgressClass(risk.riskLevel)}`} 
                />
                <div className="pt-3">
                  <p className="text-sm font-medium mb-1">Contributing Factors:</p>
                  <ul className="text-sm text-gray-600 list-disc pl-5">
                    {risk.factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Button component used in the health metrics tab selection
const Button = ({ 
  children, 
  className, 
  variant = 'default', 
  size = 'default',
  ...props 
}: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-8"
  };
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Helper functions for styling based on risk level
function getRiskColor(riskLevel: string): string {
  switch(riskLevel) {
    case 'high': return '#e53e3e'; // Red
    case 'moderate': return '#f6ad55'; // Yellow/Orange
    case 'low': return '#48bb78'; // Green
    default: return '#3b82f6'; // Blue
  }
}

function getRiskBadgeClass(riskLevel: string): string {
  switch(riskLevel) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-blue-100 text-blue-800';
  }
}

function getRiskProgressClass(riskLevel: string): string {
  switch(riskLevel) {
    case 'high': return 'bg-red-500';
    case 'moderate': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-blue-500';
  }
}

export default HealthMetrics;
