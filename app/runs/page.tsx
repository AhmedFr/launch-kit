'use client'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { RunCard } from '@/components/runs/RunCard'
import { useRunsList } from '@/lib/runs/useRunsList'

export default function RunsPage() {
  const { runs, loaded, remove } = useRunsList()

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="reveal reveal-1 mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Your runs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every folder you launch lives here — pick up where you left off, or start a new one.
          </p>
        </div>
        {loaded && runs.length > 0 && (
          <Link href="/runs/new" className={buttonVariants({ size: 'lg' })}>
            + New run
          </Link>
        )}
      </div>

      {!loaded ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Loading your runs…</p>
      ) : runs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="reveal reveal-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NewRunCard />
          {runs.map((run) => (
            <RunCard key={run.id} run={run} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  )
}

function NewRunCard() {
  return (
    <Link
      href="/runs/new"
      className="flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">+</span>
      <span className="font-display font-semibold">New run</span>
      <span className="text-xs text-muted-foreground">Point at a project folder</span>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="reveal reveal-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">+</div>
      <h3 className="mt-4 font-display text-xl font-bold tracking-tight">No runs yet</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Point Launch Kit at a project folder and it&apos;ll draft launch-ready posts for every platform.
      </p>
      <Link href="/runs/new" className={`${buttonVariants({ size: 'lg' })} mt-5`}>
        Start your first run →
      </Link>
    </div>
  )
}
