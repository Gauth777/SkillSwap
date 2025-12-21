import Image from "next/image";
import Link from "next/link";
import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";
import Card from "../components/ui/Card";
import KarmaPill from "../components/ui/KarmaPill";

/**
 * Landing page for SkillSwap. This page introduces the product, explains
 * how it works and gently leads visitors toward exploring opportunities
 * or signing up. It leverages design components for consistent spacing
 * and appearance.
 */
export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-300/50 blur-[120px]" />
      <div className="pointer-events-none absolute top-[420px] left-[6%] h-[420px] w-[420px] rounded-full bg-sky-300/40 blur-[120px]" />
      <div className="pointer-events-none absolute top-[900px] right-[4%] h-[520px] w-[520px] rounded-full bg-indigo-300/35 blur-[140px]" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <Container className="flex h-16 items-center">
          {/* Left */}
          <div className="flex flex-1 items-center gap-3">
            <Image
              src="/logo.png"
              alt="SkillSwap logo"
              width={40}
              height={40}
              className="rounded-xl"
              priority
            />
            <span className="text-xl font-semibold tracking-tight">SkillSwap</span>
          </div>

          {/* Center */}
          <nav className="hidden flex-1 justify-center gap-8 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#how">
              How it works
            </a>
            <a className="hover:text-slate-900" href="#why">
              Why SkillSwap
            </a>
            <a className="hover:text-slate-900" href="#for">
              Who it’s for
            </a>
          </nav>

          {/* Right */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <Link
              href="/auth"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 md:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Get started
            </Link>
          </div>
        </Container>
      </header>

      {/* Hero section */}
      <main>
        <section className="py-20 md:py-28">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2">
              {/* Left column: Hero copy */}
              <div>
                <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  Karma‑based skill exchange • No money involved
                </p>
                <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                  Exchange skills.
                  <br />
                  <span className="text-indigo-600">Learn actively.</span>
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  Learn new skills by teaching what you already know. SkillSwap uses{' '}
                  <span className="font-medium text-slate-800">karma</span> instead of money to make learning fair,
                  active, and human.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/auth"
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    Get started
                  </Link>
                  <a
                    href="#how"
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    See how it works
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-600">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    Choice‑first matching
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    Structured posts
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    Ephemeral scheduling chat
                  </span>
                </div>
              </div>

              {/* Right column: Preview feed teaser */}
              <Card>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Opportunity Feed</div>
                  <KarmaPill>Karma: 5</KarmaPill>
                </div>
                <p className="mb-3 text-xs font-medium text-slate-500">
                  What learning looks like inside SkillSwap
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    { type: 'Teach', title: 'Java basics • 30 min', meta: '+2 karma' },
                    { type: 'Learn', title: 'DSA recursion • tonight', meta: '-2 karma' },
                    { type: 'Teach', title: 'UI review • 45 min', meta: '+3 karma' },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">{p.type}</span>
                        <span className="text-xs font-medium text-slate-600">{p.meta}</span>
                      </div>
                      <div className="mt-2 text-sm font-semibold">{p.title}</div>
                      <Link
                        href="/feed"
                        className="mt-4 inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-slate-500">
                  This is a preview. Your app pages will be interactive after sign‑in.
                </p>
              </Card>
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-slate-200 bg-white">
          <Container className="py-16">
            <SectionHeading
              title="Learning doesn’t have to be passive."
              subtitle="SkillSwap turns learning into an active loop: teach, earn karma, learn, repeat."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                { title: 'Teach', desc: 'Share a skill you’re comfortable with.' },
                { title: 'Earn Karma', desc: 'Teaching earns karma — your learning currency.' },
                { title: 'Learn', desc: 'Spend karma to learn from others, at your pace.' },
                { title: 'Grow', desc: 'Reinforce skills by teaching again and build trust.' },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur"
                >
                  <div className="h-10 w-10 rounded-full border border-slate-200 bg-white" />
                  <h3 className="mt-4 text-base font-semibold">{x.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Why */}
        <section id="why" className="bg-gradient-to-b from-slate-100 via-slate-50 to-white">
          <Container className="py-16">
            <h2 className="text-2xl font-semibold tracking-tight">Why SkillSwap?</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Most platforms teach. SkillSwap makes you participate.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: 'Active, not passive',
                  desc: 'Learning sticks better when it’s applied and taught — not just watched.',
                },
                {
                  title: 'No money involved',
                  desc: 'Karma replaces payment, helping reduce access barriers.',
                },
                {
                  title: 'Learn from real people',
                  desc: 'Peers, seniors, and professionals — you choose what works for you.',
                },
                {
                  title: 'Choice & flexibility',
                  desc: 'You’re never locked into one teacher or session.',
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold">{x.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Who it's for */}
        <section
          id="for"
          className="border-t border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100"
        >
          <Container className="py-24 text-center max-w-5xl">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Built for learners everywhere.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Students, professionals, and lifelong learners use SkillSwap to exchange knowledge,
              build confidence, and grow — without paywalls or pressure.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {['Students', 'Self‑learners', 'Career switchers', 'Curious minds'].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-12">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Ready to learn actively?
              </h3>
              <p className="mt-4 text-lg text-slate-600">
                Turn what you know into your next skill.
              </p>
              <p className="mt-2 text-sm text-slate-500">No money. No pressure. Start with free karma.</p>
              <div className="mt-8">
                <Link
                  href="/auth"
                  className="inline-flex rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Get started
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100">
        <Container className="py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-semibold">SkillSwap</div>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                A peer‑driven platform where people exchange skills using karma instead of money.
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Product</div>
                <a className="block text-slate-600 hover:text-slate-900" href="#how">
                  How it works
                </a>
                <a className="block text-slate-600 hover:text-slate-900" href="#why">
                  Why SkillSwap
                </a>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Company</div>
                <a className="block text-slate-600 hover:text-slate-900" href="#">
                  About
                </a>
                <a className="block text-slate-600 hover:text-slate-900" href="#">
                  Privacy
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 text-xs text-slate-500">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
}