"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/** -------- Types -------- */
export type LedgerItem = {
  id: string;
  title: string;
  delta: number;
  date: string;
  note: string;
};

export type PostType = "Teach" | "Learn";

export type Post = {
  id: number;
  type: PostType;
  title: string;
  description: string;
  karma: number; // + or -
  category: string;
  timestamp: string;
  withName: string;
  responded?: boolean;
};

export type SwapStatus = "Pending" | "Active" | "Completed";
export type SwapDirection = "Teach" | "Learn";

export type Swap = {
  id: string;
  direction: SwapDirection;
  title: string;
  withName: string;
  when: string;
  karma: number;
  status: SwapStatus;
  sourcePostId?: number;
};

type AppState = {
  karmaBalance: number;
  setKarmaBalance: React.Dispatch<React.SetStateAction<number>>;

  ledger: LedgerItem[];
  setLedger: React.Dispatch<React.SetStateAction<LedgerItem[]>>;

  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;

  swaps: Swap[];
  setSwaps: React.Dispatch<React.SetStateAction<Swap[]>>;

  respondToPost: (postId: number) => void;
};

/** -------- Initial Data -------- */
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    type: "Teach",
    title: "Intro to Python",
    description:
      "Offer a crash course on Python basics including variables, loops and functions.",
    karma: 3,
    category: "Programming",
    timestamp: "Dec 14",
    withName: "Aarav",
  },
  {
    id: 2,
    type: "Learn",
    title: "Linear algebra refresher",
    description:
      "Need help understanding matrices, vectors, and eigenvalues before exams.",
    karma: -2,
    category: "Math",
    timestamp: "Dec 15",
    withName: "Isha",
  },
  {
    id: 3,
    type: "Teach",
    title: "Figma prototyping tips",
    description:
      "Sharing best practices for creating clean, interactive prototypes in Figma.",
    karma: 2,
    category: "Design",
    timestamp: "Dec 15",
    withName: "Neel",
  },
  {
    id: 4,
    type: "Learn",
    title: "French conversation practice",
    description:
      "Looking for a native speaker to practice everyday conversational French.",
    karma: -1,
    category: "Language",
    timestamp: "Dec 16",
    withName: "Meera",
  },
  {
    id: 5,
    type: "Teach",
    title: "Data structures deep dive",
    description:
      "A focused session on trees, graphs, and hash tables for interview prep.",
    karma: 4,
    category: "Programming",
    timestamp: "Dec 16",
    withName: "Rohan",
  },
  {
    id: 6,
    type: "Learn",
    title: "Logo design fundamentals",
    description:
      "Need guidance on creating balanced, meaningful, and memorable logos.",
    karma: -3,
    category: "Design",
    timestamp: "Dec 17",
    withName: "Ananya",
  },
];

const INITIAL_SWAPS: Swap[] = [
  {
    id: "s1",
    direction: "Teach",
    title: "Python basics • 30 min",
    withName: "Aarav",
    when: "Today, 7:30 PM",
    karma: +2,
    status: "Pending",
  },
  {
    id: "s2",
    direction: "Learn",
    title: "DSA recursion • 45 min",
    withName: "Isha",
    when: "Tomorrow, 9:00 PM",
    karma: -2,
    status: "Pending",
  },
  {
    id: "s3",
    direction: "Teach",
    title: "UI review • 30 min",
    withName: "Neel",
    when: "Thu, 6:00 PM",
    karma: +3,
    status: "Active",
  },
  {
    id: "s4",
    direction: "Learn",
    title: "Linear algebra refresher",
    withName: "Meera",
    when: "Sat, 11:00 AM",
    karma: -1,
    status: "Completed",
  },
];

const INITIAL_LEDGER: LedgerItem[] = [
  {
    id: "l1",
    title: "Session completed",
    delta: +3,
    date: "Dec 10",
    note: "UI review • Neel",
  },
  {
    id: "l2",
    title: "Booked a session",
    delta: -2,
    date: "Dec 11",
    note: "DSA recursion • Isha",
  },
  {
    id: "l3",
    title: "Welcome bonus",
    delta: +7,
    date: "Dec 11",
    note: "Starter karma",
  },
];

const DEFAULT_STATE = {
  karmaBalance: 8,
  ledger: INITIAL_LEDGER,
  posts: INITIAL_POSTS,
  swaps: INITIAL_SWAPS,
};

const STORAGE_KEY = "skillswap_state_v2";

/** -------- Context -------- */
const AppStateContext = createContext<AppState | null>(null);

/** -------- Provider -------- */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [karmaBalance, setKarmaBalance] = useState<number>(DEFAULT_STATE.karmaBalance);
  const [ledger, setLedger] = useState<LedgerItem[]>(DEFAULT_STATE.ledger);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_STATE.posts);
  const [swaps, setSwaps] = useState<Swap[]>(DEFAULT_STATE.swaps);

  // Load once (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<typeof DEFAULT_STATE>;

      if (typeof parsed.karmaBalance === "number") setKarmaBalance(parsed.karmaBalance);
      if (Array.isArray(parsed.ledger)) setLedger(parsed.ledger as LedgerItem[]);
      if (Array.isArray(parsed.posts)) setPosts(parsed.posts as Post[]);
      if (Array.isArray(parsed.swaps)) setSwaps(parsed.swaps as Swap[]);
    } catch {
      // ignore
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ karmaBalance, ledger, posts, swaps })
      );
    } catch {
      // ignore
    }
  }, [karmaBalance, ledger, posts, swaps]);

  // Create a swap from a feed post (bridge action)
  const respondToPost = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    if (post.responded) return;

    // Mark responded on feed
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, responded: true } : p)));

    // Create a pending swap
    setSwaps((prev) => [
      {
        id: `s_${Date.now()}`,
        direction: post.type,
        title: post.title,
        withName: post.withName,
        when: "Tomorrow, 7:00 PM",
        karma: post.karma,
        status: "Pending",
        sourcePostId: post.id,
      },
      ...prev,
    ]);

    // Ledger entry (no karma change yet)
    setLedger((prev) => [
      {
        id: `l_${Date.now()}`,
        title: "Swap created",
        delta: 0,
        date: "Today",
        note: `${post.title} • ${post.withName}`,
      },
      ...prev,
    ]);
  };

  const value = useMemo(
    () => ({
      karmaBalance,
      setKarmaBalance,
      ledger,
      setLedger,
      posts,
      setPosts,
      swaps,
      setSwaps,
      respondToPost,
    }),
    [karmaBalance, ledger, posts, swaps]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

/** -------- Hook -------- */
export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider />");
  return ctx;
}
