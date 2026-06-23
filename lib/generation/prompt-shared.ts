import type { GenerateInput, LaunchCore } from '@/lib/types'

// The Gingiris launch-playbook principles, prepended to every system prompt so all
// generated copy is shaped by the same launch philosophy regardless of platform.
export const PLAYBOOK_PRINCIPLES = [
  'Launch principles to honor in everything you write:',
  '1. User value first — every line must earn attention by promising real value to the target user, never by hyping the maker.',
  '2. Content is king, channel is queen — the message must be strong enough to spread on its own; the platform only amplifies it.',
  '3. Global brand, local execution — keep one clear, consistent positioning while speaking natively to this specific platform and audience.',
  '4. Concentrate on real people, not vanity — favor a few high-intent, genuine asks over broad, hollow ones.',
  'Anchor claims in concrete specifics; use credible numbers only when given, and never invent metrics or lean on empty superlatives.',
  "Write like a person, not an AI. Never use an em dash (the \" — \" construction); restructure the sentence with a period, comma, colon, or parentheses instead.",
].join('\n')

// Raw product facts, used for the core distillation call.
export function renderFacts(input: GenerateInput): string {
  const { context, refinements } = input
  return [
    `Product name: ${context.name}`,
    context.oneLiner && `One-liner: ${context.oneLiner}`,
    context.summary && `Summary: ${context.summary}`,
    context.features.length && `Features: ${context.features.join('; ')}`,
    context.techStack.length && `Tech stack: ${context.techStack.join(', ')}`,
    context.differentiators?.length && `Differentiators: ${context.differentiators.join('; ')}`,
    refinements.audience && `Target audience: ${refinements.audience}`,
    refinements.angle && `Angle / hook: ${refinements.angle}`,
    refinements.goal && `Launch goal: ${refinements.goal}`,
    refinements.tone && `Tone: ${refinements.tone}`,
    context.readmeExcerpt && `README excerpt:\n${context.readmeExcerpt}`,
  ]
    .filter(Boolean)
    .join('\n')
}

// The distilled core, rendered for a platform-content call. The enrichment lines
// are emitted only when present so cores persisted before they existed still render.
export function renderCore(core: LaunchCore): string {
  return [
    `Product: ${core.productName}`,
    `Essence: ${core.essence}`,
    core.valueProp && `Value proposition: ${core.valueProp}`,
    `Audience: ${core.audience}`,
    core.icp && `Ideal customer profile: ${core.icp}`,
    `Problem solved: ${core.problem}`,
    `Features: ${core.features.join('; ')}`,
    `Differentiators: ${core.differentiators.join('; ')}`,
    core.keywords?.length && `Keywords: ${core.keywords.join(', ')}`,
  ]
    .filter(Boolean)
    .join('\n')
}

// Author-chosen refinements that shape voice; appended to every platform prompt.
export function renderRefinements(input: GenerateInput): string {
  const { refinements } = input
  return [
    refinements.tone && `Preferred tone: ${refinements.tone}`,
    refinements.goal && `Launch goal: ${refinements.goal}`,
    refinements.angle && `Angle / hook: ${refinements.angle}`,
  ]
    .filter(Boolean)
    .join('\n')
}
