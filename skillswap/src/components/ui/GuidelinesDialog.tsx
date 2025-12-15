"use client";

import Card from "./Card";

export default function GuidelinesDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close guidelines"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Centered dialog wrapper */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <Card className="w-full max-w-[620px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                Guidelines
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Calm, professional exchanges. Keep it useful for both sides.
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Core rules
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>😃 Be cool, kind, and respectful to one another.</li>
                <li>📣 No self-promotion, spam, or advertisements.</li>
                <li>🤬 No hate speech or harmful language.</li>
                <li>🤔 Rules are subject to common sense.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">
                Session etiquette
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Respect each other’s time.</li>
                <li>Keep sessions focused and actionable.</li>
                <li>Leave constructive feedback after.</li>
              </ul>
            </div>

            <div className="pt-1 text-xs text-slate-500">
              Karma updates only when a session is marked complete.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
