import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { AppStateProvider } from "./app-state";

export const metadata: Metadata = {
  title: {
    default: "SkillSwap",
    template: "%s | SkillSwap",
  },
  description:
    "Karma-based skill exchange platform — learn by teaching and earn karma to learn from others.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <AppStateProvider>{children}</AppStateProvider>
        </Providers>
      </body>
    </html>
  );
}
