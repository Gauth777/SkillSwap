// SkillSwap Global Store
// Zustand + AsyncStorage persistence
// All actions delegate to pure business logic in lib/karma.ts

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

        // Requesting does NOT change karma
        set({ sessions: [session, ...get().sessions] });
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
    }),
    {
      name: 'skillswap-mobile-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
