import React, { useState } from 'react';
import { User } from '../App';
import { Brain, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'Student' | 'Faculty' | 'Visitor' | 'Other'>('Student');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');

  const handleStartTest = () => {
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (userType === 'Student' && !rollNumber.trim()) {
      setError('Please enter your roll number');
      return;
    }
    
    const userData: User = {
      name,
      userType,
      ...(userType === 'Student' && { rollNumber }),
    };
    
    onLogin(userData);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="max-w-4xl w-full text-center">
        <div className="flex justify-center mb-8">
          <Brain className="h-20 w-20 text-primary-600" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
          Unlock Your True Potential with Our Psychometric Test!
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A data-driven approach to understanding your personality and decision-making skills.
          Discover insights about yourself that can transform your personal and professional life.
        </p>
        
        <button 
          onClick={handleStartTest}
          className="btn-primary group animate-pulse-slow"
        >
          Start Test
          <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Let's Get Started</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                  User Type
                </label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as any)}
                  className="input"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Visitor">Visitor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {userType === 'Student' && (
                <div className="mb-4">
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="input"
                    placeholder="Enter your roll number"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;