// SkillSwap Domain Types
// All types used across the mobile app

export type SkillCategory =
  | 'Programming'
  | 'Data Structures'
  | 'Design'
  | 'Machine Learning'
  | 'Communication'
  | 'Career'
  | 'Language'
  | 'Math';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar?: string;
  skillsToTeach: string[]; // skill IDs
  skillsToLearn: string[]; // skill IDs
  karmaBalance: number;
  joinedAt: string; // ISO date
}

export type PostType = 'teach' | 'learn';
export type PostStatus = 'open' | 'closed';
export type SessionDuration = 30 | 45 | 60;

export interface SwapPost {
  id: string;
  authorId: string;
  authorName: string;
  type: PostType;
  title: string;
  description: string;
  skillName: string;
  category: SkillCategory;
  duration: SessionDuration;
  karma: number; // auto-calculated, positive for teach, negative for learn
  status: PostStatus;
  createdAt: string; // ISO date
}

export type SwapStatus = 'pending' | 'accepted' | 'completed' | 'declined';

export interface SwapSession {
  id: string;
  postId: string;
  teacherId: string;
  teacherName: string;
  learnerId: string;
  learnerName: string;
  title: string;
  skillName: string;
  duration: SessionDuration;
  karma: number; // always positive (the amount transferred)
  status: SwapStatus;
  scheduledAt: string;
  completedAt?: string;
}

export type KarmaTransactionType =
  | 'session_completed_earned'
  | 'session_completed_spent'
  | 'welcome_bonus';

export interface KarmaTransaction {
  id: string;
  userId: string;
  delta: number; // positive = earned, negative = spent
  type: KarmaTransactionType;
  relatedSessionId?: string;
  note: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
