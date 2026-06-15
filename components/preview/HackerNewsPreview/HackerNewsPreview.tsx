import type { PreviewProps } from '@/lib/preview/preview.types'

export function HackerNewsPreview({ kit, productName }: PreviewProps) {
  const handle = productName.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'maker'
  const domain = `${(productName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'launchkit')}.dev`
  const postBody = [kit.firstComment, kit.copy.description].filter(Boolean).join('\n\n')

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="overflow-hidden rounded-xl border border-border font-[Verdana,Geneva,sans-serif] shadow-sm">
        {/* Top bar */}
        <div className="flex items-center gap-2 bg-[#ff6600] px-2 py-1 text-[13px] text-black">
          <span className="border border-black px-1 font-bold leading-none">Y</span>
          <span className="font-bold">Hacker News</span>
          <span className="truncate text-black/90">
            new | past | comments | ask | show | jobs
          </span>
          <span className="ml-auto whitespace-nowrap text-black/90">login</span>
        </div>

        {/* Story + comment panel */}
        <div className="space-y-3 bg-[#f6f6ef] px-3 py-3">
          {/* Story row */}
          <div className="flex items-baseline gap-1 text-sm">
            <span className="text-[#828282]">1.</span>
            <span className="text-[#ff6600] leading-none" aria-hidden>
              ▲
            </span>
            <span className="text-[#000000]">
              <span className="cursor-pointer hover:underline">
                Show HN: {productName} – {kit.copy.tagline}
              </span>
              <span className="text-[#828282]"> ({domain})</span>
            </span>
          </div>

          {/* Subtext */}
          <div className="pl-4 text-xs text-[#828282]">
            287 points by {handle} 3 hours ago | hide | 64 comments
          </div>

          {/* Maker's first comment as the HN text post */}
          <div className="border-t border-[#e0e0d8] pt-3">
            <div className="text-xs text-[#828282]">{handle} 2 hours ago</div>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[#000000]">
              {postBody}
            </p>
            <div className="mt-2 flex gap-3 text-xs text-[#828282]">
              <span aria-hidden>reply</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
