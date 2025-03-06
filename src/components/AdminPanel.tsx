import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Users, FileText, BarChart, Download, Filter, MessageCircle } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

// Mapping of feedback keys to questions
const FEEDBACK_QUESTIONS = {
  personalityRating: "Did this quiz help understand your personality better?",
  scenarioRating: "Did scenarios reflect real decision-making?",
  accuracyRating: "Did personality result feel accurate?",
  engagementRating: "Was the experience engaging?",
  insightRating: "Did it make you think in new ways?",
  recommendRating: "Would you recommend to others?"
};

interface AdminPanelProps {
  restrictionEnabled: boolean;
  onToggleRestriction: (enabled: boolean) => void;
  activeQuestion: number;
  onSetActiveQuestion: (questionNumber: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  restrictionEnabled,
  onToggleRestriction,
  activeQuestion,
  onSetActiveQuestion
}) => {
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, assessmentsRes, usersRes] = await Promise.all([
          axios.get('https://psychometric-backend.onrender.com/api/admin/feedbacks'),
          axios.get('https://psychometric-backend.onrender.com/api/admin/assessments'),
          axios.get('https://psychometric-backend.onrender.com/api/admin/users')
        ]);

        // Ensure data is always an array
        setFeedbackData(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
        setAssessments(Array.isArray(assessmentsRes.data) ? assessmentsRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process feedback data for display
  const processFeedback = () => {
    const questionData: { [key: string]: { counts: number[], total: number } } = {};

    feedbackData.forEach((feedback: any) => {
      Object.entries(feedback.feedback_scores).forEach(([questionKey, score]) => {
        if (!questionData[questionKey]) {
          questionData[questionKey] = { counts: [0, 0, 0, 0, 0], total: 0 };
        }
        const numericScore = Number(score) - 1;
        if (numericScore >= 0 && numericScore < 5) {
          questionData[questionKey].counts[numericScore]++;
          questionData[questionKey].total++;
        }
      });
    });

    return questionData;
  };

  const feedbackStats = processFeedback();

  // Chart data for feedback distribution
  const getChartData = (questionKey: string) => ({
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Responses',
      data: feedbackStats[questionKey]?.counts || [],
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
    }]
  });

  // User Type Distribution
  const userTypeDistribution = {
    labels: Object.keys(
      users.reduce((acc, user) => {
        acc[user.user_type] = (acc[user.user_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ),
    datasets: [{
      label: 'Users by Type',
      data: Object.values(
        users.reduce((acc, user) => {
          acc[user.user_type] = (acc[user.user_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1']
    }]
  };

  // Personality Trait Distribution
  const assessmentTraitDistribution = {
    labels: Object.keys(
      assessments.reduce((acc, assessment) => {
        acc[assessment.personality_result] = (acc[assessment.personality_result] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ),
    datasets: [{
      label: 'Assessments by Trait',
      data: Object.values(
        assessments.reduce((acc, assessment) => {
          acc[assessment.personality_result] = (acc[assessment.personality_result] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1']
    }]
  };

  if (loading) {
    return <div className="p-6">Loading data...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Feedback Analysis Section */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6">Detailed Feedback Analysis</h2>

        {Object.entries(FEEDBACK_QUESTIONS).map(([key, question]) => (
          <div key={key} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{question}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Response Distribution</h4>
                <div className="h-64">
                  <Bar
                    key={key} // Force re-mount when data changes
                    data={getChartData(key)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } }
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Response Details</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex justify-between items-center">
                      <span>{rating} Star{rating !== 1 ? 's' : ''}:</span>
                      <span>
                        {feedbackStats[key]?.counts[rating - 1] || 0} (
                        {((feedbackStats[key]?.counts[rating - 1] / feedbackStats[key]?.total) * 100 || 0).toFixed(1)}%
                        )
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-200 font-medium">
                    Total Responses: {feedbackStats[key]?.total || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Additional Comments Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">User Comments</h3>
          <div className="space-y-4">
            {feedbackData.map((feedback, index) => (
              feedback.additional_comments && (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Comment #{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{feedback.additional_comments}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Additional Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">User Type Distribution</h3>
          <div className="h-64">
            <Pie
              key={userTypeDistribution.labels.join('-')} // Force re-mount when data changes
              data={userTypeDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
              }}
            />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Personality Trait Distribution</h3>
          <div className="h-64">
            <Pie
              key={assessmentTraitDistribution.labels.join('-')} // Force re-mount when data changes
              data={assessmentTraitDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
              }}
            />
          </div>
        </div>
      </div>

      {/* User Assessments Section */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6">User Assessment Reports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personality Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map(assessment => {
                const user = users.find(u => u._id === assessment.user_id);
                return (
                  <tr key={assessment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user?.name || 'Unknown User'}
                      {user?.rollNumber && <div className="text-sm text-gray-500">{user.rollNumber}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user?.user_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(assessment.assessment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {assessment.personality_result}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {assessment.question_answers.map((ans: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                            Q{i+1}: {ans}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
