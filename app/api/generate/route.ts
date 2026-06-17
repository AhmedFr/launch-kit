import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/generation'
import { PLATFORMS, type PlatformId } from '@/lib/platforms'
import type { GenerateInput, Generation, LaunchCore, PlatformContentMap } from '@/lib/types'

export const runtime = 'nodejs'

type Body = GenerateInput & { platform?: PlatformId; core?: LaunchCore }

const PLATFORM_IDS = PLATFORMS.map((p) => p.id)
const isPlatformId = (v: unknown): v is PlatformId => PLATFORM_IDS.includes(v as PlatformId)

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }
  if (!body?.context?.name) {
    return NextResponse.json({ error: 'A project context is required.' }, { status: 400 })
  }

  const provider = getProvider()
  const input: GenerateInput = { context: body.context, refinements: body.refinements ?? {} }

  try {
    // Single-platform regeneration: reuse the existing core so platforms stay consistent.
    if (body.platform) {
      if (!isPlatformId(body.platform)) {
        return NextResponse.json({ error: `Unknown platform: ${body.platform}` }, { status: 400 })
      }
      const core = body.core ?? (await provider.generateCore(input))
      const content = await provider.generatePlatform(body.platform, core, input)
      return NextResponse.json({ platform: body.platform, content })
    }

    // Full generation: distill the core once, then fan out to every platform in parallel.
    const core = await provider.generateCore(input)
    const results = await Promise.allSettled(
      PLATFORM_IDS.map((id) => provider.generatePlatform(id, core, input)),
    )

    const platforms: Partial<PlatformContentMap> = {}
    const failed: PlatformId[] = []
    results.forEach((result, i) => {
      const id = PLATFORM_IDS[i]
      if (result.status === 'fulfilled') {
        // Each id maps to its own content type; the registry guarantees the match.
        ;(platforms as Record<PlatformId, unknown>)[id] = result.value
      } else {
        failed.push(id)
        console.error(`[api/generate] ${id} failed:`, result.reason?.message ?? result.reason)
      }
    })

    if (Object.keys(platforms).length === 0) {
      const first = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined
      throw new Error(first?.reason?.message ?? 'All platform generations failed.')
    }

    const generation: Generation = { core, platforms }
    return NextResponse.json({ generation, failed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed.'
    console.error('[api/generate]', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
