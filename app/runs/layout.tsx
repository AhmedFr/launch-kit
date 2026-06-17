import { AppHeader } from '@/components/brand/AppHeader'
import { RuntimeConfigProvider } from '@/lib/config/RuntimeConfigProvider'
import { getRuntimeConfig } from '@/lib/config/runtime-config'

// Read generation/runtime status per request (not baked at build time) so the
// badges and disabled states reflect the env the app is actually running with.
export const dynamic = 'force-dynamic'

export default function RunsLayout({ children }: { children: React.ReactNode }) {
  const config = getRuntimeConfig()
  return (
    <RuntimeConfigProvider value={config}>
      <AppHeader />
      <main className="flex-1 py-8">{children}</main>
    </RuntimeConfigProvider>
  )
}
