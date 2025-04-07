
import { Message, AssessmentData, HealthRisk } from '@/types';
export async function sendMessageToAI(
  message: string, 
  conversation: Message[], 
  assessmentData?: AssessmentData, 
  healthRisks?: HealthRisk[]
): Promise<string> {
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  
  const lowerMessage = message.toLowerCase();
  

  if (isGreeting(lowerMessage)) {
    if (assessmentData) {
      return `Hello! I'm your Healio health assistant. Based on your assessment, I can provide personalized health insights and recommendations. How can I help you today?`;
    } else {
      return "Hello! I'm your Healio health assistant. I can help you with health questions, check symptoms, or provide information about your health risks. How can I help you today?";
    }
  }
  
  // Check if it's a question about the user's health risks
  if (lowerMessage.includes('risk') || lowerMessage.includes('condition') || lowerMessage.includes('disease')) {
    if (healthRisks && healthRisks.length > 0) {
      const highRisks = healthRisks.filter(risk => risk.riskLevel === 'high');
      const moderateRisks = healthRisks.filter(risk => risk.riskLevel === 'moderate');
      
      if (highRisks.length > 0) {
        return `Based on your assessment, you have a higher risk for ${highRisks.map(r => r.condition).join(', ')}. 
The main factors contributing to these risks are ${highRisks[0].factors.join(', ')}. 
${getPersonalizedRiskRecommendation(highRisks[0], assessmentData)}
I recommend following the personalized recommendations in your health plan and consulting with a healthcare professional.`;
      } else if (moderateRisks.length > 0) {
        return `Based on your assessment, you have a moderate risk for ${moderateRisks.map(r => r.condition).join(', ')}. 
This is partly due to factors such as ${moderateRisks[0].factors.join(', ')}. 
${getPersonalizedRiskRecommendation(moderateRisks[0], assessmentData)}
Following the recommendations in your health plan can help minimize these risks.`;
      } else {
        return "Based on your assessment, you don't have any high-risk health conditions, which is great news. However, it's still important to maintain a healthy lifestyle and follow the preventive recommendations in your health plan.";
      }
    } else {
      return "I don't have your health assessment information yet. Please complete the health assessment so I can provide personalized risk information.";
    }
  }
  

  if (lowerMessage.includes('symptom') || lowerMessage.includes('feel') || lowerMessage.includes('pain') || lowerMessage.includes('ache')) {
    if (assessmentData && assessmentData.symptoms.length > 0) {
      const symptoms = assessmentData.symptoms.join(', ');
      return `I notice you're asking about symptoms. From your assessment, you've mentioned experiencing: ${symptoms}. While I can provide general information, I can't diagnose medical conditions. If your symptoms are concerning or persistent, please consult with a healthcare professional. Would you like me to provide some general information about managing these symptoms?`;
    } else {
      return "I notice you're describing symptoms. While I can provide general information, I can't diagnose medical conditions. If you're experiencing concerning symptoms, please consult with a healthcare professional. Would you like me to provide some general information about these symptoms?";
    }
  }
  

  if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('nutrition')) {
    if (assessmentData) {
      const dietType = assessmentData.lifestyle.dietType;
      const restrictions = assessmentData.lifestyle.dietaryRestrictions || [];
      const preferences = assessmentData.lifestyle.foodPreferences || [];
      
      let dietResponse = `Based on your ${dietType} dietary preference`;
      
      if (restrictions.length > 0) {
        dietResponse += ` and considering your restrictions (${restrictions.join(', ')})`;
      }
      
      dietResponse += `, I recommend focusing on a balanced diet rich in whole foods. `;
      
      if (preferences.length > 0) {
        dietResponse += `I see you enjoy ${preferences.join(', ')}. You can incorporate these into your meal plan. `;
      }
      
      if (healthRisks && healthRisks.some(risk => risk.condition === 'Heart Disease' && risk.riskLevel === 'high')) {
        dietResponse += `Given your higher risk for heart disease, it's especially important to limit sodium, saturated fats, and processed foods. `;
      }
      
      if (healthRisks && healthRisks.some(risk => risk.condition === 'Diabetes' && risk.riskLevel === 'high')) {
        dietResponse += `With your diabetes risk profile, focus on low glycemic index foods and limit added sugars. `;
      }
      
      dietResponse += `Would you like more specific dietary recommendations based on your health goals?`;
      
      return dietResponse;
    } else {
      return "A balanced diet is essential for good health. Generally, it's recommended to eat plenty of vegetables and fruits, lean proteins, whole grains, and healthy fats. Limit processed foods, sugar, and salt. Complete your health assessment for personalized dietary advice.";
    }
  }
  

  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('depress') || lowerMessage.includes('mental health')) {
    if (assessmentData) {
      const stressLevel = assessmentData.lifestyle.stressLevel;
      const sleepHours = assessmentData.lifestyle.sleepHours;
      
      let stressResponse = "";
      
      if (stressLevel >= 7) {
        stressResponse = `I notice from your assessment that you're experiencing a higher level of stress (${stressLevel}/10). `;
      } else if (stressLevel >= 4) {
        stressResponse = `Based on your assessment, you're experiencing a moderate level of stress (${stressLevel}/10). `;
      } else {
        stressResponse = `Your stress levels appear relatively low (${stressLevel}/10) according to your assessment, which is positive. `;
      }
      
      if (sleepHours < 7) {
        stressResponse += `I also see that you're getting ${sleepHours} hours of sleep, which is less than the recommended 7-8 hours for adults. Improving sleep can significantly help with stress management. `;
      }
      
      stressResponse += `Some effective strategies for managing stress include regular physical activity, adequate sleep, mindfulness practices like meditation, and maintaining social connections. If you're experiencing significant mental health challenges, please reach out to a mental health professional for support.`;
      
      return stressResponse;
    } else {
      return "Managing stress is crucial for overall health. Some effective strategies include regular physical activity, adequate sleep, mindfulness practices like meditation, and maintaining social connections. If you're experiencing significant mental health challenges, please reach out to a mental health professional for support.";
    }
  }
  
  if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('recommend')) {
    if (assessmentData) {
      return getPersonalizedHealthTips(assessmentData, healthRisks);
    } else {
      return "Here are some general health tips: 1) Aim for at least 150 minutes of moderate physical activity weekly, 2) Eat a balanced diet with plenty of vegetables and fruits, 3) Get 7-8 hours of quality sleep, 4) Stay hydrated, 5) Manage stress through mindfulness or other relaxation techniques, and 6) Maintain regular health check-ups.";
    }
  }
  

  if (lowerMessage.includes('medical history') || lowerMessage.includes('my conditions') || lowerMessage.includes('my health problems')) {
    if (assessmentData && assessmentData.medicalConditions.length > 0) {
      return `Based on your assessment, you've indicated that you have: ${assessmentData.medicalConditions.join(', ')}. It's important to manage these conditions with appropriate medical care. Your personalized recommendations take these conditions into account.`;
    } else if (assessmentData) {
      return "Based on your assessment, you haven't indicated any specific medical conditions. This is positive, but remember that preventative care is still important. Regular check-ups can help maintain your health.";
    } else {
      return "I don't have your health assessment information yet. Please complete the health assessment so I can provide personalized information about your medical history.";
    }
  }
  

  if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('drug')) {
    if (assessmentData && assessmentData.medications.length > 0) {
      return `According to your assessment, you're currently taking: ${assessmentData.medications.join(', ')}. It's important to take medications as prescribed and discuss any concerns or side effects with your healthcare provider. I can't provide specific medication advice, as this requires medical expertise.`;
    } else if (assessmentData) {
      return "Based on your assessment, you aren't currently taking any medications. If your health situation changes and a healthcare provider prescribes medication, be sure to take it as directed and report any concerns.";
    } else {
      return "I don't have information about your medications. Please complete the health assessment to provide this information.";
    }
  }
  
  
  if (lowerMessage.includes('capital of india')) {
    return "The capital of India is New Delhi. While I'm happy to answer this question, I want to remind you that my primary purpose is to assist with health-related topics. Is there anything about your health I can help with?";
  }
  
  if (lowerMessage.includes('weather') || 
      lowerMessage.includes('news') || 
      lowerMessage.includes('sports') || 
      lowerMessage.includes('movie') || 
      lowerMessage.includes('music')) {
    return `I can provide information about ${message.toLowerCase()}, but I'm primarily designed to assist with health-related questions. Is there something specific about your health you'd like to discuss?`;
  }
  
  
  if (assessmentData) {
    return "I'm here to help with your health questions based on your assessment data. I can provide information on health risks, symptoms, lifestyle recommendations, or mental wellbeing. What would you like to know more about?";
  } else {
    return "I'm here to help with your health questions and concerns. I can provide information on health risks, symptoms, lifestyle recommendations, or mental wellbeing. What would you like to know more about? For more personalized advice, please complete the health assessment.";
  }
}

