import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, Loader } from 'lucide-react';
import { analyzeResume, healthCheck } from '../utils/api';
import { LoadingScreen } from './LoadingScreen';
import { ResultsDisplay } from './ResultsDisplay';
import type { ResumeAnalysis } from '../types/api';

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  }, []);

  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const isHealthy = await healthCheck();
      if (!isHealthy) {
        throw new Error('Backend service is not available');
      }

      const result = await analyzeResume(file);
      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setAnalysis(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (analysis) {
    return <ResultsDisplay analysis={analysis} onClose={handleReset} />;
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-all
          ${isDragging 
            ? 'border-purple-400 bg-purple-400/10' 
            : 'border-gray-600 hover:border-purple-400 bg-black/20'}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-300 mb-2">
            Drag and drop your resume here, or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supports PDF files up to 5MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {file && !error && (
        <div className="mt-6">
          <p className="text-gray-300 mb-4">
            Selected file: <span className="text-purple-400">{file.name}</span>
          </p>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-all
              ${isLoading
                ? 'bg-purple-600/50 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500'}
            `}
          >
            <span className="flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Analyze Resume</span>
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}