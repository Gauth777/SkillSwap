import React from "react";

/**
 * A generic card component that provides a consistent appearance for
 * content blocks. Uses a soft border, slight backdrop blur and
 * rounded corners. You can override the padding and additional
 * classes with the className prop.
 */
export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-sm backdrop-blur ${className}`.trim()}
    >
      {children}
    </div>
  );
}