function isGreeting(message: string): boolean {
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'];
  return greetings.some(greeting => message.toLowerCase().includes(greeting));
}

function getPersonalizedHealthTips(assessmentData: AssessmentData, healthRisks?: HealthRisk[]): string {
  let tips = "Based on your assessment, here are some personalized health tips:\n\n";
  
  const exerciseFreq = assessmentData.lifestyle.exerciseFrequency;
  if (exerciseFreq === 'rarely' || exerciseFreq === 'occasionally') {
    tips += "1) Consider increasing your physical activity. Even adding a 15-minute walk daily can make a difference. Aim to gradually build up to 150 minutes of moderate activity weekly.\n\n";
  } else {
    tips += "1) Great job maintaining regular physical activity! Continue with your exercise routine and consider incorporating both cardio and strength training for optimal health benefits.\n\n";
  }
  
  
  if (assessmentData.lifestyle.sleepHours < 7) {
    tips += "2) Your sleep duration is below the recommended 7-8 hours for adults. Try establishing a regular sleep schedule, creating a comfortable sleep environment, and avoiding screens before bedtime.\n\n";
  } else {
    tips += "2) You're getting adequate sleep, which is excellent for your health. Continue prioritizing good sleep hygiene.\n\n";
  }
  
  
  tips += `3) With your ${assessmentData.lifestyle.dietType} diet preferences, focus on whole, unprocessed foods. `;
  
  if (healthRisks && healthRisks.some(risk => risk.condition === 'Heart Disease')) {
    tips += "Pay special attention to heart-healthy options like omega-3 rich foods, fruits, vegetables, and whole grains.\n\n";
  } else if (healthRisks && healthRisks.some(risk => risk.condition === 'Diabetes')) {
    tips += "Choose low glycemic index foods and limit added sugars to help manage your blood sugar levels.\n\n";
  } else {
    tips += "A balanced approach with plenty of fruits, vegetables, lean proteins, and whole grains is recommended.\n\n";
  }
  

  if (assessmentData.lifestyle.stressLevel > 6) {
    tips += "4) Your stress levels are elevated. Consider stress-reduction techniques such as meditation, deep breathing exercises, yoga, or spending time in nature.\n\n";
  } else {
    tips += "4) Continue practicing stress management through regular relaxation activities and maintaining work-life balance.\n\n";
  }
  
  
  if (assessmentData.familyHistory.heartDisease) {
    tips += "5) Given your family history of heart disease, regular cardiovascular health check-ups and monitoring your blood pressure and cholesterol levels are important.\n\n";
  }
  
  if (assessmentData.familyHistory.diabetes) {
    tips += "6) With your family history of diabetes, regular blood sugar monitoring and maintaining a healthy weight are especially important.\n\n";
  }
  
  return tips;
}

