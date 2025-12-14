"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import KarmaPill from "../../components/ui/KarmaPill";
import Sidebar from "../../components/ui/Sidebar";
import GuidelinesDialog from "../../components/ui/GuidelinesDialog";
import { useAppState } from "../app-state";

type SwapStatus = "Pending" | "Active" | "Completed";
type SwapDirection = "Teach" | "Learn";

type Swap = {
  id: string;
  direction: SwapDirection;
  title: string;
  withName: string;
  when: string;
  karma: number; // + for Teach, - for Learn
  status: SwapStatus;
};

type LedgerItem = {
  id: string;
  title: string;
  delta: number;
  date: string;
  note: string;
};

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SwapsPage() {
  const { data } = useSession();

  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [showAllLedger, setShowAllLedger] = useState(false);

  const isSignedIn = Boolean(data?.user);

  const [swaps, setSwaps] = useState<Swap[]>(INITIAL_SWAPS);

  // ✅ Global app state (shared across Feed / Sidebar / Swaps)
  const { karmaBalance, setKarmaBalance, ledger, setLedger } = useAppState();

  // ✅ Seed the ledger once (only if empty)
  useEffect(() => {
    if (ledger.length === 0) setLedger(INITIAL_LEDGER);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pending = useMemo(
    () => swaps.filter((s) => s.status === "Pending"),
    [swaps]
  );
  const active = useMemo(
    () => swaps.filter((s) => s.status === "Active"),
    [swaps]
  );
  const completed = useMemo(
    () => swaps.filter((s) => s.status === "Completed"),
    [swaps]
  );

  const pushLedger = (item: Omit<LedgerItem, "id">) => {
    setLedger((prev) => [
      { ...item, id: `l${prev.length + 1}` },
      ...prev,
    ]);
  };

  const acceptSwap = (id: string) => {
    if (!isSignedIn) return;
    setSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Active" } : s))
    );
    pushLedger({
      title: "Request accepted",
      delta: 0,
      date: "Today",
      note: "Moved to Active",
    });
  };

  const declineSwap = (id: string) => {
    if (!isSignedIn) return;
    const swap = swaps.find((s) => s.id === id);

    setSwaps((prev) => prev.filter((s) => s.id !== id));

    pushLedger({
      title: "Request declined",
      delta: 0,
      date: "Today",
      note: swap ? swap.title : "Removed request",
    });
  };

  const markComplete = (id: string) => {
    if (!isSignedIn) return;
    const swap = swaps.find((s) => s.id === id);
    if (!swap) return;

    setSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Completed" } : s))
    );

    // ✅ Apply karma only on completion
    const nextBalance = clamp(karmaBalance + swap.karma, 0, 99);
    setKarmaBalance(nextBalance);

    pushLedger({
      title: "Session completed",
      delta: swap.karma,
      date: "Today",
      note: `${swap.title} • ${swap.withName}`,
    });
  };

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
              Track requests, sessions, and completion
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
          <div className="flex gap-8">
            {/* Left sidebar */}
            <Sidebar onOpenGuidelines={() => setGuidelinesOpen(true)} />

            {/* Main content */}
            <div className="grid flex-1 gap-8 md:grid-cols-12">
              <div className="space-y-6 md:col-span-8">
                {/* Pending */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Pending requests
                      </div>
                      <div className="text-xs text-slate-500">
                        Accept to start, decline to clear the queue
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      {pending.length} pending
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {pending.length === 0 ? (
                      <div className="text-sm text-slate-600">
                        No pending requests right now.
                      </div>
                    ) : (
                      pending.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-slate-200 bg-white/70 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-700">
                              {s.direction}
                            </div>
                            <KarmaPill>
                              {s.karma > 0 ? "+" : "-"}
                              {Math.abs(s.karma)} karma
                            </KarmaPill>
                          </div>

                          <div className="mt-2 text-sm font-semibold text-slate-900">
                            {s.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            With{" "}
                            <span className="font-medium text-slate-700">
                              {s.withName}
                            </span>{" "}
                            • {s.when}
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => acceptSwap(s.id)}
                              disabled={!isSignedIn}
                              className="inline-flex h-9 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => declineSwap(s.id)}
                              disabled={!isSignedIn}
                              className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Active */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Active sessions
                      </div>
                      <div className="text-xs text-slate-500">
                        When the session happens, mark it complete
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      {active.length} active
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {active.length === 0 ? (
                      <div className="text-sm text-slate-600">
                        No active sessions yet.
                      </div>
                    ) : (
                      active.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-slate-200 bg-white/70 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-700">
                              {s.direction}
                            </div>
                            <div className="text-xs text-slate-500">{s.when}</div>
                          </div>

                          <div className="mt-2 text-sm font-semibold text-slate-900">
                            {s.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            With{" "}
                            <span className="font-medium text-slate-700">
                              {s.withName}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-600">
                              Apply karma on completion
                            </div>
                            <button
                              onClick={() => markComplete(s.id)}
                              disabled={!isSignedIn}
                              className="inline-flex h-9 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                              Mark complete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Completed */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Completed swaps
                      </div>
                      <div className="text-xs text-slate-500">
                        History that proves the system works
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      {completed.length} completed
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {completed.length === 0 ? (
                      <div className="text-sm text-slate-600">
                        No completed swaps yet.
                      </div>
                    ) : (
                      completed.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-slate-200 bg-white/70 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-700">
                              {s.direction}
                            </div>
                            <KarmaPill>
                              {s.karma > 0 ? "+" : "-"}
                              {Math.abs(s.karma)} karma
                            </KarmaPill>
                          </div>
                          <div className="mt-2 text-sm font-semibold text-slate-900">
                            {s.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            With{" "}
                            <span className="font-medium text-slate-700">
                              {s.withName}
                            </span>{" "}
                            • {s.when}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>

              {/* Right rail: Karma Ledger */}
              <div className="space-y-6 md:col-span-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">
                      Karma Ledger
                    </div>
                    <div className="text-xs text-slate-500">Balance</div>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-indigo-600">
                      {karmaBalance}
                    </div>
                    <div className="text-sm text-slate-600">karma</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(showAllLedger ? ledger : ledger.slice(0, 4)).map((l) => (
                      <div
                        key={l.id}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-slate-800">
                            {l.title}
                          </div>
                          <div
                            className={`text-xs font-semibold ${
                              l.delta >= 0 ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {l.delta >= 0 ? "+" : "-"}
                            {Math.abs(l.delta)}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{l.note}</div>
                        <div className="mt-2 text-[11px] text-slate-400">{l.date}</div>
                      </div>
                    ))}
                  </div>

                  {ledger.length > 4 && (
                    <button
                      onClick={() => setShowAllLedger((v) => !v)}
                      className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {showAllLedger ? "Show less" : "Show more"}
                    </button>
                  )}

                  <div className="mt-4 text-xs text-slate-500">
                    Karma updates only when a session is marked complete — keeps the
                    system honest.
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-sm font-semibold text-slate-900">
                    What this proves
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">
                    Requests → sessions → completion → karma ledger. A clean loop
                    that judges can understand in 5 seconds.
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <GuidelinesDialog
        open={guidelinesOpen}
        onClose={() => setGuidelinesOpen(false)}
      />
    </div>
  );
}
