import { NextResponse } from 'next/server'
import { readFolder } from '@/lib/analyze/read-folder'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { path?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }
  const path = body.path?.trim()
  if (!path) return NextResponse.json({ error: 'A folder path is required.' }, { status: 400 })

  try {
    const context = await readFolder(path)
    return NextResponse.json({ context })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read folder.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
