import React from 'react';
import { ChevronDown, ChevronUp, Copy, CheckCircle, Briefcase, Code, ListChecks, Target } from 'lucide-react';
import type { ResumeAnalysis } from '../types/api';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: 'career', title: 'Career Trajectory', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'skills', title: 'Skills Analysis', icon: <Code className="w-5 h-5" /> },
  { id: 'suggestions', title: 'Optimization Suggestions', icon: <ListChecks className="w-5 h-5" /> },
  { id: 'action-plan', title: 'Action Plan', icon: <Target className="w-5 h-5" /> },
];

interface Props {
  analysis: ResumeAnalysis;
  onClose: () => void;
}

export function ResultsDisplay({ analysis, onClose }: Props) {
  const [expandedSection, setExpandedSection] = React.useState<string>('career');
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const handleCopy = async (sectionId: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm min-h-screen w-full py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Resume Analysis Results
        </h2>

        <div className="space-y-4">
          {sections.map(({ id, title, icon }) => (
            <div
              key={id}
              className="bg-black/40 rounded-lg border border-purple-500/20 overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
                className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-purple-500/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="font-medium">{title}</span>
                </div>
                {expandedSection === id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedSection === id && (
                <div className="px-6 py-4 border-t border-purple-500/20">
                  {id === 'career' && (
                    <div className="space-y-4">
                      {analysis.careerTrajectory.map((milestone, index) => (
                        <div key={index} className="relative pl-6 pb-4 border-l-2 border-purple-500/30 last:pb-0">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500" />
                          <h3 className="text-lg font-medium text-white">{milestone.title}</h3>
                          <p className="text-purple-300">{milestone.company}</p>
                          <p className="text-sm text-gray-400">{milestone.duration}</p>
                          <p className="mt-2 text-gray-300">{milestone.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {id === 'skills' && (
                    <div className="space-y-6">
                      {analysis.skills.map((category, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-medium text-white mb-3">{category.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {id === 'suggestions' && (
                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 text-gray-300"
                        >
                          <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {id === 'action-plan' && (
                    <div className="space-y-6">
                      {analysis.actionPlan.map((plan, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-medium text-white mb-3">{plan.title}</h3>
                          <ol className="space-y-3">
                            {plan.steps.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className="flex items-start space-x-3 text-gray-300"
                              >
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-sm text-purple-300">
                                  {stepIndex + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleCopy(id, JSON.stringify(analysis[id], null, 2))}
                    className="mt-4 flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedSection === id ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy to clipboard</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-3 px-4 rounded-lg font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
        >
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}