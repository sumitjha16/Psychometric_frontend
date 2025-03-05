import React from 'react';
import { User } from '../App';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface InstructionsPageProps {
  user: User;
  onStartTest: () => void;
}

const InstructionsPage: React.FC<InstructionsPageProps> = ({ user, onStartTest }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center max-w-6xl mx-auto">
      {/* Left Panel - Illustration */}
      <div className="w-full md:w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Abstract mindset concept" 
          className="rounded-xl shadow-lg w-full h-auto object-cover"
        />
      </div>
      
      {/* Right Panel - Instructions */}
      <div className="w-full md:w-1/2">
        <div className="glassmorphic p-8">
          <h2 className="text-3xl font-bold mb-2 text-primary-700">
            Welcome, {user.name}! 🎉
          </h2>
          
          <p className="text-lg mb-6 text-gray-600">
            This test will evaluate your cognitive patterns and preferences to provide insights into your personality and decision-making style.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-800">Test Rules:</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Each question has four choices. Select the one that best represents you.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Select instinctively; your first impression is often the most accurate. No changes are allowed after selection.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>After the main questions, you'll take a brief image-based perception test.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>A comprehensive report will be generated at the end based on your responses.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> This test takes approximately 10-15 minutes to complete. Please ensure you have uninterrupted time to finish it.
            </p>
          </div>
          
          <button 
            onClick={onStartTest}
            className="btn-primary w-full group"
          >
            Start Test
            <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;