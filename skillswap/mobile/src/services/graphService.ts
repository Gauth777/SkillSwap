// Graph Service — Neo4j-powered matching via backend API, with mock fallback

import type { SwapPost, User, UserGraphResponse, UserGraphNode, UserGraphEdge } from '@/types';
import { DEMO_POSTS, DEMO_USERS, SKILLS } from '@/data/mock';
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

/**
 * Fetch a user's personalized Neo4j profile neighborhood graph.
 * If backend is offline or fails, constructs a local fallback graph based on current user skills and posts.
 */
export async function getUserGraph(
  userId: string,
  localUser?: User | null,
  localPosts?: SwapPost[],
): Promise<UserGraphResponse> {
  const backendGraph = await apiFetch<UserGraphResponse>(`/users/${userId}/graph`);
  if (backendGraph && backendGraph.nodes && backendGraph.edges) {
    return { ...backendGraph, isFallback: false };
  }

  // Fallback generation
  const nodes: UserGraphNode[] = [];
  const edges: UserGraphEdge[] = [];

  let name = 'User';
  let teachList: string[] = [];
  let learnList: string[] = [];

  if (localUser && localUser.id === userId) {
    name = localUser.name;
    teachList = localUser.skillsToTeach;
    learnList = localUser.skillsToLearn;
  } else {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      name = found.name;
      teachList = found.skillsToTeach;
      learnList = found.skillsToLearn;
    }
  }

  // Center User Node
  nodes.push({
    id: userId,
    label: name,
    type: 'user',
    group: 'user',
  });

  // Teaching skills
  for (const skillId of teachList) {
    const skill = SKILLS.find((s) => s.id === skillId);
    const label = skill ? skill.name : skillId;
    nodes.push({
      id: skillId,
      label,
      type: 'skill',
      group: 'teach',
    });
    edges.push({
      source: userId,
      target: skillId,
      label: 'CAN_TEACH',
    });
  }

  // Learning skills
  for (const skillId of learnList) {
    const skill = SKILLS.find((s) => s.id === skillId);
    const label = skill ? skill.name : skillId;
    nodes.push({
      id: skillId,
      label,
      type: 'skill',
      group: 'learn',
    });
    edges.push({
      source: userId,
      target: skillId,
      label: 'WANTS_TO_LEARN',
    });
  }

  // Created Posts
  const postsList = localPosts || DEMO_POSTS;
  const userPosts = postsList.filter((p) => p.authorId === userId && p.status === 'open');
  for (const post of userPosts) {
    nodes.push({
      id: post.id,
      label: post.title,
      type: 'post',
      group: 'post',
    });
    edges.push({
      source: userId,
      target: post.id,
      label: 'CREATED',
    });
  }

  return { nodes, edges, isFallback: true };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
