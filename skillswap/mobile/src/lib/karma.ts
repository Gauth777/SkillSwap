// SkillSwap Business Logic
// Pure functions — no side effects, no UI, no storage.
// These enforce the karma rules and swap lifecycle.

import type {
  SwapPost,
  SwapSession,
  KarmaTransaction,
  SessionDuration,
  PostType,
  SkillCategory,
} from '@/types';

/**
 * Core karma rule:
 *   30 min → 2 karma
 *   45 min → 3 karma
 *   60 min → 4 karma
 */
export function calculateKarmaFromDuration(duration: SessionDuration): number {
  switch (duration) {
    case 30: return 2;
    case 45: return 3;
    case 60: return 4;
  }
}

/** Create a new swap post. Does NOT change karma. */
export function createSwapPost(params: {
  authorId: string;
  authorName: string;
  type: PostType;
  title: string;
  description: string;
  skillName: string;
  category: SkillCategory;
  duration: SessionDuration;
}): SwapPost {
  const karmaAmount = calculateKarmaFromDuration(params.duration);
  return {
    id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    authorId: params.authorId,
    authorName: params.authorName,
    type: params.type,
    title: params.title,
    description: params.description,
    skillName: params.skillName,
    category: params.category,
    duration: params.duration,
    // Teach posts show positive karma (teacher earns), Learn posts show negative (learner spends)
    karma: params.type === 'teach' ? karmaAmount : -karmaAmount,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}

/** Request a swap from a post. Creates a pending session. Does NOT change karma. */
export function requestSwap(params: {
  post: SwapPost;
  requesterId: string;
  requesterName: string;
}): SwapSession {
  const { post, requesterId, requesterName } = params;
  const isRequesterLearning = post.type === 'teach';

  return {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    postId: post.id,
    teacherId: isRequesterLearning ? post.authorId : requesterId,
    teacherName: isRequesterLearning ? post.authorName : requesterName,
    learnerId: isRequesterLearning ? requesterId : post.authorId,
    learnerName: isRequesterLearning ? requesterName : post.authorName,
    title: post.title,
    skillName: post.skillName,
    duration: post.duration,
    karma: Math.abs(post.karma),
    status: 'pending',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // tomorrow
  };
}

/** Accept a pending swap. Moves to 'accepted'. Does NOT change karma. */
export function acceptSwap(session: SwapSession): SwapSession {
  return { ...session, status: 'accepted' };
}

/** Decline a pending swap. Moves to 'declined'. Does NOT change karma. */
export function declineSwap(session: SwapSession): SwapSession {
  return { ...session, status: 'declined' };
}

/**
 * Complete a swap. THIS is the only point where karma changes.
 * Returns the updated session + two karma transactions (teacher earns, learner spends).
 */
export function completeSwap(session: SwapSession): {
  session: SwapSession;
  teacherTransaction: KarmaTransaction;
  learnerTransaction: KarmaTransaction;
} {
  const now = new Date().toISOString();
  const completedSession: SwapSession = {
    ...session,
    status: 'completed',
    completedAt: now,
  };

  const teacherTransaction: KarmaTransaction = {
    id: `tx_${Date.now()}_t`,
    userId: session.teacherId,
    delta: +session.karma,
    type: 'session_completed_earned',
    relatedSessionId: session.id,
    note: `Taught "${session.title}" to ${session.learnerName}`,
    createdAt: now,
  };

  const learnerTransaction: KarmaTransaction = {
    id: `tx_${Date.now()}_l`,
    userId: session.learnerId,
    delta: -session.karma,
    type: 'session_completed_spent',
    relatedSessionId: session.id,
    note: `Learned "${session.title}" from ${session.teacherName}`,
    createdAt: now,
  };

  return { session: completedSession, teacherTransaction, learnerTransaction };
}

/** Append a transaction to the ledger (immutable). */
export function updateKarmaLedger(
  ledger: KarmaTransaction[],
  transaction: KarmaTransaction,
): KarmaTransaction[] {
  return [transaction, ...ledger];
}

/** Format a duration for display */
export function formatDuration(duration: SessionDuration): string {
  return `${duration} min`;
}

/** Format karma delta for display with sign */
export function formatKarmaDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return '0';
}

/** Get relative time string */
export function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
