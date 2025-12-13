import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900">

  {/* stronger background glow */}
<div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-300/50 blur-[120px]" />

<div className="pointer-events-none absolute top-[420px] left-[6%] h-[420px] w-[420px] rounded-full bg-sky-300/40 blur-[120px]" />

<div className="pointer-events-none absolute top-[900px] right-[4%] h-[520px] w-[520px] rounded-full bg-indigo-300/35 blur-[140px]" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
  <Image
    src="/logo.png"
    alt="SkillSwap logo"
    width={36}
    height={36}
    className="rounded-xl"
    priority
  />
  <span className="text-lg font-semibold tracking-tight">SkillSwap</span>
</div>


          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#how">How it works</a>
            <a className="hover:text-slate-900" href="#why">Why SkillSwap</a>
            <a className="hover:text-slate-900" href="#for">Who it’s for</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/auth"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 md:inline-block"
            >
              Sign in
            </a>
            <a
              href="/auth"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Get started
            </a>
          </div>
        </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                Karma-based skill exchange • No money involved
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
  Exchange skills.
  <br />
  <span className="text-indigo-600">Learn actively.</span>
</h1>


              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Learn new skills by teaching what you already know. SkillSwap uses{" "}
                <span className="font-medium text-slate-800">karma</span> instead of money to make learning fair,
                active, and human.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/auth"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Get started
                </a>
                <a
                  href="#how"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Choice-first matching</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Structured posts</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Ephemeral scheduling chat</span>
              </div>
            </div>

            {/* Product preview placeholder */}
            
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Opportunity Feed</div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Karma: 5
                </div>
              </div>
              <p className="mb-3 text-xs font-medium text-slate-500">
  What learning looks like inside SkillSwap
</p>


              <div className="mt-5 space-y-3">
                {[
                  { type: "Teach", title: "Java basics • 30 min", meta: "+2 karma" },
                  { type: "Learn", title: "DSA recursion • tonight", meta: "-2 karma" },
                  { type: "Teach", title: "UI review • 45 min", meta: "+3 karma" },
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
                   <div className="mt-4 inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white">
  View
</div>

                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                This is a preview. Your app pages will be interactive after sign-in.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-3xl font-semibold tracking-tight">Learning doesn’t have to be passive.</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              SkillSwap turns learning into an active loop: teach, earn karma, learn, repeat.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                { title: "Teach", desc: "Share a skill you’re comfortable with." },
                { title: "Earn Karma", desc: "Teaching earns karma — your learning currency." },
                { title: "Learn", desc: "Spend karma to learn from others, at your pace." },
                { title: "Grow", desc: "Reinforce skills by teaching again and build trust." },
              ].map((x) => (
                <div key={x.title} className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
                  <div className="h-10 w-10 rounded-full border border-slate-200 bg-white" />
                  <h3 className="mt-4 text-base font-semibold">{x.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="bg-gradient-to-b from-slate-100 via-slate-50 to-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight">Why SkillSwap?</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Most platforms teach. SkillSwap makes you participate.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                { title: "Active, not passive", desc: "Learning sticks better when it’s applied and taught — not just watched." },
                { title: "No money involved", desc: "Karma replaces payment, helping reduce access barriers." },
                { title: "Learn from real people", desc: "Peers, seniors, and professionals — you choose what works for you." },
                { title: "Choice & flexibility", desc: "You’re never locked into one teacher or session." },
              ].map((x) => (
                <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold">{x.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section id="for" className="border-t border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100">
  <div className="mx-auto max-w-5xl px-6 py-24 text-center">
    
    <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
      Built for learners everywhere.
    </h2>

    <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
      Students, professionals, and lifelong learners use SkillSwap to exchange knowledge,
      build confidence, and grow — without paywalls or pressure.
    </p>

    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {["Students", "Self-learners", "Career switchers", "Curious minds"].map((t) => (
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

      <p className="mt-2 text-sm text-slate-500">
        No money. No pressure. Start with free karma.
      </p>

      <div className="mt-8">
        <a
          href="/auth"
          className="inline-flex rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Get started
        </a>
      </div>
    </div>

  </div>
</section>
</main>
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-semibold">SkillSwap</div>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                A peer-driven platform where people exchange skills using karma instead of money.
              </p>
            </div>

            <div className="flex gap-10 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Product</div>
                <a className="block text-slate-600 hover:text-slate-900" href="#how">How it works</a>
                <a className="block text-slate-600 hover:text-slate-900" href="#why">Why SkillSwap</a>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Company</div>
                <a className="block text-slate-600 hover:text-slate-900" href="#">About</a>
                <a className="block text-slate-600 hover:text-slate-900" href="#">Privacy</a>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-slate-500">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
