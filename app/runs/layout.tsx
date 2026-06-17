import { AppHeader } from '@/components/brand/AppHeader'

export default function RunsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 py-8">{children}</main>
    </>
  )
}
