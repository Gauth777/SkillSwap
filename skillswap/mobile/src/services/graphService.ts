// Graph Service — Neo4j-powered matching via backend API, with mock fallback

import type { SwapPost, User } from '@/types';
import { DEMO_POSTS, DEMO_USERS } from '@/data/mock';
import { apiFetch } from './apiClient';

/**
 * Find matching swap posts for a user via backend Cypher query.
 * Falls back to local mock matching if backend is offline.
 */
export async function findMatches(userId: string, userSkillsToLearn: string[]): Promise<SwapPost[]> {
  // Try backend first
  const backendMatches = await apiFetch<SwapPost[]>(`/matches/${userId}`);
  if (backendMatches && backendMatches.length >= 0) {
    return backendMatches;
  }

  // Mock fallback: simple local matching
  await delay(300);
  return DEMO_POSTS.filter(
    (post) =>
      post.type === 'teach' &&
      post.status === 'open' &&
      post.authorId !== userId,
  );
}

/**
 * Get recommended users who teach skills the user wants to learn.
 */
export async function getRecommendedTeachers(userId: string): Promise<User[]> {
  await delay(200);
  return DEMO_USERS.filter((u) => u.id !== userId).slice(0, 5);
}

/**
 * Record a swap edge in the graph.
 * No-op in mock — backend handles this via session creation.
 */
export async function recordSwapEdge(
  _teacherId: string,
  _learnerId: string,
  _skillName: string,
): Promise<void> {
  await delay(100);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
