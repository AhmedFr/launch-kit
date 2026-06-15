import type { GenerateInput } from '@/lib/types'

export function buildKitPrompt({ context, refinements }: GenerateInput): string {
  return [
    'You are an expert Product Hunt launch strategist.',
    'Return ONLY JSON matching the LaunchKit schema. No prose.',
    `Product: ${context.name}`,
    `Summary: ${context.summary}`,
    `Features: ${context.features.join('; ')}`,
    `Tech stack: ${context.techStack.join(', ')}`,
    refinements.angle ? `Angle: ${refinements.angle}` : '',
    refinements.audience ? `Audience: ${refinements.audience}` : '',
    refinements.goal ? `Goal: ${refinements.goal}` : '',
    refinements.tone ? `Tone: ${refinements.tone}` : '',
    `README excerpt:\n${context.readmeExcerpt}`,
  ].filter(Boolean).join('\n')
}
