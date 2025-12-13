import React from "react";

/**
 * A small pill‑shaped badge for displaying karma costs or earnings.
 * It uses neutral background and muted text to avoid overpowering
 * the surrounding content. You can override styles via className.
 */
export default function KarmaPill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ${className}`.trim()}
    >
      {children}
    </span>
  );
}