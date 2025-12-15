"use client";

import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import KarmaPill from "../../components/ui/KarmaPill";
import Sidebar from "../../components/ui/Sidebar";
import { useAppState } from "../app-state";

const POSTS = [
  {
    id: 1,
    type: "Teach" as const,
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
    type: "Learn" as const,
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
    type: "Teach" as const,
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
    type: "Learn" as const,
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
    type: "Teach" as const,
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
    type: "Learn" as const,
    title: "Logo design fundamentals",
    description:
      "Need guidance on creating balanced, meaningful, and memorable logos.",
    karma: -3,
    category: "Design",
    timestamp: "Dec 17",
    withName: "Ananya",
  },
];


const CATEGORIES = ["All categories", "Programming", "Design", "Math", "Language"];

export default function FeedPage() {
  const { data } = useSession();
  const { karmaBalance } = useAppState();

  const [filterType, setFilterType] = useState<"All" | "Teach" | "Learn">("All");
  const [category, setCategory] = useState<string>("All categories");
  const [maxCost, setMaxCost] = useState<number>(5);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return POSTS.filter((post) => {
      if (filterType !== "All" && post.type !== filterType) return false;
      if (category !== "All categories" && post.category !== category) return false;
      if (post.type === "Learn" && Math.abs(post.karma) > maxCost) return false;
      return true;
    });
  }, [filterType, category, maxCost]);

  const suggested = useMemo(() => {
    if (filterType === "All") return [];
    return POSTS.filter((p) => p.type !== filterType).slice(0, 3);
  }, [filterType]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-900">
              Opportunity Feed
            </div>
            <div className="text-xs text-slate-500">
              Teach or learn using karma
            </div>
          </div>

          <div>
            {data?.user ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.user.image ?? ""}
                  alt=""
                  className="h-8 w-8 rounded-full border border-slate-200"
                />
                <div className="text-sm font-medium text-slate-900">
                  {data.user.name}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Demo session</div>
            )}
          </div>
        </div>
      </header>

      <div className="py-10">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
  {/* Left sidebar (only after login) */}
  <div className="hidden md:col-span-3 md:block">
    {data?.user ? <Sidebar onOpenGuidelines={() => setGuidelinesOpen(true)} /> : null}
  </div>

  {/* Main */}
  <div className="space-y-6 md:col-span-6">

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="flex gap-2">
                  {(["All", "Teach", "Learn"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        filterType === type
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="category" className="text-sm text-slate-700">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="maxCost" className="text-sm text-slate-700">
                    Max cost
                  </label>
                  <input
                    id="maxCost"
                    type="range"
                    min={1}
                    max={5}
                    value={maxCost}
                    onChange={(e) => setMaxCost(Number(e.target.value))}
                    className="h-2 w-32 cursor-pointer appearance-none rounded-full bg-slate-200"
                  />
                  <span className="text-sm text-slate-700">{maxCost}</span>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.length === 0 ? (
                <p className="text-slate-600">No posts match your filters.</p>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        {post.type}
                      </span>
                      <KarmaPill>
                        {post.karma > 0 ? "+" : "-"}
                        {Math.abs(post.karma)} karma
                      </KarmaPill>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {post.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {post.description}
                    </p>
                   <p className="mt-2 text-xs text-slate-500">
  With{" "}
  <Link
    href={`/u/${post.withName.toLowerCase()}`}
    className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-500"
  >
    {post.withName}
  </Link>
</p>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>Category: {post.category}</span>
                      <span>{post.timestamp}</span>
                    </div>

                    <Link
                      href={data?.user ? "/feed" : "/auth"}
                      className="mt-4 inline-flex h-9 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Respond
                    </Link>
                  </Card>
                ))
              )}
            </div>

            {/* Side */}
            
            <div className="space-y-6 md:col-span-3">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900">Your Karma</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-indigo-600">{karmaBalance}</span>
                  <span className="text-sm text-slate-600">karma</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${(karmaBalance / 10) * 100}%` }}

                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  You earn karma by teaching and spend it to learn. Keep your balance healthy by giving back.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900">
                  Suggested swaps
                </h3>
                <div className="mt-4 space-y-3">
                  {(suggested.length > 0 ? suggested : POSTS.slice(0, 3)).map((post) => (
                    <div key={post.id} className="border-l-2 border-indigo-600 pl-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {post.title}
                      </p>
                      <p className="text-xs text-slate-600">{post.type}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900">Guidelines</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>Be respectful of each other’s time and commitments.</li>
                  <li>Keep sessions focused and actionable for both parties.</li>
                  <li>Provide constructive feedback after every exchange.</li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      {guidelinesOpen && (
  <div className="fixed inset-0 z-50">
    {/* Backdrop */}
    <button
      aria-label="Close guidelines"
      onClick={() => setGuidelinesOpen(false)}
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
    />

    {/* Dialog */}
    <div className="absolute left-1/2 top-1/2 w-[min(620px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Guidelines</h3>
            <p className="mt-1 text-sm text-slate-600">
              Calm, professional exchanges. Keep it useful for both sides.
            </p>
          </div>

          <button
            onClick={() => setGuidelinesOpen(false)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Core rules</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>😃 Be cool, kind, and respectful to one another.</li>
              <li>📣 No self-promotion, spam, or advertisements.</li>
              <li>🤬 No hate speech or harmful language.</li>
              <li>🤔 Rules are subject to common sense.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Session etiquette</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Be respectful of each other’s time and commitments.</li>
              <li>Keep sessions focused and actionable for both parties.</li>
              <li>Provide constructive feedback after every exchange.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
