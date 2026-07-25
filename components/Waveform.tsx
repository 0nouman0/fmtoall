'use client'

interface WaveformProps {
  playing: boolean
  className?: string
  bars?: number
}

export default function Waveform({ playing, className = '', bars = 7 }: WaveformProps) {
  return (
    <span
      className={`inline-flex items-end gap-[2px] h-4 ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Varied heights for natural waveform look
        const heights = [8, 12, 16, 14, 10, 14, 8]
        const h = heights[i % heights.length]
        return (
          <span
            key={i}
            className="waveform-bar"
            style={{
              height: `${h}px`,
              animation: playing
                ? `waveform ${0.4 + (i % 3) * 0.15}s ease-in-out ${i * 60}ms infinite alternate`
                : 'none',
              transform: playing ? undefined : 'scaleY(0.15)',
              opacity: playing ? 1 : 0.3,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          />
        )
      })}
    </span>
  )
}
