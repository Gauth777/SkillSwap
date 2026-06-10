// AI Service — Sarvam AI placeholder
// Future: Connect to Sarvam AI for skill recommendations and chat assistant

import type { Skill } from '@/types';

const CANNED_RESPONSES = [
  "That's a great question! Based on your skills, I'd recommend looking into React hooks — there are several teachers available right now.",
  "I can see you're interested in Machine Learning. Priya has an open session on ML basics that might be a perfect fit.",
  "For DSA preparation, Rohan's sessions are highly rated. Would you like me to help you request a swap?",
  "Your teaching skills in Python are in demand! Consider posting a 30-minute session to earn some quick karma.",
  "Based on your learning history, Communication skills could complement your technical profile nicely.",
];

/**
 * Get an AI response to a user message.
 * Future: Will call Sarvam AI API for contextual responses.
 */
export async function getAIResponse(message: string): Promise<string> {
  await delay(800); // Simulate API latency
  const index = Math.abs(hashCode(message)) % CANNED_RESPONSES.length;
  return CANNED_RESPONSES[index];
}

/**
 * Get skill recommendations for a user.
 * Future: AI-powered skill gap analysis.
 */
export async function getSkillRecommendations(_userId: string): Promise<Skill[]> {
  await delay(500);
  return [
    { id: 'sk_react', name: 'React', category: 'Programming' },
    { id: 'sk_comm', name: 'Communication skills', category: 'Communication' },
    { id: 'sk_ml', name: 'Machine Learning basics', category: 'Machine Learning' },
  ];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
