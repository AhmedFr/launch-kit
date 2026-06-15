import type { LaunchKit } from '@/lib/types'

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

export function kitToMarkdown(kit: LaunchKit): string {
  const { copy, topics, firstComment, gallery, video, launch } = kit
  return `# Product Hunt Launch Kit

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