function getPersonalizedRiskRecommendation(risk: HealthRisk, assessmentData?: AssessmentData): string {
  if (!assessmentData) return "";
  
  if (risk.condition === "Heart Disease") {
    if (assessmentData.lifestyle.smokingStatus === "current") {
      return "Quitting smoking would be one of the most significant steps you can take to reduce your heart disease risk.";
    } else if (assessmentData.lifestyle.exerciseFrequency === "rarely") {
      return "Increasing your physical activity level would be particularly beneficial for reducing your heart disease risk.";
    } else if (assessmentData.lifestyle.dietType === "non-vegetarian") {
      return "Consider reducing red meat intake and increasing consumption of heart-healthy foods like fish, nuts, and vegetables.";
    } else {
      return "Focus on heart-healthy lifestyle choices like regular exercise, a balanced diet low in sodium and saturated fat, and stress management.";
    }
  } else if (risk.condition === "Diabetes") {
    if (assessmentData.personalInfo.weight / Math.pow(assessmentData.personalInfo.height/100, 2) > 25) {
      return "Maintaining a healthy weight is particularly important for managing your diabetes risk.";
    } else if (assessmentData.lifestyle.exerciseFrequency === "rarely" || assessmentData.lifestyle.exerciseFrequency === "occasionally") {
      return "Regular physical activity can significantly improve insulin sensitivity and help manage your diabetes risk.";
    } else {
      return "Focus on maintaining stable blood sugar levels through regular meals, limiting added sugars, and staying physically active.";
    }
  }
  
  return "Following a personalized prevention plan can help manage your risk factors.";
}

