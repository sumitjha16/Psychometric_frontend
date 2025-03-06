import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

// Rating options for the feedback questions
const ratingLabels = [
  "Nope, not at all",
  "Eh, kinda",
  "Hmm, makes sense",
  "Whoa, that was cool",
  "OMG, this read my mind"
];

const recommendLabels = [
  "No way",
  "Maybe… if I have to",
  "Yeah, it's kinda cool",
  "For sure! My friends would love this",
  "ABSOLUTELY! Everyone needs to try this"
];

const FeedbackPage: React.FC = () => {
  const [personalityRating, setPersonalityRating] = useState<number | null>(null);
  const [scenarioRating, setScenarioRating] = useState<number | null>(null);
  const [accuracyRating, setAccuracyRating] = useState<number | null>(null);
  const [engagementRating, setEngagementRating] = useState<number | null>(null);
  const [insightRating, setInsightRating] = useState<number | null>(null);
  const [recommendRating, setRecommendRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all ratings are numbers and not null
    if (
      personalityRating === null ||
      scenarioRating === null ||
      accuracyRating === null ||
      engagementRating === null ||
      insightRating === null ||
      recommendRating === null
    ) {
      setSubmitError('Please complete all ratings before submitting.');
      return;
    }

    // Prepare feedback data
    const feedbackData = {
      feedbackScores: {
        personalityRating: personalityRating,
        scenarioRating: scenarioRating,
        accuracyRating: accuracyRating,
        engagementRating: engagementRating,
        insightRating: insightRating,
        recommendRating: recommendRating
      },
      additionalComments: feedback || null
    };

    try {
      // Send feedback to backend
      const response = await axios.post('https://psychometric-backend.onrender.com/submit-feedback', feedbackData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle successful submission
      setSubmitted(true);
      setSubmitError(null);

      // Optional: Reset form after 2 seconds
      setTimeout(() => {
        setSubmitted(false);
        // Reset all form states
        setPersonalityRating(null);
        setScenarioRating(null);
        setAccuracyRating(null);
        setEngagementRating(null);
        setInsightRating(null);
        setRecommendRating(null);
        setFeedback('');
      }, 2000000);
    } catch (error) {
      // Error handling
      if (axios.isAxiosError(error)) {
        console.error('Feedback submission error:', error.response?.data);
        setSubmitError(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to submit feedback. Please try again.'
        );
      } else {
        console.error('Unexpected error:', error);
        setSubmitError('An unexpected error occurred.');
      }
    }
  };

  // Check if all required ratings are provided
  const canSubmit = personalityRating !== null &&
                    scenarioRating !== null &&
                    accuracyRating !== null &&
                    engagementRating !== null &&
                    insightRating !== null &&
                    recommendRating !== null;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {submitted ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Your Feedback!</h2>
            <p className="text-gray-600 mb-6">
              Your input helps us improve our psychometric test experience.
            </p>

          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary-700 mb-2">
                We Value Your Opinion! 💬
              </h2>
              <p className="text-gray-600">
                Please take a moment to share your thoughts about the psychometric test experience.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Question 1 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-800 mb-3">
                  1. Did this quiz help you understand your personality better?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPersonalityRating(value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        personalityRating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {value}. {ratingLabels[value-1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question 2 */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-800 mb-3">
                  2. Did the scenarios and choices reflect how you actually make decisions?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setScenarioRating(value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        scenarioRating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {value}. {ratingLabels[value-1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question 3 */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-800 mb-3">
                  3. Did the final personality result feel accurate to you?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAccuracyRating(value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        accuracyRating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {value}. {ratingLabels[value-1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question 4 */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-800 mb-3">
                  4. Was the experience engaging and enjoyable throughout?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEngagementRating(value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        engagementRating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {value}. {ratingLabels[value-1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question 5 */}
              <div className="mb-6 p-4 bg-pink-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-800 mb-3">
                  5. Did the game make you think about yourself in a new way?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setInsightRating(value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        insightRating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {value}. {ratingLabels[value-1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question 6 */}
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-800 mb-3">
                  6. Would you recommend this to others?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRecommendRating(value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        recommendRating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {value}. {recommendLabels[value-1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Question 7 - Open feedback */}
              <div className="mb-8">
                <label htmlFor="feedback" className="block text-lg font-medium text-gray-700 mb-3">
                  7. Anything else you'd like to share? (Quick feedback, thoughts, or just a fun reaction!)
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="input"
                  placeholder="Share your thoughts here..."
                ></textarea>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={!canSubmit ? 'btn-disabled' : 'btn-primary'}
                >
                  Submit Feedback
                </button>
                
                {!canSubmit && (
                  <p className="mt-2 text-sm text-red-500">
                    Please answer all questions before submitting
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
