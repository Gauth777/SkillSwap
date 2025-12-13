import React from "react";

/**
 * A responsive max‑width wrapper that centers content and applies
 * horizontal padding. Use this component to wrap major sections of
 * pages so that your layout remains consistent and aligned.
 */
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-6 ${className}`.trim()}>{children}</div>
  );
}