import React from 'react';
import { FileUpload } from './components/FileUpload';
import { Header } from './components/Header';
import { Brain } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              AI-Powered Resume Analysis
            </h1>
            
            <p className="text-lg text-gray-300 mb-12">
              Upload your resume to receive insights on your career trajectory, skills, and optimization suggestions.
            </p>
            
            <FileUpload />
          </div>
        </main>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
}

export default App;