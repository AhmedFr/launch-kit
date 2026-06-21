import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SocialSections } from './SocialSections'
import type { LaunchCore, SocialContent } from '@/lib/types'

const core: LaunchCore = {
  productName: 'Acme', essence: 'Ship faster', audience: 'developers', problem: 'Shipping is slow', features: ['Fast builds'], differentiators: ['Zero config'],
}

const content: SocialContent = {
  thread: { tweets: ['Devs: shipping is slow. I built Acme.', 'It does X, Y, Z.'] },
  kolOutreach: { twitter: 'Hey {name} on X', linkedin: 'Hi {name} on LinkedIn', telegram: 'Hi {name} on Telegram' },
  ugcAsk: 'Would you share how you use Acme?',
  postingTips: { bestTimeET: '9:00 AM ET', hashtags: ['#buildinpublic'] },
}

describe('SocialSections', () => {
  it('renders the thread, all outreach channels, the UGC ask, and posting tips', () => {
    render(<SocialSections core={core} content={content} />)
    expect(screen.getByText('Launch thread')).toBeInTheDocument()
    expect(screen.getByText('It does X, Y, Z.')).toBeInTheDocument()
    expect(screen.getByText('X / Twitter')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Telegram')).toBeInTheDocument()
    expect(screen.getByText('Would you share how you use Acme?')).toBeInTheDocument()
    expect(screen.getByText('#buildinpublic')).toBeInTheDocument()
  })

  it('commits a tweet edit with the correct array path', () => {
    const onEdit = vi.fn()
    render(<SocialSections core={core} content={content} onEdit={onEdit} />)
    const tweet = screen.getByRole('textbox', { name: 'Tweet 2' })
    tweet.textContent = 'Edited second tweet'
    fireEvent.blur(tweet)
    expect(onEdit).toHaveBeenCalledWith(['thread', 'tweets', 1], 'Edited second tweet')
  })

  it('renders tweets read-only when onEdit is omitted', () => {
    render(<SocialSections core={core} content={content} />)
    expect(screen.queryByRole('textbox', { name: 'Tweet 1' })).toBeNull()
  })
})