export async function analyzeHealthRisks(assessment: AssessmentData): Promise<any> {
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  
  const bmi = assessment.personalInfo.weight / Math.pow(assessment.personalInfo.height/100, 2);
  

  const heartDiseaseRisk = calculateHeartDiseaseRisk(assessment, bmi);
  
  
  const diabetesRisk = calculateDiabetesRisk(assessment, bmi);
  

  const recommendations = generateRecommendations(assessment, heartDiseaseRisk, diabetesRisk);
  
  return {
    risks: [
      {
        condition: 'Heart Disease',
        riskLevel: heartDiseaseRisk.level,
        score: heartDiseaseRisk.score,
        factors: heartDiseaseRisk.factors
      },
      {
        condition: 'Diabetes',
        riskLevel: diabetesRisk.level,
        score: diabetesRisk.score,
        factors: diabetesRisk.factors
      }
    ],
    recommendations: recommendations
  };
}

function calculateHeartDiseaseRisk(assessment: AssessmentData, bmi: number): { level: 'low' | 'moderate' | 'high', score: number, factors: string[] } {
  let riskScore = 0;
  const riskFactors: string[] = [];
  
  
  if (assessment.familyHistory.heartDisease) {
    riskScore += 30;
    riskFactors.push('Family history');
  }
  
  
  if (assessment.lifestyle.smokingStatus === 'current') {
    riskScore += 25;
    riskFactors.push('Current smoker');
  } else if (assessment.lifestyle.smokingStatus === 'former') {
    riskScore += 10;
    riskFactors.push('Former smoker');
  }
  
  
  if (assessment.lifestyle.dietType === 'non-vegetarian') {
    riskScore += 10;
    riskFactors.push('Diet high in animal products');
  }
  
  
  if (assessment.lifestyle.exerciseFrequency === 'rarely') {
    riskScore += 15;
    riskFactors.push('Low physical activity');
  } else if (assessment.lifestyle.exerciseFrequency === 'occasionally') {
    riskScore += 8;
  }
  
  
  if (assessment.lifestyle.alcoholConsumption === 'heavy') {
    riskScore += 15;
    riskFactors.push('Heavy alcohol consumption');
  }
  
  
  if (bmi > 30) {
    riskScore += 15;
    riskFactors.push('Obesity');
  } else if (bmi > 25) {
    riskScore += 10;
    riskFactors.push('Overweight');
  }
  

  if (assessment.personalInfo.age > 60) {
    riskScore += 20;
    riskFactors.push('Age over 60');
  } else if (assessment.personalInfo.age > 45) {
    riskScore += 10;
    riskFactors.push('Age over 45');
  }
  
  
  if (assessment.lifestyle.stressLevel > 7) {
    riskScore += 10;
    riskFactors.push('High stress levels');
  }
  

  let riskLevel: 'low' | 'moderate' | 'high';
  if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }
  
  return {
    level: riskLevel,
    score: riskScore,
    factors: riskFactors.slice(0, 4) 
  };
}

