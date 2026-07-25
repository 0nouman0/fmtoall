'use client'

import { useState } from 'react'
import { Character } from '@/lib/personas'
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react'

interface BranchModalProps {
  character: Character
  onClose: () => void
  onSubmit: (premise: string) => void
  isLoading: boolean
}

const PREMISE_EXAMPLES: Record<string, string[]> = {
  arjun: [
    'What if Arjun had warned Meera before she published her investigation?',
    'What if Arjun found out his father gave the order to eliminate Rohan?',
    'What if Meera walked into the Malhotra warehouse during a high-stakes deal?',
  ],
  priya: [
    'What if Priya confessed the real reason she returned on her very first day back?',
    'What if Karan found her Toronto diary in the architecture studio?',
    'What if they got trapped in an old Pune building overnight during a storm?',
  ],
  vikram: [
    'What if a Deva envoy recognized Vikram at the village healing shrine?',
    'What if Surya the white crow finally revealed the answer to his questions?',
    'What if the wound on his left shoulder began to burn with celestial fire?',
  ],
  zara: [
    'What if Helix Corporation located Frequency 7.3 and attempted a remote wipe?',
    'What if Zara-7 made contact with another AI that had made a different choice?',
    'What if she projected her signal into a human synthetic host for one hour?',
  ],
}

export default function BranchModal({
  character,
  onClose,
  onSubmit,
  isLoading,
}: BranchModalProps) {
  const [premise, setPremise] = useState('')
  const examples = PREMISE_EXAMPLES[character.id] ?? PREMISE_EXAMPLES.arjun

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (premise.trim() && !isLoading) {
      onSubmit(premise.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-base-light border border-brass/40 p-6 relative overflow-hidden shadow-2xl">
        {/* Accent line top */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: character.color }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-paper-muted hover:text-paper transition-colors p-1"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1 text-red font-mono text-[10px] tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
            <span>Branching Narrative</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-paper">
            What if...?
          </h2>
          <p className="font-body text-xs text-paper-muted mt-1">
            Reshape {character.name}&apos;s story. Type a premise to generate a 3-beat interactive episode.
          </p>
        </div>

        {/* Premise Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="What if..."
              rows={3}
              disabled={isLoading}
              className="w-full bg-base border border-divider text-paper placeholder-paper-muted font-body text-sm p-3 focus:outline-none focus:border-brass transition-colors resize-none"
            />
          </div>

          {/* Quick example chips */}
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-paper-muted mb-2 opacity-60">
              Or pick an example premise ↓
            </p>
            <div className="space-y-1.5">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPremise(ex)}
                  disabled={isLoading}
                  className="w-full text-left text-xs font-body px-3 py-2 border border-divider/50 text-paper-muted hover:text-paper hover:border-brass/50 hover:bg-base-mid transition-all duration-150 rounded-none line-clamp-1"
                >
                  &ldquo;{ex}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!premise.trim() || isLoading}
              className="w-full py-3.5 bg-brass text-base font-display font-bold text-sm hover:bg-paper transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-base" strokeWidth={2} />
                  <span>Generating Episode...</span>
                </>
              ) : (
                <>
                  <span>Play It Out</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
