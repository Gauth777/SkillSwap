// SkillSwap Global Store
// Zustand + AsyncStorage persistence
// All actions delegate to pure business logic in lib/karma.ts
// Backend integration is additive — local mock mode is preserved as fallback

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  User,
  SwapPost,
  SwapSession,
  KarmaTransaction,
  PostType,
  SkillCategory,
  SessionDuration,
} from '@/types';
import {
  createSwapPost as createPost,
  requestSwap as reqSwap,
  acceptSwap as accSwap,
  declineSwap as decSwap,
  completeSwap as compSwap,
  updateKarmaLedger,
} from '@/lib/karma';
import { DEMO_POSTS, DEMO_SESSIONS, DEMO_LEDGER, SKILLS } from '@/data/mock';

// Backend service imports
import { isBackendConfigured } from '@/services/apiClient';
import { syncUserToBackend, fetchUser } from '@/services/userService';
import { fetchPosts, createPostOnBackend } from '@/services/postService';
import {
  fetchUserSwaps,
  requestSwapOnBackend,
  acceptSwapOnBackend,
  declineSwapOnBackend,
  completeSwapOnBackend,
} from '@/services/swapService';
import { fetchKarmaLedger } from '@/services/karmaService';

interface AppState {
  // Auth / onboarding
  isOnboarded: boolean;
  currentUser: User | null;

  // Data
  posts: SwapPost[];
  sessions: SwapSession[];
  karmaLedger: KarmaTransaction[];

  // Actions
  completeOnboarding: (user: User) => void;
  addPost: (params: {
    type: PostType;
    title: string;
    description: string;
    skillName: string;
    category: SkillCategory;
    duration: SessionDuration;
  }) => void;
  requestSwap: (postId: string) => void;
  acceptSwap: (sessionId: string) => void;
  declineSwap: (sessionId: string) => void;
  completeSwap: (sessionId: string) => void;
  resetDemo: () => void;

  // Backend sync (additive)
  syncFromBackend: () => Promise<void>;
}

const INITIAL_USER: User = {
  id: 'u_self',
  name: '',
  handle: '',
  bio: '',
  skillsToTeach: [],
  skillsToLearn: [],
  karmaBalance: 8,
  joinedAt: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      currentUser: null,
      posts: DEMO_POSTS,
      sessions: DEMO_SESSIONS,
      karmaLedger: DEMO_LEDGER,

      completeOnboarding: (user: User) => {
        // Add welcome bonus transaction
        const welcomeTx: KarmaTransaction = {
          id: `tx_welcome_${Date.now()}`,
          userId: user.id,
          delta: 7,
          type: 'welcome_bonus',
          note: 'Welcome to SkillSwap! Here is your starter karma.',
          createdAt: new Date().toISOString(),
        };
        set({
          isOnboarded: true,
          currentUser: { ...user, karmaBalance: 8 },
          karmaLedger: updateKarmaLedger(get().karmaLedger, welcomeTx),
        });

        // Fire-and-forget backend sync
        syncUserToBackend(user).catch(() => {});
      },

      addPost: (params) => {
        const user = get().currentUser;
        if (!user) return;

        const post = createPost({
          authorId: user.id,
          authorName: user.name,
          ...params,
        });

        // Creating a post does NOT change karma
        set({ posts: [post, ...get().posts] });

        // Fire-and-forget backend sync
        createPostOnBackend(post).catch(() => {});
      },

      requestSwap: (postId: string) => {
        const user = get().currentUser;
        if (!user) return;

        const post = get().posts.find((p) => p.id === postId);
        if (!post || post.status !== 'open') return;

        const session = reqSwap({
          post,
          requesterId: user.id,
          requesterName: user.name,
        });

        // Requesting does NOT change karma — optimistic local update
        set({ sessions: [session, ...get().sessions] });

        // Fire-and-forget backend sync
        requestSwapOnBackend(postId, user.id).then((backendSession) => {
          if (backendSession) {
            // Replace local optimistic session with backend one
            set({
              sessions: get().sessions.map((s) =>
                s.id === session.id ? backendSession : s,
              ),
            });
          }
        }).catch(() => {});
      },

      acceptSwap: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session || session.status !== 'pending') return;

        const updated = accSwap(session);
        // Accepting does NOT change karma
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? updated : s,
          ),
        });

        // Fire-and-forget backend sync
        acceptSwapOnBackend(sessionId).catch(() => {});
      },

      declineSwap: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session || session.status !== 'pending') return;

        const updated = decSwap(session);
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? updated : s,
          ),
        });

        // Fire-and-forget backend sync
        declineSwapOnBackend(sessionId).catch(() => {});
      },

      completeSwap: (sessionId: string) => {
        const user = get().currentUser;
        if (!user) return;

        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session || session.status !== 'accepted') return;

        const result = compSwap(session);

        // Determine which transaction applies to current user
        const isTeacher = session.teacherId === user.id;
        const userTx = isTeacher
          ? result.teacherTransaction
          : result.learnerTransaction;

        // Update karma balance
        const newBalance = Math.max(0, user.karmaBalance + userTx.delta);

        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? result.session : s,
          ),
          karmaLedger: updateKarmaLedger(get().karmaLedger, userTx),
          currentUser: { ...user, karmaBalance: newBalance },
        });

        // Fire-and-forget backend sync — backend does atomic completion
        completeSwapOnBackend(sessionId).then((backendResult) => {
          if (backendResult) {
            // Re-sync user balance from backend after completion
            const currentUser = get().currentUser;
            if (currentUser) {
              fetchUser(currentUser.id).then((freshUser) => {
                if (freshUser && typeof freshUser.karmaBalance === 'number') {
                  set({ currentUser: { ...get().currentUser!, karmaBalance: freshUser.karmaBalance } });
                }
              }).catch(() => {});
            }
          }
        }).catch(() => {});
      },

      resetDemo: () => {
        set({
          isOnboarded: false,
          currentUser: null,
          posts: DEMO_POSTS,
          sessions: DEMO_SESSIONS,
          karmaLedger: DEMO_LEDGER,
        });
      },

      /**
       * Fetch fresh data from backend. If backend is offline, state stays unchanged
       * (existing local/mock data is preserved).
       */
      syncFromBackend: async () => {
        if (!isBackendConfigured()) return;

        const user = get().currentUser;
        if (!user) return;

        // Fetch all data in parallel
        const [backendPosts, backendSessions, backendLedger, backendUser] = await Promise.all([
          fetchPosts().catch(() => null),
          fetchUserSwaps(user.id).catch(() => null),
          fetchKarmaLedger(user.id).catch(() => null),
          fetchUser(user.id).catch(() => null),
        ]);

        const updates: Partial<AppState> = {};

        if (backendPosts && backendPosts.length > 0) {
          updates.posts = backendPosts;
        }
        if (backendSessions && backendSessions.length > 0) {
          updates.sessions = backendSessions;
        }
        if (backendLedger && backendLedger.length > 0) {
          updates.karmaLedger = backendLedger;
        }
        if (backendUser && typeof backendUser.karmaBalance === 'number') {
          updates.currentUser = { ...user, karmaBalance: backendUser.karmaBalance };
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },
    }),
    {
      name: 'skillswap-mobile-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
