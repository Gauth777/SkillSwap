"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Container from "../../../components/ui/Container";
import Card from "../../../components/ui/Card";
import { getProfile } from "../../data/profiles";
import { useAppState } from "../../app-state";

export default function ProfilePage() {
  const params = useParams<{ handle: string }>();
  const handle = params?.handle ?? "";
  const profile = useMemo(() => getProfile(handle), [handle]);
  const { karmaBalance } = useAppState();

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <Container>
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Profile not found
            </div>
            <div className="mt-1 text-sm text-slate-600">
              This handle doesn’t exist in the demo dataset.
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          {/* Main */}
          <div className="space-y-6 md:col-span-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-white grid place-items-center text-sm font-semibold text-slate-700">
                  {profile.name.slice(0, 1)}
                </div>

                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-slate-900">
                    {profile.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    @{profile.handle}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {profile.bio}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-900">
                Achievements
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Achievements unlock as sessions are completed.
              </div>
            </Card>
          </div>

          {/* Right rail */}
          <div className="space-y-6 md:col-span-4">
            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-900">
                Reputation
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <div className="text-4xl font-bold text-indigo-600">
                  {karmaBalance}
                </div>
                <div className="text-sm text-slate-600">karma</div>
              </div>

              <div className="mt-3 text-xs leading-relaxed text-slate-500">
                Karma is earned only when a session is completed. It reflects
                contribution, not activity.
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