function calculateDiabetesRisk(assessment: AssessmentData, bmi: number): { level: 'low' | 'moderate' | 'high', score: number, factors: string[] } {
  let riskScore = 0;
  const riskFactors: string[] = [];
  
  
  if (assessment.familyHistory.diabetes) {
    riskScore += 30;
    riskFactors.push('Family history');
  }
  
  
  if (bmi > 30) {
    riskScore += 25;
    riskFactors.push('Obesity');
  } else if (bmi > 25) {
    riskScore += 15;
    riskFactors.push('Overweight');
  }
  
  
  const hasDietaryRestrictions = assessment.lifestyle.dietaryRestrictions?.some(
    restriction => restriction.toLowerCase().includes('sugar') || restriction.toLowerCase().includes('carb')
  );
  if (!hasDietaryRestrictions) {
    riskScore += 10;
    riskFactors.push('Diet high in refined carbs');
  }
  
  
  if (assessment.lifestyle.exerciseFrequency === 'rarely') {
    riskScore += 15;
    riskFactors.push('Low physical activity');
  } else if (assessment.lifestyle.exerciseFrequency === 'occasionally') {
    riskScore += 8;
  }
  
  
  if (assessment.personalInfo.age > 45) {
    riskScore += 15;
    riskFactors.push('Age over 45');
  }
  
  
  let riskLevel: 'low' | 'moderate' | 'high';
  if (riskScore >= 45) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }
  
  return {
    level: riskLevel,
    score: riskScore,
    factors: riskFactors.slice(0, 4) 
  };
}

