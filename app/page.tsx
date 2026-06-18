import Link from 'next/link'
import { UpvoteBadge } from '@/components/brand/UpvoteBadge'
import { buttonVariants } from '@/components/ui/button'
import { PLATFORMS } from '@/lib/platforms'

const GITHUB = 'https://github.com/AhmedFr/launch-kit'

const STEPS = [
  { n: '1', title: 'Point at a folder', body: 'Drop in a project path. We read the README and package.json locally — nothing leaves your machine.' },
  { n: '2', title: 'Review the context', body: 'Confirm what we found, then add intent: audience, angle, goal, and tone.' },
  { n: '3', title: 'Get per-platform kits', body: 'Copy, gallery shots, a video storyboard, and a launch-day plan — written natively for each audience.' },
]

function Tri({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" className={className} aria-hidden>
      <path d="M6 0l6 8H0z" fill="currentColor" />
    </svg>
  )
}

export default function Landing() {
  return (
    <div className="flex-1">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-3">
          <UpvoteBadge count={1} />
          <span className="font-display text-lg font-bold tracking-tight">Launch Kit</span>
        </div>
        <nav className="flex items-center gap-2">
          <a href={GITHUB} target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            <span aria-hidden>★</span> GitHub
          </a>
          <Link href="/runs" className={buttonVariants({ size: 'sm' })}>
            Open your runs
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pb-12 pt-16 text-center sm:pt-24">
        {/* decorative upvote stack */}
        <div className="reveal reveal-1 pointer-events-none mb-8 flex justify-center gap-1.5 text-primary/30">
          <Tri className="h-3 w-4 translate-y-1" />
          <Tri className="h-5 w-7 text-primary/60" />
          <Tri className="h-3 w-4 translate-y-1" />
        </div>

        <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="size-1.5 rounded-full bg-primary" /> Runs locally · bring your own OpenRouter key · your repo never leaves your machine
        </span>

        <h1 className="reveal reveal-2 font-display mx-auto mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
          Turn your repo into a launch
          <span className="text-primary"> worth upvoting</span>
        </h1>

        <p className="reveal reveal-3 mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          Point Launch Kit at a project folder. It reads your README and drafts launch-ready posts —
          tailored for Product Hunt, Hacker News, Reddit, and AppSumo.
        </p>

        <div className="reveal reveal-4 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/runs" className={buttonVariants({ size: 'lg' })}>
            Open your runs <span aria-hidden>→</span>
          </Link>
          <Link href="#run-locally" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Run it locally
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl scroll-mt-8 px-6 py-16">
        <h2 className="font-display text-center text-2xl font-bold tracking-tight sm:text-3xl">
          From folder to launch in three steps
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-bold text-primary">
                {s.n}
              </div>
              <h3 className="font-display mt-4 text-lg font-bold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">One repo, every audience</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            The same core, rewritten natively for where you launch — not one post copy-pasted four times.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2 text-primary">
                <Tri className="h-3 w-4" />
                <span className="font-display font-bold tracking-tight text-foreground">{p.name}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Run it locally */}
      <section id="run-locally" className="mx-auto max-w-5xl scroll-mt-8 px-6 py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Yours in under a minute</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Launch Kit runs entirely on your machine — your code and README never leave it. Clone it,
              add your own OpenRouter key (or use the built-in mock to try it key-free), and go.
            </p>
            <a href={GITHUB} target="_blank" rel="noreferrer" className={`${buttonVariants({ variant: 'outline', size: 'lg' })} mt-5`}>
              <span aria-hidden>★</span> Star it on GitHub
            </a>
          </div>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-5 text-[13px] leading-relaxed shadow-sm">
            <code className="font-mono text-muted-foreground">
              <span className="text-primary">$</span> git clone {GITHUB}.git{'\n'}
              <span className="text-primary">$</span> cd launch-kit{'\n'}
              <span className="text-primary">$</span> pnpm install{'\n'}
              <span className="text-primary">$</span> pnpm dev{'  '}<span className="text-foreground/40"># open the printed URL</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Closing CTA + stars milestone */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-primary/[0.03] px-6 py-14 text-center">
          <div className="mx-auto mb-5 w-fit">
            <UpvoteBadge count={1} />
          </div>
          <h2 className="font-display mx-auto max-w-xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your next launch is one folder away
          </h2>
          {/* STARS MILESTONE — reward at 50 ⭐ */}
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            <span aria-hidden>⭐</span> Hit <span className="font-semibold text-foreground">50 stars</span> and I&apos;ll
            ship a <span className="font-semibold text-foreground">free hosted version</span> — Launch Kit in your
            browser, no clone and no API key.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/runs" className={buttonVariants({ size: 'lg' })}>
              Open your runs <span aria-hidden>→</span>
            </Link>
            <a href={GITHUB} target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <span aria-hidden>★</span> Star on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-10 text-center text-xs text-muted-foreground">
        Launch Kit — runs locally, no accounts, no servers. MIT licensed.
      </footer>
    </div>
  )
}
