
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, FileText, FileImage } from 'lucide-react';
import { analyzeMedicalDocument } from '@/services/aiService';

interface DocumentUploadProps {
  onUploadComplete: (documentUrl: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // In a real app, this would upload to a server
      // For now, we'll use our mock service
      const result = await analyzeMedicalDocument(selectedFile);
      
      // Complete the progress bar
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setAnalysisResult(result);
        onUploadComplete(`doc_${Date.now()}`); // Pass a unique ID for the uploaded document
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      setAnalysisResult('Error analyzing document. Please try again.');
    } finally {
      clearInterval(interval);
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileText className="h-4 w-4" />;
    
    const fileType = selectedFile.type;
    if (fileType.includes('pdf')) {
      return <File className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="document-upload">Upload medical documents (PDF, JPEG, PNG)</Label>
        <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-100 transition-all cursor-pointer">
          <Input
            id="document-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="document-upload" className="cursor-pointer">
            <Upload className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
          </label>
        </div>
      </div>
      
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isUploading && (
              <>
                <Button 
                  type="button" 
                  onClick={handleUpload} 
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" /> Analyze
                </Button>
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearSelectedFile}
                  className="text-gray-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analyzing document content...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress 
            value={uploadProgress} 
            className="h-2 bg-blue-100" 
            indicatorClassName="bg-blue-600" 
          />
        </div>
      )}
      
      {analysisResult && (
        <Card className="border-blue-200 overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
            <h4 className="text-sm font-medium text-blue-700">Document Analysis Result</h4>
          </div>
          <CardContent className="pt-6">
            <div className="p-4 bg-white rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-line">{analysisResult}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelectedFile}
                className="text-blue-600 border-blue-200"
              >
                Upload Another Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
