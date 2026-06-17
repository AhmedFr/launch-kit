import { NextResponse } from 'next/server'
import { readFolder } from '@/lib/analyze/read-folder'

export const runtime = 'nodejs'

// This route reads the local filesystem, so it must only run on the user's own
// machine. It's allowed during local dev (or when explicitly enabled) and denied
// on hosted/production deploys, where it would otherwise read the server's files.
function localFsAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.LAUNCHKIT_ALLOW_LOCAL_FS === 'true'
}

export async function POST(req: Request) {
  if (!localFsAllowed()) {
    return NextResponse.json(
      { error: 'Launch Kit runs on your machine. Clone the repo and run it locally to analyze a folder.' },
      { status: 403 },
    )
  }

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
