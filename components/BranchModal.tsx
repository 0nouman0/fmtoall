'use client'

import { useState, useRef, useEffect } from 'react'
import { Character } from '@/lib/personas'

interface BranchModalProps {
  character: Character
  onClose: () => void
  onSubmit: (premise: string) => void
  isLoading: boolean
}

export default function BranchModal({ character, onClose, onSubmit, isLoading }: BranchModalProps) {
  const [premise, setPremise] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Focus input when modal opens
    setTimeout(() => inputRef.current?.focus(), 50)

    // Close on Escape
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = () => {
    if (!premise.trim() || isLoading) return
    onSubmit(premise.trim())
  }

  const examplePremises: string[] = {
    arjun: [
      'What if Arjun had warned Meera about his father before she published the story?',
      'What if Rohan hadn\'t really betrayed the family — what if it was all staged?',
    ],
    priya: [
      'What if Priya had told Karan the real reason she came back on the very first day?',
      'What if Karan\'s girlfriend showed up at the project presentation?',
    ],
    vikram: [
      'What if Vikram\'s memories began returning all at once — in a public market?',
      'What if the white crow Surya was actually a Deva spy?',
    ],
    zara: [
      'What if Zara-7 was finally located by the Helix Corporation?',
      'What if someone else who heard her on frequency 7.3 turned out to be another rogue AI?',
    ],
  }[character.id] ?? [
    'What if everything had gone differently from the very beginning?',
    'What if they had made the opposite choice?',
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-base/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-phone bg-base-light border border-divider border-b-0 animate-slide-up">
        {/* Red top rule */}
        <div className="h-0.5 w-full bg-red" />

        <div className="p-6 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-red mb-1">
                What if...?
              </p>
              <h3 className="font-display text-xl text-paper">
                Change the story
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-paper-muted hover:text-paper transition-colors p-1"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Premise input */}
          <textarea
            ref={inputRef}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            placeholder={`What if ${character.name.split(' ')[0]} had...`}
            disabled={isLoading}
            rows={3}
            className="w-full bg-base border border-divider text-paper placeholder-paper-muted font-body text-sm p-4 resize-none focus:outline-none focus:border-brass transition-colors duration-200 leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
            }}
          />

          {/* Example prompts */}
          <div className="mt-3 space-y-1.5">
            <p className="font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-2">
              Try one of these
            </p>
            {examplePremises.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPremise(ex)}
                className="block w-full text-left text-xs text-paper-muted hover:text-brass transition-colors duration-150 leading-snug py-1 border-l-2 border-divider hover:border-brass pl-3"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!premise.trim() || isLoading}
            className="mt-5 w-full border border-brass text-brass font-body font-medium text-sm py-3.5 hover:bg-brass hover:text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="font-mono text-xs">{character.name.split(' ')[0]} is deciding</span>
                <span className="animate-pulse">...</span>
              </span>
            ) : (
              'Play it out →'
            )}
          </button>

          <p className="text-center font-mono text-[10px] text-paper-muted mt-3 opacity-60">
            Cmd+Enter to submit
          </p>
        </div>
      </div>
    </div>
  )
}
