// Auth Service — placeholder
// Future: Firebase Auth or custom authentication

import type { User } from '@/types';

/**
 * Sign in with email/password.
 * Future: Firebase Auth or custom backend.
 */
export async function signIn(_email: string, _password: string): Promise<User> {
  await delay(500);
  // Mock: return a default user
  return {
    id: 'u_self',
    name: 'Demo User',
    handle: 'demo',
    bio: '',
    skillsToTeach: [],
    skillsToLearn: [],
    karmaBalance: 8,
    joinedAt: new Date().toISOString(),
  };
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

/**
 * Create a new account.
 * Future: Firebase Auth or custom backend.
 */
export async function signUp(params: SignUpParams): Promise<User> {
  await delay(500);
  return {
    id: `u_${Date.now()}`,
    name: params.name,
    handle: params.name.toLowerCase().replace(/\s+/g, ''),
    bio: '',
    skillsToTeach: [],
    skillsToLearn: [],
    karmaBalance: 7, // Welcome bonus
    joinedAt: new Date().toISOString(),
  };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await delay(200);
  // No-op in mock
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
