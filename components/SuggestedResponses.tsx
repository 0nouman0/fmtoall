'use client'

import { useState } from 'react'

interface SuggestedResponsesProps {
  suggestions: string[]
  characterColor: string
  onPickSuggestion: (text: string) => void
  onChooseOwn: () => void
  disabled?: boolean
}

export default function SuggestedResponses({
  suggestions,
  characterColor,
  onPickSuggestion,
  onChooseOwn,
  disabled,
}: SuggestedResponsesProps) {
  const [picked, setPicked] = useState<string | null>(null)

  const handlePick = (text: string) => {
    if (disabled || picked) return
    setPicked(text)
    onPickSuggestion(text)
  }

  return (
    <div className="mt-3 ml-0 space-y-2 animate-fade-in">
      {/* Label */}
      <p className="font-mono text-[9px] tracking-widest uppercase text-paper-muted opacity-60 mb-2">
        Choose how to respond ↓
      </p>

      {/* Option 1 & 2 — pre-built suggestions */}
      {suggestions.map((text, i) => {
        const isPicked = picked === text
        return (
          <button
            key={i}
            onClick={() => handlePick(text)}
            disabled={disabled || !!picked}
            className={`w-full text-left px-4 py-3 border text-sm font-body transition-all duration-200 group
              ${isPicked
                ? 'border-brass bg-brass/15 text-paper'
                : 'border-divider text-paper-muted hover:border-brass/60 hover:text-paper hover:bg-base-mid'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
            style={{
              borderLeftColor: isPicked ? characterColor : undefined,
              borderLeftWidth: isPicked ? '3px' : undefined,
            }}
          >
            <span className="flex items-start gap-2">
              {/* Icon */}
              <span className="text-[11px] opacity-50 mt-0.5 flex-shrink-0 font-mono">
                {isPicked ? '🔊' : `${i + 1}.`}
              </span>
              <span className="leading-snug">&ldquo;{text}&rdquo;</span>
              {/* Speak indicator */}
              {!isPicked && (
                <span className="ml-auto text-[9px] font-mono uppercase opacity-0 group-hover:opacity-40 flex-shrink-0 mt-0.5 transition-opacity">
                  tap to speak
                </span>
              )}
            </span>
          </button>
        )
      })}

      {/* Option 3 — type/speak own */}
      <button
        onClick={onChooseOwn}
        disabled={disabled || !!picked}
        className="w-full text-left px-4 py-2.5 border border-dashed border-divider text-paper-muted font-body text-sm hover:border-brass/40 hover:text-paper transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          <span className="text-[11px]">✍️</span>
          <span className="font-mono text-[11px] uppercase tracking-wide">Type or speak my own answer</span>
        </span>
      </button>
    </div>
  )
}
