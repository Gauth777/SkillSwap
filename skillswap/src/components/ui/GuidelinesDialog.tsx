"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function GuidelinesDialog({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        aria-label="Close guidelines"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
      />

      {/* dialog */}
      <div className="relative mx-auto mt-24 w-[min(640px,calc(100%-2rem))]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Guidelines
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Calm rules that keep the exchange useful and respectful.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">😃 Be cool</div>
              <div className="mt-1 text-sm leading-relaxed text-slate-600">
                Be kind, direct, and respectful. No ego, no drama.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">📣 No self-promo</div>
              <div className="mt-1 text-sm leading-relaxed text-slate-600">
                No advertisements, spam, or “follow me” deals.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">🤬 No harmful language</div>
              <div className="mt-1 text-sm leading-relaxed text-slate-600">
                Hate speech or abusive content gets removed. Period.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <div className="text-sm font-semibold text-slate-900">🤝 Make it practical</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>• Respect each other’s time and commitments.</li>
                <li>• Keep sessions focused and actionable.</li>
                <li>• Close the loop with constructive feedback.</li>
              </ul>
            </div>

            <div className="text-xs text-slate-500">
              Rules are subject to common sense. SkillSwap is exchange-first — not a marketplace.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
