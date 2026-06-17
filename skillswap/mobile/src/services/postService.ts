// Post Service — backend post operations with mock fallback

import type { SwapPost } from '@/types';
import { apiFetch } from './apiClient';

/** Fetch all open posts from backend. Returns null on failure. */
export async function fetchPosts(): Promise<SwapPost[] | null> {
  return apiFetch<SwapPost[]>('/posts');
}

/** Create a post on backend. Returns null on failure. */
export async function createPostOnBackend(post: SwapPost): Promise<SwapPost | null> {
  return apiFetch<SwapPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}
