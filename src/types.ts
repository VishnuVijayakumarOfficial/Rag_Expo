export type RagTypeKey =
  | 'native'
  | 'advanced'
  | 'modular'
  | 'graph'
  | 'hybrid'
  | 'agentic'
  | 'corrective'
  | 'self'
  | 'adaptive'
  | 'multimodal';

export interface RagStep {
  step: number;
  title: string;
  subTitle?: string;
  iconName: string;
  isCompleted?: boolean;
}

export interface RagBenefit {
  title: string;
  iconName: string;
  metric?: string;
  description?: string;
}

export interface RagTypeData {
  id: RagTypeKey;
  name: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  steps: RagStep[];
  benefits: RagBenefit[];
  sampleQuestions: string[];
  architectureDetails: {
    overview: string;
    keyFeatures: string[];
    bestFor: string;
    tradeoffs: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestions?: string[];
}
