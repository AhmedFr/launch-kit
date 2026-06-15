export type ProjectContext = {
  name: string
  oneLiner: string
  summary: string
  features: string[]
  techStack: string[]
  audience?: string
  problem?: string
  differentiators: string[]
  links: { label: string; url: string }[]
  readmeExcerpt: string
  warnings: string[]
}

export type Refinements = {
  angle?: string
  audience?: string
  goal?: string
  tone?: string
}

export type SectionKey = 'copy' | 'topicsComment' | 'gallery' | 'video' | 'launch'

export type ShotSpec = { title: string; purpose: string; caption: string; layoutHint: string }
export type Scene = { timeRange: string; visual: string; onScreenText: string }

export type LaunchKit = {
  copy: {
    nameSuggestions: string[]
    tagline: string
    taglineAlternatives: string[]
    description: string
  }
  topics: string[]
  firstComment: string
  gallery: { shots: ShotSpec[] }
  video: { hook: string; scenes: Scene[]; lengthSec: number; cta: string }
  launch: {
    recommendedDay: string
    recommendedTimePT: string
    prelaunchChecklist: string[]
    launchDayChecklist: string[]
    outreach: { hunter: string; supporters: string }
  }
}

export type GenerateInput = { context: ProjectContext; refinements: Refinements }
