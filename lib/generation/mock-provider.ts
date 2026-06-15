import type { GenerateInput, LaunchKit, SectionKey } from '@/lib/types'
import type { GenerationProvider } from './provider.types'

function clamp(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…'
}

function buildKit({ context, refinements }: GenerateInput): LaunchKit {
  const name = context.name
  const audience = refinements.audience || context.audience || 'builders'
  const benefit = context.oneLiner || context.summary || 'gets the job done'
  const feat = context.features.length ? context.features : ['Does the core job well', 'Simple to start', 'Built for speed']

  return {
    copy: {
      nameSuggestions: [name, `${name} — for ${audience}`, `Get ${name}`],
      tagline: clamp(`${name}: ${benefit}`, 60),
      taglineAlternatives: [
        clamp(`The fastest way to ${benefit}`, 60),
        clamp(`${benefit}, built for ${audience}`, 60),
      ],
      description: `${context.summary || `${name} helps ${audience}.`}\n\nWhy it matters:\n` +
        feat.slice(0, 4).map((f) => `• ${f}`).join('\n') +
        `\n\nBuilt with ${context.techStack.join(', ') || 'modern tooling'}.`,
    },
    topics: ['Developer Tools', 'Productivity', 'SaaS'].slice(0, context.techStack.length ? 3 : 2),
    firstComment:
      `Hey Product Hunt! 👋 I built ${name} because ${audience} deserve a better way to ${benefit}.\n\n` +
      `Top things to try:\n${feat.slice(0, 3).map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n` +
      `I'd love your feedback — what should we build next?`,
    gallery: {
      shots: [
        { title: 'Hero / cover', purpose: 'Stop the scroll', caption: `${name} — ${benefit}`, layoutHint: 'Full-bleed product shot with the tagline overlaid' },
        { title: 'Core feature', purpose: 'Show the main value', caption: feat[0], layoutHint: 'Annotated screenshot, callout arrows on the key UI' },
        { title: 'Before / after', purpose: 'Make the benefit concrete', caption: 'From manual to instant', layoutHint: 'Split image, left = old way, right = with ' + name },
        { title: 'Social proof / stack', purpose: 'Build trust', caption: `Built with ${context.techStack.join(', ') || 'modern tools'}`, layoutHint: 'Logos or a short quote on brand-colored background' },
      ],
    },
    video: {
      hook: `Tired of the old way to ${benefit}?`,
      lengthSec: 45,
      cta: `Try ${name} free today`,
      scenes: [
        { timeRange: '0-3s', visual: 'Logo animates in on coral background', onScreenText: name },
        { timeRange: '3-12s', visual: 'Screen-record the core flow end to end', onScreenText: feat[0] ?? 'The core flow' },
        { timeRange: '12-30s', visual: 'Show 2-3 key features quickly', onScreenText: feat.slice(1, 3).join(' · ') || 'Key features' },
        { timeRange: '30-45s', visual: 'End card with URL and upvote nudge', onScreenText: `Try ${name} free today` },
      ],
    },
    launch: {
      recommendedDay: 'Tuesday',
      recommendedTimePT: '12:01 AM PT',
      prelaunchChecklist: [
        'Line up a credible hunter (or self-hunt) 1 week ahead',
        'Prepare gallery images and the demo video',
        'Draft the first comment and pin it at launch',
        'Warm up your network the day before',
      ],
      launchDayChecklist: [
        'Post at 12:01 AM PT and pin your first comment',
        'Reply to every comment within the first 2 hours',
        'Share to your channels (X, LinkedIn, Slack/Discord)',
        'Post a mid-day update with traction',
      ],
      outreach: {
        hunter: `Hi {name}, I'm launching ${name} (${benefit}) on Product Hunt and admire your eye for ${audience} tools. Would you be open to hunting it? Assets ready to go.`,
        supporters: `Hey! ${name} is live on Product Hunt today 🚀 If it looks useful, an upvote and an honest comment would mean a lot: {link}`,
      },
    },
  }
}

export class MockProvider implements GenerationProvider {
  async generateKit(input: GenerateInput): Promise<LaunchKit> {
    return buildKit(input)
  }
  // topicsComment maps to two fields (topics + firstComment); the rest map 1:1.
  async generateSection(section: SectionKey, input: GenerateInput): Promise<Partial<LaunchKit>> {
    const full = buildKit(input)
    if (section === 'topicsComment') return { topics: full.topics, firstComment: full.firstComment }
    if (section === 'copy') return { copy: full.copy }
    if (section === 'gallery') return { gallery: full.gallery }
    if (section === 'video') return { video: full.video }
    return { launch: full.launch }
  }
}