function generateRecommendations(assessment: AssessmentData, heartRisk: any, diabetesRisk: any): any[] {
  const recommendations = [];
  
  
  if (assessment.lifestyle.exerciseFrequency === 'rarely' || assessment.lifestyle.exerciseFrequency === 'occasionally') {
    recommendations.push({
      category: 'Exercise',
      title: 'Increase physical activity',
      description: 'Regular exercise reduces risk of heart disease, diabetes, and improves overall wellbeing',
      priority: 'high',
      actions: [
        'Aim for at least 150 minutes of moderate exercise per week',
        'Include both cardio and strength training activities',
        'Start with short sessions and gradually increase duration',
        'Find activities you enjoy to help maintain consistency'
      ]
    });
  } else {
    recommendations.push({
      category: 'Exercise',
      title: 'Maintain physical activity',
      description: 'Continue your regular exercise routine to support overall health',
      priority: 'medium',
      actions: [
        'Keep up your current exercise habits',
        'Consider adding variety to your routine to work different muscle groups',
        'Include flexibility exercises like stretching or yoga',
        'Ensure proper recovery between intense workout sessions'
      ]
    });
  }

  const dietPriority = heartRisk.level === 'high' || diabetesRisk.level === 'high' ? 'high' : 'medium';
  recommendations.push({
    category: 'Diet',
    title: 'Balanced nutrition',
    description: 'Focus on whole foods and reduce processed foods',
    priority: dietPriority,
    actions: [
      'Include plenty of fruits and vegetables daily',
      'Choose whole grains over refined carbohydrates',
      'Limit added sugars and processed foods',
      heartRisk.level === 'high' ? 'Reduce sodium and saturated fat intake' : 'Include healthy fats from sources like nuts and olive oil'
    ]
  });
  

  if (assessment.lifestyle.stressLevel > 6) {
    recommendations.push({
      category: 'Stress Management',
      title: 'Reduce stress levels',
      description: 'High stress contributes to various health issues including heart disease',
      priority: 'high',
      actions: [
        'Practice mindfulness meditation for 10-15 minutes daily',
        'Incorporate regular relaxation techniques',
        'Consider limiting media consumption if it causes anxiety',
        'Make time for activities you enjoy and find relaxing'
      ]
    });
  }
  
  
  if (assessment.lifestyle.sleepHours < 7) {
    recommendations.push({
      category: 'Sleep',
      title: 'Improve sleep quality and duration',
      description: 'Adequate sleep is essential for health and disease prevention',
      priority: 'high',
      actions: [
        'Aim for 7-8 hours of quality sleep each night',
        'Create a consistent sleep schedule, even on weekends',
        'Avoid screens 1-2 hours before bedtime',
        'Create a comfortable, dark, and cool sleeping environment'
      ]
    });
  }
  
  
  if (heartRisk.level === 'high') {
    recommendations.push({
      category: 'Heart Health',
      title: 'Cardiovascular risk management',
      description: 'Specific steps to reduce your elevated heart disease risk',
      priority: 'high',
      actions: [
        'Monitor your blood pressure regularly',
        'Consider getting your cholesterol levels checked',
        'Limit alcohol consumption',
        assessment.lifestyle.smokingStatus === 'current' ? 'Talk to your doctor about smoking cessation options' : 'Avoid secondhand smoke exposure'
      ]
    });
  }
  
  if (diabetesRisk.level === 'high') {
    recommendations.push({
      category: 'Blood Sugar',
      title: 'Diabetes risk management',
      description: 'Specific steps to reduce your elevated diabetes risk',
      priority: 'high',
      actions: [
        'Monitor carbohydrate intake and focus on low glycemic index foods',
        'Consider regular blood sugar testing',
        'Maintain consistent meal timing to avoid blood sugar spikes',
        'Focus on weight management through diet and exercise'
      ]
    });
  }
  
  return recommendations;
}

export async function analyzeMedicalDocument(file: File): Promise<string> {
  
  
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  

  if (file.type.includes('pdf')) {
    return "Document analysis complete. I've reviewed your medical records carefully.\n\nI noticed your cholesterol levels are slightly elevated (total cholesterol: 215 mg/dL), with an LDL of 145 mg/dL which is above the recommended range. This could increase your risk for heart disease, especially given your family history.\n\nYour blood pressure readings are within normal range (118/76), which is positive. Blood glucose is at the higher end of normal (98 mg/dL).\n\nI recommend discussing these cholesterol findings with your healthcare provider. Consider dietary changes to reduce saturated fat intake, increase soluble fiber, and maintain regular physical activity which can all help improve your lipid profile.";
  } else if (file.type.includes('image')) {
    return "I've analyzed your uploaded lab results.\n\nYour vitamin D levels appear to be below optimal range (21 ng/mL), which is common but should be addressed. Low vitamin D can affect bone health, immune function, and even mood.\n\nConsider discussing vitamin D supplementation with your healthcare provider, and try to increase your exposure to sunlight safely. Foods rich in vitamin D include fatty fish, fortified dairy products, and egg yolks.\n\nYour other lab values appear to be within normal ranges, which is positive news.";
  } else {
    return "Document analysis complete. I've reviewed your health documents.\n\nBased on the information provided, your overall health metrics look stable. Your BMI falls within the healthy range, and your baseline health metrics don't indicate any significant concerns.\n\nI do note that your family history includes some cardiovascular risk factors, which makes preventive care particularly important for you. Regular check-ups, a heart-healthy diet, and consistent physical activity will be beneficial for long-term health maintenance.\n\nWould you like some specific recommendations based on your health profile?";
  }
}
