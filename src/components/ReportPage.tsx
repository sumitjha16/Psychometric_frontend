import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowRight,
  Brain,
  Sparkles,
  LineChart,
  User as UserIcon
} from 'lucide-react';

// Interpretation data for image perception results
const imageInterpretations = {
  1: {
    0: "Seeing the old man shows that you have a sensitive soul. You easily pick up on the emotions and feelings of others, and you are a considerate person. You love deeply and would do anything to make others happy and content.",
    1: "Seeing the woman first shows that you are more logical-minded. Rather than thinking with your emotions, you tend to rationally think things through based on logic. Logical thinkers are oftentimes more prone to use the left side of their brain."
  },
  2: {
    0: "Those who see the rabbit first are deep thinkers. When faced with a decision, they like time to think things through, and then some more time for further consideration. They don't like to make uninformed decisions and tend to only take part in what they can wrap their mind around.",
    1: "Those who saw the duck are more emotionally impulsive. When they are angered, they often have a hard time not showing it, and the same goes for other emotions. Due to this, they are often perceived as emotionally unstable or even abrupt."
  },
  3: {
    0: "You enjoy the feeling of freedom. You don't too much care for being confined or controlled, and when you are in a situation that makes you feel that way, you tend to take flight.",
    1: "You can see things in a way that most cannot. Because of this, you are a wonderful problem solver and give great advice. You are very detail-oriented and very intuitive.",
    2: "You are more of an analytical thinker. When posed with a problem or decision, you take time to think about things and like to consider the big picture. However, you don't get overwhelmed by big picture thinking, instead, you thrive on it."
  }
};

interface ReportPageProps {
  user: {
    name: string;
    userType: string;
    rollNumber?: string;
  };
  answers: Record<number, number>;
  imageAnswers: Record<number, number>;
  onContinue: () => void;
}

const ReportPage: React.FC<ReportPageProps> = ({
  user,
  imageAnswers,
  onContinue
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [personalityResult, setPersonalityResult] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalityResult = async () => {
      try {
        const response = await axios.get(`https://psychometricbackend-production.up.railway.app/get-assessment/${user.name}`);

        if (response.data && response.data.personality_result) {
          setPersonalityResult(response.data.personality_result);

          const newInsights = Object.entries(imageAnswers).map(([imageId, optionIndex]) => {
            const interpretations = imageInterpretations[parseInt(imageId)];
            return interpretations ? interpretations[optionIndex] : '';
          }).filter(insight => insight !== '');

          setInsights(newInsights);
          setIsLoading(false);
          setShowConfetti(true);
        } else {
          throw new Error("No personality result found");
        }
      } catch (error) {
        console.error('Error fetching personality result:', error);
        setError("Failed to fetch personality assessment");
        setIsLoading(false);
      }
    };

    fetchPersonalityResult();
  }, [user.name, imageAnswers]);

  if (error) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
        <h3 className="text-xl font-medium">Analyzing your responses...</h3>
        <p className="text-gray-500 mt-2">Please wait while we generate your personalized report.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-1/4 animate-bounce delay-100">
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="absolute top-10 left-1/2 animate-bounce delay-300">
            <Sparkles className="h-6 w-6 text-primary-500" />
          </div>
          <div className="absolute top-0 right-1/4 animate-bounce delay-500">
            <Sparkles className="h-10 w-10 text-green-500" />
          </div>
        </div>
      )}

      <div className="card mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary-700 mb-2">
            Hey {user.name}, Here's Your Personality Snapshot! 🎭
          </h2>
          <p className="text-gray-600">
            Based on your responses, we've created this personalized analysis of your cognitive style.
          </p>
        </div>

        {personalityResult && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-primary-600 mr-3" />
              <h3 className="text-2xl font-bold text-primary-800">
                Your Unique Personality Profile
              </h3>
            </div>

            <p className="text-gray-700 mb-6">
              {personalityResult.split('\n').map((para, index) => (
                <p key={index} className="mb-4">{para}</p>
              ))}
            </p>
          </div>
        )}

        {/* Image Section */}


        {/* Rest of the sections remain the same */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <LineChart className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-xl font-semibold">Visual Perception Insights</h3>
          </div>

          <div className="bg-secondary-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Your responses reveal interesting patterns about how you process visual information:
            </p>

            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 mt-2 flex-shrink-0"></div>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={onContinue}
            className="btn-primary w-full sm:w-auto group"
          >
            Continue to Feedback
            <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-primary-700">Support this ? Scan to contribute ₹10</h2>
          </div>
          <div className="flex justify-center">
            <img src="https://sumitjha.sirv.com/11d4054d-df60-498b-ab79-af0f863ee459.jpg" alt="UPI id-" className="rounded-lg shadow-lg w-full max-w-3xl" />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="card p-6 bg-secondary-50 mb-8">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium">Your Profile</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500">User Type</p>
              <p className="font-medium">{user.userType}</p>
            </div>

            {user.userType === 'Student' && user.rollNumber && (
              <div>
                <p className="text-gray-500">Roll Number</p>
                <p className="font-medium">{user.rollNumber}</p>
              </div>
            )}

            <div>
              <p className="text-gray-500">Test Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ReportPage;