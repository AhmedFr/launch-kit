import { readFile, stat, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { ProjectContext } from '@/lib/types'
import { detectTechStack } from './framework-detect'

const README_MAX = 8000

async function findReadme(dir: string): Promise<string | null> {
  const entries = await readdir(dir)
  const match = entries.find((e) => /^readme(\.md|\.markdown)?$/i.test(e))
  return match ? join(dir, match) : null
}

function extractFeatures(readme: string): string[] {
  return readme
    .split('\n')
    .map((l) => l.match(/^\s*[-*]\s+(.*)/)?.[1]?.trim())
    .filter((l): l is string => Boolean(l && l.length > 3))
    .slice(0, 8)
}

function firstParagraph(readme: string): string {
  const body = readme.replace(/^#.*$/m, '').trim()
  return body.split(/\n\s*\n/)[0]?.replace(/\n/g, ' ').trim() ?? ''
}

export async function readFolder(path: string): Promise<ProjectContext> {
  let st
  try {
    st = await stat(path)
  } catch {
    throw new Error(`Path does not exist: ${path}`)
  }
  if (!st.isDirectory()) throw new Error(`Path is not a directory: ${path}`)

  const warnings: string[] = []

  let pkg: { name?: string; description?: string; dependencies?: Record<string, string>; devDependencies?: Record<string, string> } = {}
  try {
    pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf8'))
  } catch {
    warnings.push('No package.json found — tech stack could not be detected.')
  }

  let readme = ''
  const readmePath = await findReadme(path)
  if (readmePath) {
    readme = (await readFile(readmePath, 'utf8')).slice(0, README_MAX)
  } else {
    warnings.push('No README found — generated content will be sparse. Add a README for better results.')
  }

  const name = pkg.name ?? readme.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? 'Your Product'
  const summary = firstParagraph(readme) || pkg.description || ''

  return {
    name,
    oneLiner: pkg.description ?? summary.slice(0, 80),
    summary,
    features: extractFeatures(readme),
    techStack: detectTechStack({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }),
    differentiators: [],
    links: [],
    readmeExcerpt: readme.slice(0, 2000),
    warnings,
  }
}
