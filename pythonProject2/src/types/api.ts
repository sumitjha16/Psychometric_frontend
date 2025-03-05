export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface CareerMilestone {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface ResumeAnalysis {
  careerTrajectory: CareerMilestone[];
  skills: SkillCategory[];
  suggestions: string[];
  actionPlan: {
    title: string;
    steps: string[];
  }[];
}