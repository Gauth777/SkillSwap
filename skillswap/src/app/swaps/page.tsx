"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import KarmaPill from "../../components/ui/KarmaPill";
import Sidebar from "../../components/ui/Sidebar";
import { useState } from "react";

export default function SwapsPage() {
  const { data } = useSession();
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  // Mock swaps data (hackathon-grade)
  const active = [
    { id: 1, title: "Figma prototyping tips", when: "Today • 8:30 PM", karma: +2 },
  ];

  const pending = [
    { id: 2, title: "Linear algebra refresher", meta: "Outgoing • Waiting for confirmation", karma: -2 },
    { id: 3, title: "UI review • 45 min", meta: "Incoming • Needs your approval", karma: +3 },
  ];

  const completed = [
    { id: 4, title: "Linear algebra refresher", meta: "Completed • Karma spent", karma: -2 },
  ];

  // Karma math: starter 10, spent 2 => current 8
  const starter = 10;
  const spent = 2;
  const current = starter - spent;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-900">
              My Swaps
            </div>
            <div className="text-xs text-slate-500">
              Sessions, requests, and karma outcomes
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
            {/* Left sidebar (only when logged in) */}
            <div className="hidden md:col-span-3 md:block">
              {data?.user ? (
                <Sidebar onOpenGuidelines={() => setGuidelinesOpen(true)} />
              ) : null}
            </div>

            {/* Main */}
            <div className="space-y-6 md:col-span-6">
              {/* Active sessions */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Active sessions
                  </h2>
                  <span className="text-xs text-slate-500">{active.length}</span>
                </div>

                <div className="mt-4 space-y-3">
                  {active.map((x) => (
                    <div
                      key={x.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {x.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{x.when}</div>
                        </div>
                        <KarmaPill>+{x.karma}</KarmaPill>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                          View details
                        </button>
                        <button className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                          Join session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Pending requests */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Pending requests
                  </h2>
                  <span className="text-xs text-slate-500">{pending.length}</span>
                </div>

                <div className="mt-4 space-y-3">
                  {pending.map((x) => (
                    <div
                      key={x.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {x.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{x.meta}</div>
                        </div>
                        <KarmaPill>
                          {x.karma > 0 ? `+${x.karma}` : x.karma}
                        </KarmaPill>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                          Message
                        </button>
                        <button className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Completed swaps */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Completed swaps
                  </h2>
                  <span className="text-xs text-slate-500">{completed.length}</span>
                </div>

                <div className="mt-4 space-y-3">
                  {completed.map((x) => (
                    <div
                      key={x.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {x.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{x.meta}</div>
                        </div>
                        <KarmaPill>{x.karma}</KarmaPill>
                      </div>

                      <button className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                        Leave feedback
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Link
                href="/feed"
                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 hover:bg-slate-50"
              >
                Back to Feed
              </Link>
            </div>

            {/* Right panel */}
            <div className="space-y-6 md:col-span-3">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900">Karma ledger</h3>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Starter karma</span>
                    <span className="font-semibold">{starter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Spent (learning)</span>
                    <span className="font-semibold">-{spent}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <span className="text-slate-600">Current balance</span>
                    <span className="font-semibold text-indigo-600">{current}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Karma updates when a swap is completed. Pending requests don’t change your balance yet.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-900">System note</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  This is a demo build. Scheduling and chat are represented as UI flows for judging.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      {/* Guidelines modal (reuse same modal block as feed) */}
      {guidelinesOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close guidelines"
            onClick={() => setGuidelinesOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
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
                    <li>Be cool, kind, and respectful to one another.</li>
                    <li>No self-promotion, spam, or advertisements.</li>
                    <li>No hate speech or harmful language.</li>
                    <li>Rules are subject to common sense.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Session etiquette</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    <li>Be respectful of each other’s time and commitments.</li>
                    <li>Keep sessions focused and actionable for both parties.</li>
                    <li>Provide constructive feedback after every exchange.</li>
                    <li>Close the loop after every swap.</li>
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
