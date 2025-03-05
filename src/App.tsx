import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import LandingPage from './components/LandingPage';
import InstructionsPage from './components/InstructionsPage';
import QuestionRound from './components/QuestionRound';
import ImagePerceptionTest from './components/ImagePerceptionTest';
import ReportPage from './components/ReportPage';
import FeedbackPage from './components/FeedbackPage';
import AdminPanel from './components/AdminPanel';

type UserType = 'Student' | 'Faculty' | 'Visitor' | 'Other';

export interface User {
  name: string;
  userType: UserType;
  rollNumber?: string;
}

export type TestStage =
  | 'landing'
  | 'instructions'
  | 'questions'
  | 'imagePerception'
  | 'report'
  | 'feedback';

function App() {
  const [stage, setStage] = useState<TestStage>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRestrictionEnabled, setAdminRestrictionEnabled] = useState(false);
  const [currentActiveQuestion, setCurrentActiveQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [imageAnswers, setImageAnswers] = useState<Record<number, number>>({});

  const handleLogin = (userData: User) => {
    setUser(userData);
    setStage('instructions');

    // Special case for admin login (in a real app, this would be handled by proper authentication)
    if (userData.name.toLowerCase() === 'admin') {
      setIsAdmin(true);
    }
  };

  const handleStartTest = () => {
    setStage('questions');
  };

  const handleQuestionComplete = (questionAnswers: Record<number, number>) => {
    setAnswers(questionAnswers);
    setStage('imagePerception');
  };

  const handleImageTestComplete = (imageTestAnswers: Record<number, number>) => {
    setImageAnswers(imageTestAnswers);
    setStage('report');
  };

  const handleViewReport = () => {
    setStage('feedback');
  };

  const handleFeedbackSubmit = () => {
    // In a real app, we would send the feedback to the backend
    alert('Thank you for your feedback!');
    setStage('landing');
    setUser(null);
    setAnswers({});
    setImageAnswers({});
  };

  const handleAdminToggle = (enabled: boolean) => {
    setAdminRestrictionEnabled(enabled);
  };

  const handleSetActiveQuestion = (questionNumber: number) => {
    setCurrentActiveQuestion(questionNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary-600" />
          <span className="font-poppins font-bold text-xl">PsychoMetrix</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPanel 
            restrictionEnabled={adminRestrictionEnabled}
            onToggleRestriction={handleAdminToggle}
            activeQuestion={currentActiveQuestion}
            onSetActiveQuestion={handleSetActiveQuestion}
          />
        ) : (
          <>
            {stage === 'landing' && <LandingPage onLogin={handleLogin} />}
            
            {stage === 'instructions' && user && (
              <InstructionsPage user={user} onStartTest={handleStartTest} />
            )}
            
            {stage === 'questions' && (
              <QuestionRound
                onComplete={handleQuestionComplete}
                adminRestrictionEnabled={adminRestrictionEnabled}
                currentActiveQuestion={currentActiveQuestion}
                user={user}
              />
            )}
            
            {stage === 'imagePerception' && (
              <ImagePerceptionTest 
                onComplete={handleImageTestComplete} 
                adminRestrictionEnabled={adminRestrictionEnabled}
                currentActiveQuestion={currentActiveQuestion}
              />
            )}
            
            {stage === 'report' && user && (
              <ReportPage 
                user={user} 
                answers={answers} 
                imageAnswers={imageAnswers} 
                onContinue={handleViewReport} 
              />
            )}
            
            {stage === 'feedback' && (
              <FeedbackPage onSubmit={handleFeedbackSubmit} />
            )}
          </>
        )}
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>@Created by Divya, Utkarsh Joshi, Aastha Gupta</p>
      </footer>
    </div>
  );
}

export default App;