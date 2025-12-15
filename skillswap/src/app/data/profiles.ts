export type Profile = {
  handle: string; // url slug
  name: string;
  bio: string;
  avatar?: string; // optional local path
  skills: string[];
  stats: { sessions: number; teach: number; learn: number };
  achievements: string[];
};

export const PROFILES: Record<string, Profile> = {
  naman: {
    handle: "naman",
    name: "Naman",
    bio: "Building SkillSwap — learn actively, teach honestly. Calm systems > loud features.",
    skills: ["Next.js", "UI Reviews", "JavaScript", "Pitching"],
    stats: { sessions: 6, teach: 4, learn: 2 },
    achievements: ["First Swap Completed", "Top Contributor", "Fast Feedback"],
  },
  aarav: {
    handle: "aarav",
    name: "Aarav",
    bio: "Practical Python mentor. I keep sessions tight and beginner-friendly.",
    skills: ["Python", "Problem Solving", "Debugging"],
    stats: { sessions: 11, teach: 9, learn: 2 },
    achievements: ["Reliable Mentor", "3-Day Streak", "Clean Explanations"],
  },
  isha: {
    handle: "isha",
    name: "Isha",
    bio: "Math + DSA learner. I show up prepared and ask precise questions.",
    skills: ["Linear Algebra", "DSA", "Notes"],
    stats: { sessions: 7, teach: 2, learn: 5 },
    achievements: ["Great Learner", "On-Time", "Focused Sessions"],
  },
  neel: {
    handle: "neel",
    name: "Neel",
    bio: "Design systems & sharp UI reviews. Minimal, usable, modern.",
    skills: ["Figma", "Design Systems", "UI Review"],
    stats: { sessions: 9, teach: 7, learn: 2 },
    achievements: ["Design Mentor", "High Ratings", "Fast Turnaround"],
  },
  meera: {
    handle: "meera",
    name: "Meera",
    bio: "Languages + clarity. Calm conversations, consistent progress.",
    skills: ["French", "Conversation Practice", "Habit Building"],
    stats: { sessions: 8, teach: 5, learn: 3 },
    achievements: ["Kind Communicator", "Consistency", "Great Feedback"],
  },
  rohan: {
    handle: "rohan",
    name: "Rohan",
    bio: "Interview-focused DSA sessions. Clean mental models, no fluff.",
    skills: ["Trees", "Graphs", "Hashing"],
    stats: { sessions: 10, teach: 8, learn: 2 },
    achievements: ["DSA Guide", "Structured Sessions", "High Impact"],
  },
  ananya: {
    handle: "ananya",
    name: "Ananya",
    bio: "Brand + logo fundamentals. I help you see balance and meaning.",
    skills: ["Logo Design", "Typography", "Brand Basics"],
    stats: { sessions: 6, teach: 4, learn: 2 },
    achievements: ["Taste Builder", "Clean Critiques", "Strong Outcomes"],
  },
};

export function getProfile(handle: string) {
  return PROFILES[handle.toLowerCase()];
}
