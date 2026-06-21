import type {
  AppSumoContent,
  GenerateInput,
  HackerNewsContent,
  LaunchCore,
  LaunchPlan,
  PlatformContent,
  ProductHuntContent,
  RedditContent,
  SocialContent,
} from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'
import type { GenerationProvider } from './provider.types'

function clamp(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…'
}

function buildCore({ context, refinements }: GenerateInput): LaunchCore {
  const audience = refinements.audience || context.audience || 'builders'
  const essence = context.oneLiner || context.summary || `${context.name} gets the job done`
  const keywords = Array.from(
    new Set([...context.techStack, ...context.features.map((f) => f.toLowerCase())]),
  ).slice(0, 8)
  return {
    productName: context.name,
    essence,
    audience,
    problem: context.problem || `${audience} waste time on a slow, manual process`,
    features: context.features.length ? context.features : ['Does the core job well', 'Simple to start', 'Built for speed'],
    differentiators: context.differentiators.length ? context.differentiators : ['Faster than the manual way', 'No setup required'],
    valueProp: essence,
    icp: refinements.audience || context.audience || `${audience} who want results without the busywork`,
    keywords: keywords.length ? keywords : [context.name.toLowerCase(), 'productivity', 'tool'],
  }
}

function buildProductHunt(core: LaunchCore): ProductHuntContent {
  const { productName: name, audience, essence: benefit, features: feat } = core
  return {
    copy: {
      nameSuggestions: [name, `${name} — for ${audience}`, `Get ${name}`],
      tagline: clamp(`${name}: ${benefit}`, 60),
      taglineAlternatives: [clamp(`The fastest way to ${benefit}`, 60), clamp(`${benefit}, built for ${audience}`, 60)],
      description:
        `${benefit}\n\nWhy it matters:\n` +
        feat.slice(0, 4).map((f) => `• ${f}`).join('\n') +
        `\n\nBuilt for ${audience}.`,
    },
    topics: ['Developer Tools', 'Productivity', 'SaaS'],
    firstComment:
      `Hey Product Hunt! 👋 I built ${name} because ${audience} deserve a better way.\n\n` +
      `Top things to try:\n${feat.slice(0, 3).map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n` +
      `I'd love your feedback — what should we build next?`,
    gallery: {
      shots: [
        { title: 'Hero / cover', purpose: 'Stop the scroll', caption: `${name} — ${benefit}`, layoutHint: 'Full-bleed product shot with the tagline overlaid' },
        { title: 'Core feature', purpose: 'Show the main value', caption: feat[0], layoutHint: 'Annotated screenshot, callout arrows on the key UI' },
        { title: 'Before / after', purpose: 'Make the benefit concrete', caption: 'From manual to instant', layoutHint: `Split image, left = old way, right = with ${name}` },
        { title: 'Social proof', purpose: 'Build trust', caption: `Loved by ${audience}`, layoutHint: 'A short quote on a brand-colored background' },
      ],
    },
    video: {
      hook: `Tired of the old way, ${audience}?`,
      lengthSec: 45,
      cta: `Try ${name} free today`,
      scenes: [
        { timeRange: '0-3s', visual: 'Logo animates in on brand background', onScreenText: name },
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
      hourByHour: [
        { timePT: '12:01 AM PT', action: 'Go live and pin your first comment' },
        { timePT: '12:05–2:00 AM PT', action: 'Message your first cohort of genuine supporters to take a look' },
        { timePT: '6:00–9:00 AM PT', action: 'US wakes up — reply to every comment within minutes' },
        { timePT: '9:00 AM–12:00 PM PT', action: 'Share to X, LinkedIn and your communities with the live link' },
        { timePT: '12:00–2:00 PM PT', action: 'Post a mid-day traction update to re-engage early supporters' },
        { timePT: '2:00–6:00 PM PT', action: 'Keep answering comments; thank everyone who upvoted or shared' },
        { timePT: '6:00–9:00 PM PT', action: 'Final push to fence-sitters; ask for honest comments, not just upvotes' },
        { timePT: '9:00–11:59 PM PT', action: 'Last-call message and a thank-you to the community' },
      ],
      momentumTactics: [
        'Stagger outreach to real supporters across the day so engagement stays steady, not front-loaded',
        'Ask for an honest comment plus an upvote — comments weigh on ranking and credibility',
        'Reply fast and personally; an active maker thread pulls more visitors in',
        'Never buy or trade votes — Product Hunt detects it and it tanks ranking',
      ],
      commentModeration: [
        'Triage every comment within minutes for the first 6 hours',
        'Answer hard questions directly and publicly — defensiveness reads worse than a flaw',
        'Thank supporters by name; turn praise into a follow-up question to keep the thread alive',
        'Pin the most useful exchange so newcomers see the product in use',
      ],
      outreach: {
        hunter: `Hi {name}, I'm launching ${name} (${benefit}) on Product Hunt and admire your eye for ${audience} tools. Would you be open to hunting it? Assets ready to go.`,
        supporters: `Hey! ${name} is live on Product Hunt today 🚀 If it looks useful, an upvote and an honest comment would mean a lot: {link}`,
      },
    },
  }
}

function buildHackerNews(core: LaunchCore): HackerNewsContent {
  const { productName: name, audience, essence, problem, features: feat, differentiators } = core
  return {
    title: clamp(`Show HN: ${name} – ${essence}`, 80),
    postBody:
      `I built ${name} to help ${audience}. ${problem}\n\n` +
      `What it does: ${essence}\n\n` +
      `How it works:\n${feat.slice(0, 3).map((f) => `- ${f}`).join('\n')}\n\n` +
      `It's still early and I'd value technical feedback.`,
    firstComment:
      `Some context on the build: ${differentiators[0] ?? 'I focused on keeping it simple'}. ` +
      `Happy to go deeper on the architecture — what would you want to see next?`,
    postingTips: {
      bestTimeET: '8:00–10:00 AM ET, Tuesday–Thursday',
      avoid: ['Marketing language or superlatives', 'Emoji and exclamation marks', 'Vague claims without specifics', 'Asking directly for upvotes'],
      etiquette: [
        'Answer technical critique directly and without defensiveness',
        'Be candid about trade-offs and what is still rough',
        'Reply in the first person as the maker, with specifics',
        'Let the work speak — never ask for upvotes',
      ],
    },
  }
}

function buildReddit(core: LaunchCore): RedditContent {
  const { productName: name, audience, essence, problem, features: feat } = core
  return {
    subreddits: [
      { name: 'r/SideProject', why: 'makers share and get feedback on early projects', rulesNote: 'Sharing is welcome; still lead with what you learned, not a pitch' },
      { name: 'r/startups', why: 'founders discuss building and launching', rulesNote: 'Self-promo is restricted to specific threads — check the rules before posting' },
      { name: 'r/Entrepreneur', why: 'a broad audience open to useful tools, if you lead with value', rulesNote: 'Heavy self-promo filter; comment and contribute before linking' },
    ],
    title: `I built ${name} to help ${audience} — ${essence}`,
    body:
      `${problem}\n\nSo I built ${name}. ${essence}\n\n` +
      `What it does:\n${feat.slice(0, 3).map((f) => `- ${f}`).join('\n')}\n\n` +
      `Full disclosure: I'm the maker. Honest feedback (including "this already exists") is welcome.`,
    replyEtiquette: [
      'Reply to every comment, especially the critical ones',
      "Disclose you're the maker upfront",
      "Don't drop links until asked, or only where the sub's rules allow",
      'Give value in comments before promoting',
    ],
    postingTiming: 'Weekday mornings (8–10 AM ET) when these subs are most active; avoid weekends',
  }
}

function buildAppSumo(core: LaunchCore): AppSumoContent {
  const { productName: name, audience, essence, problem, features: feat } = core
  return {
    dealHeadline: `Lifetime access to ${name}`,
    pitch:
      `${essence}\n\n` +
      `Pay once, own it forever — no monthly fees. Built for ${audience} who are tired of ${problem}.`,
    whatsIncluded: [...feat.slice(0, 5), 'Lifetime updates', 'All future features'],
    bestFor: [audience, 'Bootstrapped founders', 'Agencies and freelancers'],
    faq: [
      { q: 'Is this really a one-time payment?', a: 'Yes — pay once and use it for life, including future updates.' },
      { q: `Who is ${name} best for?`, a: `${audience} who want a simpler, faster way to get the job done.` },
      { q: 'Is there a refund policy?', a: 'Yes — AppSumo offers a 60-day money-back guarantee, no questions asked.' },
    ],
  }
}

function buildSocial(core: LaunchCore): SocialContent {
  const { productName: name, audience, essence, problem, features: feat, keywords } = core
  const tags = (keywords?.length ? keywords : ['buildinpublic', 'indiehackers']).slice(0, 3).map((k) => `#${k.replace(/[^a-zA-Z0-9]/g, '')}`)
  return {
    thread: {
      tweets: [
        `${audience}: ${problem} I got tired of it, so I built ${name}. 🧵`,
        `${name} ${essence.charAt(0).toLowerCase()}${essence.slice(1)}`,
        `What it does:\n${feat.slice(0, 3).map((f) => `→ ${f}`).join('\n')}`,
        `I built it because the existing tools didn't fit how ${audience} actually work.`,
        `It's live today and free to try. If you've felt this pain, I'd love your honest take. 👇`,
      ],
    },
    kolOutreach: {
      twitter: `Hey {name} — love how you cover tools for ${audience}. I just launched ${name} (${essence}). Thought it might resonate with your audience — happy to send free access if you want to take a look, no strings.`,
      linkedin: `Hi {name}, I follow your posts on ${audience} workflows. I just shipped ${name} — ${essence}. Would you be open to a quick look? I'd value your perspective and can share full access.`,
      telegram: `Hi {name}! Big fan of your community for ${audience}. I just launched ${name} (${essence}). Would it be okay to share it with the group, or get your take first?`,
    },
    ugcAsk: `Hey! Thanks for being an early ${name} user. If it's saved you time, would you be up for a short post or 30-sec clip on how you use it? Happy to feature you and send some perks — real stories from ${audience} help far more than any ad.`,
    postingTips: {
      bestTimeET: '9:00–11:00 AM ET, Tuesday–Thursday',
      hashtags: tags,
    },
  }
}

function buildPlan(core: LaunchCore): LaunchPlan {
  const { productName: name, audience, keywords } = core
  const kw = (keywords?.length ? keywords : [name.toLowerCase()]).slice(0, 3).join(', ')
  return {
    phases: [
      { window: 'L-6 weeks', goal: 'Lock strategy', tasks: [`Define the ICP and value prop for ${audience}`, `Pick target keywords (${kw}) and a launch goal`, 'Set the budget for the few high-value channels'] },
      { window: 'L-5 to L-4 weeks', goal: 'Build assets', tasks: ['Polish the landing page and demo video', `Write the core story for ${name}`, 'Prepare gallery shots and the feature clip'] },
      { window: 'L-4 to L-3 weeks', goal: 'Lock partnerships', tasks: ['Shortlist and reach out to relevant KOLs', 'Recruit a handful of early UGC creators', 'Line up a credible Product Hunt hunter'] },
      { window: 'L-3 to L-2 weeks', goal: 'Prepare content', tasks: ['Draft the PH, HN, Reddit and X copy', 'Brief KOLs with a content pack', 'Map which subreddits and communities to seed'] },
      { window: 'L-2 to L-1 weeks', goal: 'Final confirmation', tasks: ['Confirm all drafts and the hunter', 'Lock the launch date and time', 'Warm up your network'] },
      { window: 'Launch week (Day 1-5)', goal: 'Execute', tasks: ['Run the Product Hunt day plan', 'Publish the X thread and trigger KOL posts', 'Seed Reddit/HN where you are a real member'] },
      { window: 'L+1 to L+4 weeks', goal: 'Build momentum', tasks: ['Convert early users into UGC', 'Capture backlinks and press', 'Publish follow-up content on traction'] },
    ],
    countdown30: [
      'Finalize positioning and the launch goal',
      'Build the landing page and demo video',
      'Start KOL and hunter outreach',
      `Set up analytics and configure IndexNow for ${kw}`,
    ],
    countdown7: [
      'Confirm hunter and KOL commitments',
      'Schedule the launch-day comms',
      'Pre-write first comments and the X thread',
      'Warm up your network with a teaser',
    ],
    countdown48h: [
      'Final QA of the product and signup flow',
      'Pin assets and double-check links',
      'Brief supporters on timing (12:01 AM PT)',
      'Rest — launch day is long',
    ],
    seoGeo: [
      `Publish a launch blog post targeting "${kw}"`,
      'Configure IndexNow so new pages hit Bing/AI search in seconds',
      'Add Product/SoftwareApplication schema markup to the site',
      'Capture backlinks from the launch (PH, directories, press)',
      'Structure pages with clear Q&A so AI search engines cite you',
    ],
    momentum: [
      'Day 1-7: thank everyone, reply to all feedback, ship a quick win',
      'Day 7: post a "what we learned" recap with metrics',
      'Day 14: publish UGC and case studies from early users',
      'Day 30: roundup post and outreach to newsletters/press',
    ],
  }
}

export class MockProvider implements GenerationProvider {
  async generateCore(input: GenerateInput): Promise<LaunchCore> {
    return buildCore(input)
  }

  async generatePlatform(platform: PlatformId, core: LaunchCore, _input?: GenerateInput): Promise<PlatformContent> {
    void _input
    switch (platform) {
      case 'product-hunt':
        return buildProductHunt(core)
      case 'hacker-news':
        return buildHackerNews(core)
      case 'reddit':
        return buildReddit(core)
      case 'appsumo':
        return buildAppSumo(core)
      case 'social':
        return buildSocial(core)
    }
  }

  async generatePlan(core: LaunchCore, _input?: GenerateInput): Promise<LaunchPlan> {
    void _input
    return buildPlan(core)
  }
}
