'use client'

import { useState } from 'react'
import { Volume2, Edit3, CornerDownRight } from 'lucide-react'

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
      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-paper-muted opacity-60 mb-2">
        <CornerDownRight className="w-3 h-3" strokeWidth={1.5} />
        <span>Choose how to respond</span>
      </div>

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
            <span className="flex items-start gap-2.5">
              <span className="text-[11px] opacity-50 mt-0.5 flex-shrink-0 font-mono">
                {isPicked ? (
                  <Volume2 className="w-3.5 h-3.5 text-brass" strokeWidth={1.5} />
                ) : (
                  `${i + 1}.`
                )}
              </span>
              <span className="leading-snug">&ldquo;{text}&rdquo;</span>
              {!isPicked && (
                <span className="ml-auto text-[9px] font-mono uppercase opacity-0 group-hover:opacity-40 flex-shrink-0 mt-0.5 transition-opacity flex items-center gap-1">
                  <Volume2 className="w-3 h-3" strokeWidth={1.5} />
                  <span>tap to speak</span>
                </span>
              )}
            </span>
          </button>
        )
      })}

      <button
        onClick={onChooseOwn}
        disabled={disabled || !!picked}
        className="w-full text-left px-4 py-2.5 border border-dashed border-divider text-paper-muted font-body text-sm hover:border-brass/40 hover:text-paper transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          <Edit3 className="w-3.5 h-3.5 text-brass/70" strokeWidth={1.5} />
          <span className="font-mono text-[11px] uppercase tracking-wide">Type or speak my own answer</span>
        </span>
      </button>
    </div>
  )
}
