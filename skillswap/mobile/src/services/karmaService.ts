// Karma Service — backend karma ledger operations with mock fallback

import type { KarmaTransaction } from '@/types';
import { apiFetch } from './apiClient';

/** Fetch karma transaction history for a user */
export async function fetchKarmaLedger(userId: string): Promise<KarmaTransaction[] | null> {
  return apiFetch<KarmaTransaction[]>(`/karma/${userId}`);
}
