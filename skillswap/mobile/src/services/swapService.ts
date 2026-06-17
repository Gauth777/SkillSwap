// Swap Service — backend session operations with mock fallback

import type { SwapSession } from '@/types';
import { apiFetch } from './apiClient';

/** Fetch all sessions for a user from backend */
export async function fetchUserSwaps(userId: string): Promise<SwapSession[] | null> {
  return apiFetch<SwapSession[]>(`/swaps/user/${userId}`);
}

/** Request a swap on backend */
export async function requestSwapOnBackend(
  postId: string,
  requesterId: string,
): Promise<SwapSession | null> {
  return apiFetch<SwapSession>('/swaps/request', {
    method: 'POST',
    body: JSON.stringify({ postId, requesterId }),
  });
}

/** Accept a swap on backend */
export async function acceptSwapOnBackend(sessionId: string): Promise<SwapSession | null> {
  return apiFetch<SwapSession>(`/swaps/${sessionId}/accept`, { method: 'POST' });
}

/** Decline a swap on backend */
export async function declineSwapOnBackend(sessionId: string): Promise<SwapSession | null> {
  return apiFetch<SwapSession>(`/swaps/${sessionId}/decline`, { method: 'POST' });
}

/** Complete a swap on backend. Returns session + transactions. */
export async function completeSwapOnBackend(
  sessionId: string,
): Promise<{ session: SwapSession; teacherTransaction: any; learnerTransaction: any } | null> {
  return apiFetch(`/swaps/${sessionId}/complete`, { method: 'POST' });
}
