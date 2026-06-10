// Graph Service — Neo4j placeholder
// Future: Connect to Neo4j Aura for skill graph matching and recommendations

import type { SwapPost, User } from '@/types';
import { DEMO_POSTS, DEMO_USERS } from '@/data/mock';

/**
 * Find matching swap posts based on user's learning interests.
 * Future: Will query Neo4j graph for skill-neighbor recommendations.
 */
export async function findMatches(userId: string, userSkillsToLearn: string[]): Promise<SwapPost[]> {
  // Mock: return posts where the skill matches what the user wants to learn
  await delay(300);
  return DEMO_POSTS.filter(
    (post) =>
      post.type === 'teach' &&
      post.status === 'open' &&
      post.authorId !== userId &&
      userSkillsToLearn.some((skillId) => {
        const skill = DEMO_USERS.find((u) => u.id === userId)?.skillsToLearn ?? [];
        return skill.length > 0; // simplified match
      }),
  );
}

/**
 * Get recommended users who teach skills the user wants to learn.
 * Future: Graph traversal for 2nd/3rd degree connections.
 */
export async function getRecommendedTeachers(userId: string): Promise<User[]> {
  await delay(200);
  return DEMO_USERS.filter((u) => u.id !== userId).slice(0, 5);
}

/**
 * Record a swap edge in the graph.
 * Future: Creates a relationship between two user nodes.
 */
export async function recordSwapEdge(
  _teacherId: string,
  _learnerId: string,
  _skillName: string,
): Promise<void> {
  await delay(100);
  // No-op in mock
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
