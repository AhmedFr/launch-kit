import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/generation'
import type { GenerateInput, SectionKey } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: GenerateInput & { section?: SectionKey }
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
    if (body.section) {
      const patch = await provider.generateSection(body.section, input)
      return NextResponse.json({ patch })
    }
    const kit = await provider.generateKit(input)
    return NextResponse.json({ kit })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed.'
    console.error('[api/generate]', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
