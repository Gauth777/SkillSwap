"use client";

import { SessionProvider } from "next-auth/react";
import { AppStateProvider } from "./app-state";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppStateProvider>{children}</AppStateProvider>
    </SessionProvider>
  );
}
