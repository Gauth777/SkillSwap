"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

/**
 * Demo authentication page for SkillSwap. This page uses a simple
 * two‑panel layout: the left side explains the value proposition and
 * karma rules, while the right side contains tabbed sign‑in and
 * sign‑up forms. Submitting either form simply navigates to the feed
 * since there is no real backend for the hackathon.
 */
export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>("signin");

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/feed");
  }
  function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/feed");
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left panel: product value and karma rules */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Join SkillSwap
            </h1>
            <p className="max-w-md text-lg text-slate-600">
              Exchange what you know for what you want to learn. Earn karma by
              teaching, and spend it to learn new skills.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-600"></span>
                <span>Teach a skill you’re comfortable with to earn karma.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-600"></span>
                <span>Spend karma to book learning sessions with peers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-600"></span>
                <span>Ratings and feedback help build trust and quality.</span>
              </li>
            </ul>
          </div>
          {/* Right panel: sign in/up card */}
          <Card className="w-full max-w-md mx-auto">
            <div className="mb-6 flex border-b border-slate-200">
              <button
                className={`flex-1 pb-2 text-center text-sm font-semibold focus:outline-none ${tab === 'signin' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
                onClick={() => setTab("signin")}
              >
                Sign in
              </button>
              <button
                className={`flex-1 pb-2 text-center text-sm font-semibold focus:outline-none ${tab === 'signup' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
                onClick={() => setTab("signup")}
              >
                Sign up
              </button>
            </div>
            {tab === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                    <input
                    id="password"
                    type="password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Continue
                </button>
                <p className="text-center text-sm text-slate-600">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('signup')}
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Create one
                  </button>
                  <button
  onClick={() => signIn("google", { callbackUrl: "/feed" })}
  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
>
  Continue with Google
</button>

<button
  onClick={() => router.push("/feed")}
  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
>
  Continue in demo mode
</button>

                </p>
              </form>
            )}
            {tab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Continue
                </button>
                <p className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('signin')}
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
            <p className="mt-6 text-center text-xs text-slate-500">
              Demo mode — no account required for this hackathon build.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}