// User Service — backend user profile operations with mock fallback

import type { User } from '@/types';
import { apiFetch } from './apiClient';

/** Sync user profile to backend on onboarding. Returns null on failure (mock mode continues). */
export async function syncUserToBackend(user: User): Promise<User | null> {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
      name: user.name,
      handle: user.handle,
      bio: user.bio,
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn,
    }),
  });
}

/** Fetch user profile from backend */
export async function fetchUser(userId: string): Promise<User | null> {
  return apiFetch<User>(`/users/${userId}`);
}
