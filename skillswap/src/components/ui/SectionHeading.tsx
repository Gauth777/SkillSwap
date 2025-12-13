import React from "react";

/**
 * Standardized section heading with optional subtitle. Align can be left
 * or center. Titles and subtitles are kept tight on spacing to ensure
 * consistent vertical rhythm throughout pages.
 */
export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`${alignCls} ${className}`.trim()}>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  );
}