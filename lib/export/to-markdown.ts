import type {
  AppSumoContent,
  HackerNewsContent,
  LaunchCore,
  PlatformContent,
  ProductHuntContent,
  RedditContent,
} from '@/lib/types'
import type { PlatformId } from '@/lib/platforms'

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

function productHuntMarkdown(core: LaunchCore, kit: ProductHuntContent): string {
  const { copy, topics, firstComment, gallery, video, launch } = kit
  return `# ${core.productName} — Product Hunt Launch Kit

## Name & Tagline
**Tagline:** ${copy.tagline}

Name ideas: ${copy.nameSuggestions.join(', ')}
Tagline alternatives:
${bullets(copy.taglineAlternatives)}

## Description
${copy.description}

## Topics
${bullets(topics)}

## First Comment
${firstComment}

## Gallery
${gallery.shots.map((s, i) => `${i + 1}. **${s.title}** — ${s.purpose}\n   - Caption: ${s.caption}\n   - Layout: ${s.layoutHint}`).join('\n')}

## Demo Video
**Hook:** ${video.hook}  ·  **Length:** ${video.lengthSec}s  ·  **CTA:** ${video.cta}

${video.scenes.map((s) => `- \`${s.timeRange}\` — ${s.visual} _(on-screen: ${s.onScreenText})_`).join('\n')}

## Launch Ops
**Best time:** ${launch.recommendedDay}, ${launch.recommendedTimePT}

### Pre-launch
${bullets(launch.prelaunchChecklist)}

### Launch day
${bullets(launch.launchDayChecklist)}

### Outreach — Hunter
${launch.outreach.hunter}

### Outreach — Supporters
${launch.outreach.supporters}
`
}

function hackerNewsMarkdown(core: LaunchCore, hn: HackerNewsContent): string {
  return `# ${core.productName} — Hacker News (Show HN)

## Title
${hn.title}

## Post
${hn.postBody}

## First Comment
${hn.firstComment}

## Posting Tips
**Best time:** ${hn.postingTips.bestTimeET}

Avoid:
${bullets(hn.postingTips.avoid)}
`
}

function redditMarkdown(core: LaunchCore, reddit: RedditContent): string {
  return `# ${core.productName} — Reddit Launch Post

## Subreddits
${reddit.subreddits.map((s) => `- **${s.name}** — ${s.why}`).join('\n')}

## Title
${reddit.title}

## Body
${reddit.body}

## Reply Etiquette
${bullets(reddit.replyEtiquette)}
`
}

function appSumoMarkdown(core: LaunchCore, deal: AppSumoContent): string {
  return `# ${core.productName} — AppSumo Lifetime Deal

## Headline
${deal.dealHeadline}

## Pitch
${deal.pitch}

## What's Included
${bullets(deal.whatsIncluded)}

## Best For
${bullets(deal.bestFor)}

## FAQ
${deal.faq.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}
`
}

export function platformToMarkdown(platform: PlatformId, core: LaunchCore, content: PlatformContent): string {
  switch (platform) {
    case 'product-hunt':
      return productHuntMarkdown(core, content as ProductHuntContent)
    case 'hacker-news':
      return hackerNewsMarkdown(core, content as HackerNewsContent)
    case 'reddit':
      return redditMarkdown(core, content as RedditContent)
    case 'appsumo':
      return appSumoMarkdown(core, content as AppSumoContent)
  }
}
