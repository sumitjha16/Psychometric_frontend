import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const loadingMessages = [
  'Parsing your resume...',
  'Analyzing your skills...',
  'Identifying career patterns...',
  'Generating insights...',
  'Preparing recommendations...',
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
          <Sparkles className="w-8 h-8 text-purple-300 absolute -top-2 -right-2 animate-bounce" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          {loadingMessages[messageIndex]}
        </h2>
        
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-loading-bar" />
        </div>
        
        <p className="mt-4 text-gray-400 text-sm">
          This might take a few moments...
        </p>
      </div>
    </div>
  );
}