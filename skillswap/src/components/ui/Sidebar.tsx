"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";


type NavItem = {
  label: string;
  href?: string;
  subtitle?: string;
  action?: "guidelines";
};

const NAV: NavItem[] = [
  { label: "Feed", href: "/feed", subtitle: "Opportunities" },
  { label: "Create", href: "/feed?compose=1", subtitle: "Post a swap" },
  { label: "My Swaps", href: "/swaps", subtitle: "Requests" },
  { label: "Guidelines", action: "guidelines", subtitle: "Safety & etiquette" },
];

export default function Sidebar({
  onOpenGuidelines,
}: {
  onOpenGuidelines: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

const isActive = (item: NavItem) => {
  // Guidelines is a modal action, never "active"
  if (item.action === "guidelines") return false;

  // Swaps page
  if (item.href === "/swaps") return pathname === "/swaps";

  // Feed main
  if (item.href === "/feed") return pathname === "/feed" && !searchParams.get("compose");

  // Create tab in feed
  if (item.href === "/feed?compose=1")
    return pathname === "/feed" && searchParams.get("compose") === "1";

  // Default exact match
  return item.href ? pathname === item.href : false;
};
  const { data } = useSession();

  // Sidebar should only show if logged in
  if (!data?.user) return null;

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-[260px] shrink-0 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
      {/* Identity */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.user.image ?? ""}
          alt=""
          className="h-9 w-9 rounded-xl border border-slate-200"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {data.user.name ?? "Member"}
          </div>
          <div className="truncate text-xs text-slate-500">
            Logged in with Google
          </div>
        </div>
      </div>

      {/* Karma */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-3">
        <div className="text-xs font-medium text-slate-600">Karma balance</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-2xl font-semibold text-indigo-600">8</div>
          <div className="text-sm text-slate-600">karma</div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
          <div className="h-full w-[80%] rounded-full bg-indigo-600" />
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 space-y-1">
        {NAV.map((item) => {
         const active = isActive(item);

const base =
  "group flex w-full items-center justify-between rounded-2xl px-3 py-3 transition";

const styles = active
  ? "bg-indigo-600 text-white"
  : "bg-white/60 text-slate-700 hover:bg-slate-100";


          // Guidelines = button (opens modal)
          if (item.action === "guidelines") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onOpenGuidelines}
                className={`${base} ${styles} text-left`}
              >
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  {item.subtitle ? (
                    <div className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>

                      {item.subtitle}
                    </div>
                  ) : null}
                </div>
                <div className="h-2 w-2 rounded-full bg-transparent group-hover:bg-slate-300" />
              </button>
            );
          }

          // Normal nav links
          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`${base} ${styles}`}
            >
              <div>
                <div className="text-sm font-semibold">{item.label}</div>
                {item.subtitle ? (
                  <div className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>

                    {item.subtitle}
                  </div>
                ) : null}
              </div>
              <div
                className={`h-2 w-2 rounded-full ${
  active ? "bg-white" : "bg-transparent group-hover:bg-slate-300"
}`}

              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
