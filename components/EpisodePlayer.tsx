'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BranchTree, Beat } from '@/lib/types'
import { Character } from '@/lib/personas'
import Waveform from '@/components/Waveform'

interface EpisodePlayerProps {
  tree: BranchTree
  character: Character
  onReplay: () => void
  onTalkAgain: () => void
}

type Phase = 'narration' | 'dialogue' | 'choices' | 'ending'

export default function EpisodePlayer({ tree, character, onReplay, onTalkAgain }: EpisodePlayerProps) {
  const [currentBeatId, setCurrentBeatId] = useState('b1')
  const [phase, setPhase] = useState<Phase>('narration')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [speakingLine, setSpeakingLine] = useState(-1)
  const [isHardCutting, setIsHardCutting] = useState(false)
  const [visibleDialogue, setVisibleDialogue] = useState<number[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const currentBeat: Beat | undefined = tree.beats.find((b) => b.id === currentBeatId)

  // Map character voice to a speech synthesis voice preference
  const getVoiceConfig = useCallback(() => {
    const configs: Record<string, { rate: number; pitch: number; lang: string }> = {
      onyx:    { rate: 0.85, pitch: 0.8, lang: 'en-IN' },
      nova:    { rate: 0.95, pitch: 1.1, lang: 'en-IN' },
      echo:    { rate: 0.8,  pitch: 0.7, lang: 'en-GB' },
      shimmer: { rate: 1.0,  pitch: 1.2, lang: 'en-US' },
    }
    return configs[character.voice] ?? { rate: 0.9, pitch: 1.0, lang: 'en-US' }
  }, [character.voice])

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const config = getVoiceConfig()
    utterance.rate = config.rate
    utterance.pitch = config.pitch
    utterance.lang = config.lang
    utterance.volume = 1
    utterance.onend = () => {
      setSpeakingLine(-1)
      onEnd?.()
    }
    utterance.onerror = () => {
      setSpeakingLine(-1)
      onEnd?.()
    }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [getVoiceConfig])

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel()
    }
    setSpeakingLine(-1)
  }, [])

  // Auto-advance phases
  useEffect(() => {
    if (!currentBeat) return

    if (phase === 'narration') {
      // Show narration for a moment then start dialogue
      const timer = setTimeout(() => {
        if (currentBeat.dialogue.length > 0) {
          setPhase('dialogue')
          setDialogueIndex(0)
          setVisibleDialogue([])
        } else {
          setPhase('choices')
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, currentBeat])

  // Speak dialogue lines sequentially
  useEffect(() => {
    if (!currentBeat || phase !== 'dialogue') return

    const line = currentBeat.dialogue[dialogueIndex]
    if (!line) {
      // All dialogue done — show choices
      setTimeout(() => setPhase('choices'), 600)
      return
    }

    setVisibleDialogue((prev) => [...prev, dialogueIndex])
    setSpeakingLine(dialogueIndex)
    speakText(line.line, () => {
      setTimeout(() => {
        if (dialogueIndex + 1 < currentBeat.dialogue.length) {
          setDialogueIndex((i) => i + 1)
        } else {
          setTimeout(() => setPhase('choices'), 400)
        }
      }, 300)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogueIndex, phase, currentBeat?.id])

  const handleChoice = (nextId: string) => {
    stopSpeech()
    setIsHardCutting(true)
    setTimeout(() => {
      const nextBeat = tree.beats.find((b) => b.id === nextId)
      if (!nextBeat) return
      setCurrentBeatId(nextId)
      setPhase('narration')
      setDialogueIndex(0)
      setVisibleDialogue([])
      setSpeakingLine(-1)
      setIsHardCutting(false)
    }, 150)
  }

  const handleFinalBeat = () => {
    if (currentBeat && currentBeat.choices.length === 0 && phase === 'choices') {
      setPhase('ending')
    }
  }

  useEffect(() => {
    if (phase === 'choices' && currentBeat?.choices.length === 0) {
      const timer = setTimeout(handleFinalBeat, 800)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentBeat])

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  if (!currentBeat) return null

  if (phase === 'ending') {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="w-full max-w-phone text-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-brass mb-4">End of episode</p>
          <h2 className="font-display text-3xl text-paper mb-2 italic">{tree.title}</h2>
          <div className="w-12 h-0.5 bg-divider mx-auto my-6" />
          <p className="font-body text-sm text-paper-muted mb-10">
            Every choice shapes the story differently.
          </p>
          <div className="space-y-4">
            <button
              onClick={onReplay}
              className="block w-full text-center font-body text-sm text-brass underline underline-offset-4 hover:text-paper transition-colors py-2"
            >
              Replay with a different choice
            </button>
            <button
              onClick={onTalkAgain}
              className="block w-full text-center font-body text-sm text-brass underline underline-offset-4 hover:text-paper transition-colors py-2"
            >
              Talk to {character.name.split(' ')[0]} again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-base flex flex-col ${isHardCutting ? 'opacity-0' : 'opacity-100'} transition-none`}
      style={{ transition: isHardCutting ? 'none' : undefined }}
    >
      {isHardCutting && <div className="fixed inset-0 bg-base z-50" />}

      {/* Episode header */}
      <div className="px-6 pt-6 pb-4 border-b border-divider">
        <p className="font-mono text-[9px] tracking-widest uppercase text-paper-muted mb-0.5">
          {character.series}
        </p>
        <h3 className="font-display text-lg text-paper">{tree.title}</h3>
        <p className="font-mono text-[10px] text-divider mt-1 tracking-wider uppercase">
          beat {tree.beats.findIndex((b) => b.id === currentBeatId) + 1} of {tree.beats.filter(b => !b.id.startsWith('b2') || b.id === currentBeatId || (currentBeatId === 'b1')).length}
        </p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6 animate-beat-in">
        {/* Narration */}
        <div className="animate-fade-in">
          <p className="font-body text-base text-paper-muted italic leading-relaxed">
            {currentBeat.narration}
          </p>
        </div>

        {/* Dialogue lines */}
        {currentBeat.dialogue.length > 0 && phase !== 'narration' && (
          <div className="space-y-4">
            {currentBeat.dialogue.map((line, i) => (
              visibleDialogue.includes(i) && (
                <div
                  key={i}
                  className="animate-fade-in"
                >
                  {/* Speaker label */}
                  <p className="font-mono text-[10px] tracking-widest uppercase text-brass mb-1.5 flex items-center gap-2">
                    {line.speaker}
                    {speakingLine === i && <Waveform playing={true} bars={5} />}
                  </p>
                  {/* Dialogue line */}
                  <p
                    className="font-body text-paper text-base leading-relaxed pl-3 border-l-2 transition-colors duration-300"
                    style={{
                      borderColor: speakingLine === i ? '#B8862B' : '#3D3A35',
                    }}
                  >
                    &ldquo;{line.line}&rdquo;
                  </p>
                </div>
              )
            ))}
          </div>
        )}

        {/* Choices */}
        {phase === 'choices' && currentBeat.choices.length > 0 && (
          <div className="space-y-3 pt-2 animate-slide-up">
            <p className="font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-3">
              What happens next?
            </p>
            {currentBeat.choices.map((choice) => (
              <button
                key={choice.next}
                onClick={() => handleChoice(choice.next)}
                className="w-full border border-brass text-paper font-body text-sm py-4 px-5 text-left hover:bg-brass/10 hover:text-white transition-all duration-200 group"
              >
                <span className="flex items-center justify-between">
                  <span>{choice.text}</span>
                  <span className="text-brass opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">→</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
