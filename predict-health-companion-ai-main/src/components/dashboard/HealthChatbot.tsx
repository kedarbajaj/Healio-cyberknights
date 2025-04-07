
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sendMessageToAI } from '@/services/aiService';
import { Message, AssessmentData, HealthRisk } from '@/types';
import { Heart, Send, User } from 'lucide-react';
import { nanoid } from 'nanoid';

interface HealthChatbotProps {
  assessmentData?: AssessmentData;
  healthRisks?: HealthRisk[];
}

export const HealthChatbot: React.FC<HealthChatbotProps> = ({ assessmentData, healthRisks }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm your Healio AI assistant. I can answer health questions, provide information about your health risks, or offer lifestyle tips. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      id: nanoid(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Get response from AI
      const response = await sendMessageToAI(input, messages, assessmentData, healthRisks);
      
      // Add AI response to the chat
      const botMessage: Message = {
        id: nanoid(),
        sender: 'bot',
        text: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: nanoid(),
        sender: 'bot',
        text: "I'm having trouble processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="w-5 h-5 text-healio-primary mr-2" /> 
          Healio Health Assistant
        </CardTitle>
        <CardDescription>
          Ask me anything about health, symptoms, or your personal risk factors
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start max-w-[80%]">
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-healio-primary text-white">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-healio-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(message.timestamp)}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-healio-accent text-white">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
          <Textarea
            placeholder="Type your health question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-10 resize-none flex-grow"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            className="bg-healio-primary hover:bg-healio-primary/90"
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default HealthChatbot;
