import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { User } from '../App';

interface QuestionRoundProps {
  onComplete: (userId: string, assessmentData: any) => void;
  user: User;
}

// Bollywood movie-themed questions
const questions = [
  {
    id: 1,
    question: "What do you do in the FINAL seconds of the championship hockey match?",
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/ckde%20in.jpeg",
    heading: "Chak De! India",
    options: [
      "Take the shot yourself—GO BIG OR GO HOME!",
      "Pass to your best teammate for the safest win.",
      "Huddle up for a quick pep talk—teamwork is key!",
      "Pull off a never-seen-before trick shot for ultimate swag."
    ]
  },
  {
    id: 2,
    question: "You've graduated! Now comes the BIG question—follow your heart or secure the bag?",
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/3-Idiots.jpg",
    heading: "3 Idiots",
    options: [
      "YOLO! Pursue your passion even if it's risky.",
      "Lock in that high-paying job—future secured!",
      "Convince your family to support your dreams.",
      "Why choose? Start a biz that blends BOTH paths!"
    ]
  },
  {
    id: 3,
    question: "Your best friends challenge you to a once-in-a-lifetime adventure trip! What's your move?",
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/Zindagi-Na-Milegi-Dobara.jpg",
    heading: "Zindagi Na Milegi Dobara",
    options: [
      "SKYDIVING BABY! Take the leap and feel alive!",
      "Research everything first—safety first, duh!",
      "Hold your friend's hand and encourage them.",
      "Organize a whole crazy itinerary for max fun!"
    ]
  },
  {
    id: 4,
    question: "You visit a remote Indian village and realize they struggle with basic needs. What's your move?",
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/swades-released-over-17-years-ago-and-since-then-the-v0-ic6nypko8wi91.webp",
    heading: "Swades",
    options: [
      "Drop everything, move back, and create change!",
      "Fund an NGO while managing things from abroad.",
      "Spend time listening to their needs first.",
      "Invent a cool tech solution that fixes everything."
    ]
  },
  {
    id: 5,
    question: "You catch your best friend cheating in an exam! What now?",
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/munna%20bhai.jpg",
    heading: "Munna Bhai MBBS",
    options: [
      "Confront them IMMEDIATELY and demand honesty!",
      "Help them prep better for the next exam.",
      "Cook up a smart way for them to make amends.",
      "Meh, not your problem. Live and let live!"
    ]
  },
  {
    id: 6,
    question: "Your training team is exhausted, and motivation is at rock bottom. What do you do?",
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/Dangale.jpg",
    heading: "Dangal",
    options: [
      "PUSH THROUGH! No excuses, only results!",
      "Break down weaknesses and strategize a comeback.",
      "Give the team an EPIC motivational speech!",
      "Try a crazy new training method no one's thought of!"
    ]
  }
];

const QuestionRound: React.FC<QuestionRoundProps> = ({
  onComplete,
  user
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const questionData = questions.find(q => q.id === currentQuestion) || questions[0];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion]: optionIndex
    });
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);

      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsSubmitting(true);
      setSubmissionError(null);

      const letterAnswers = Object.values(selectedOptions).map(index => {
        switch(index) {
          case 0: return 'A';
          case 1: return 'B';
          case 2: return 'C';
          case 3: return 'D';
          default: return 'A';
        }
      });

      const { name = 'Anonymous', userType = 'Unknown', rollNumber = 'N/A' } = user || {};

      try {
        const response = await axios.post('https://psychometric-backend.onrender.com/submit-assessment', {
          user: {
            name,
            userType,
            rollNumber
          },
          questionAnswers: letterAnswers,
          imageAnswers: ['1', '2', '3']
        });

        onComplete(response.data.user_id, response.data);
      } catch (error: any) {
        console.error('Assessment submission error:', error);
        setSubmissionError(error.response?.data?.message || 'Failed to submit assessment');
        setIsSubmitting(false);
      }
    }
  };

  const progressPercentage = (currentQuestion / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="text-sm text-gray-500 mb-8 flex justify-between">
        <span>Question {currentQuestion} of {questions.length}</span>
      </div>

      {isSubmitting ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <h3 className="text-xl font-medium">Submitting your answers...</h3>
          <p className="text-gray-500 mt-2">Please wait while we process your responses.</p>
        </div>
      ) : (
        <div className="card">
          {submissionError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
              {submissionError}
            </div>
          )}

          <h3 className="text-2xl font-bold text-black mb-4">{questionData.heading}</h3>

          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={questionData.imageUrl}
              alt={questionData.heading}
              className="w-full h-64 object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-6">{questionData.question}</h2>

          <div className="space-y-4 mb-8">
            {questionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedOptions[currentQuestion] === index
                    ? 'border-primary-600 bg-primary-50 text-primary-800'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full mr-3 flex-shrink-0 ${
                    selectedOptions[currentQuestion] === index
                      ? 'bg-primary-600'
                      : 'border border-gray-300'
                  }`}></div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOptions[currentQuestion] === undefined}
              className={`group ${
                selectedOptions[currentQuestion] === undefined
                  ? 'btn-disabled'
                  : 'btn-primary'
              }`}
            >
              {currentQuestion < questions.length ? 'Next Question' : 'Complete & Continue'}
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionRound;
