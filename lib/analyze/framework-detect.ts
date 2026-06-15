const FRAMEWORKS: { dep: string; label: string }[] = [
  { dep: 'next', label: 'Next.js' },
  { dep: 'react', label: 'React' },
  { dep: 'vue', label: 'Vue' },
  { dep: 'svelte', label: 'Svelte' },
  { dep: 'express', label: 'Express' },
  { dep: 'fastify', label: 'Fastify' },
  { dep: '@nestjs/core', label: 'NestJS' },
  { dep: 'astro', label: 'Astro' },
]

export function detectTechStack(deps: Record<string, string>): string[] {
  const keys = Object.keys(deps ?? {})
  const labels = FRAMEWORKS.filter((f) => keys.includes(f.dep)).map((f) => f.label)
  if (keys.includes('typescript')) labels.push('TypeScript')
  return [...new Set(labels)]
}
