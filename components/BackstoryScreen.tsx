'use client'

import { useState, useEffect, useRef } from 'react'
import { Character } from '@/lib/personas'
import { getAudioEngine, AudioTheme } from '@/lib/audioEngine'
import { ArrowLeft, Volume2, ArrowRight, Play } from 'lucide-react'

interface BackstoryScreenProps {
  character: Character & {
    audioTheme: string
    backstory_narrative: string
    backstory_chapters: { label: string; icon: string; text: string }[]
  }
  onEnter: () => void
}

export default function BackstoryScreen({ character, onEnter }: BackstoryScreenProps) {
  const [revealedChapters, setRevealedChapters] = useState<number[]>([])
  const [showNarrative, setShowNarrative] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const [activeChapter, setActiveChapter] = useState<number | null>(null)
  const [audioStarted, setAudioStarted] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 200)
    const t2 = setTimeout(() => setShowNarrative(true), 700)

    character.backstory_chapters.forEach((_, i) => {
      setTimeout(() => {
        setRevealedChapters((prev) => [...prev, i])
      }, 1200 + i * 350)
    })

    const total = 1200 + character.backstory_chapters.length * 350 + 500
    const t3 = setTimeout(() => setShowEnter(true), total)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [character.backstory_chapters])

  const startAudio = async () => {
    if (audioStarted) return
    setAudioStarted(true)
    try {
      const engine = getAudioEngine()
      await engine.play(character.audioTheme as AudioTheme, 2.5)
    } catch (e) {
      console.warn('Audio start failed:', e)
    }
  }

  const speakChapter = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.88
    utterance.pitch = 1.0
    utterance.volume = 1
    setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    utteranceRef.current = utterance

    const engine = getAudioEngine()
    engine.setVolume(0.3, 400)
    window.speechSynthesis.speak(utterance)

    utterance.onend = () => {
      setIsSpeaking(false)
      engine.setVolume(1, 800)
    }
  }

  const handleChapterClick = async (index: number, text: string) => {
    await startAudio()
    setActiveChapter(index === activeChapter ? null : index)
    speakChapter(text)
  }

  const handleEnter = async () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel()
    }
    await startAudio()
    onEnter()
  }

  return (
    <div className="min-h-screen bg-base flex flex-col relative overflow-hidden">
      {/* Atmospheric gradient backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${character.color}60, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-phone mx-auto w-full px-6 py-8 flex flex-col min-h-screen">
        {/* Back button */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-paper-muted hover:text-brass transition-colors"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
            <span>All Characters</span>
          </a>
        </div>

        {/* Character title */}
        <div
          className={`mb-2 transition-all duration-700 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
            style={{ color: character.color }}>
            {character.genre} · {character.series}
          </p>
          <h1 className="font-display text-4xl font-bold text-paper leading-tight">
            {character.name}
          </h1>
          <div className="w-10 h-px mt-3 mb-1" style={{ backgroundColor: character.color }} />
          <p className="font-body text-sm text-brass italic">{character.hook}</p>
        </div>

        {/* Narrative paragraph */}
        <div
          className={`mt-4 mb-6 transition-all duration-700 ${showNarrative ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-body text-sm text-paper-muted leading-relaxed border-l-2 border-divider pl-4">
            {character.backstory_narrative}
          </p>
        </div>

        {/* Chapters instruction */}
        {revealedChapters.length > 0 && (
          <p className="font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-3 flex items-center gap-2">
            <span>Tap a chapter to hear it</span>
            {isSpeaking && (
              <span className="inline-flex gap-0.5 items-end h-3">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="waveform-bar"
                    style={{
                      height: `${8 + (i % 3) * 4}px`,
                      animation: `waveform ${0.4 + i * 0.1}s ease-in-out ${i * 60}ms infinite alternate`,
                    }}
                  />
                ))}
              </span>
            )}
          </p>
        )}

        {/* Backstory chapters */}
        <div className="space-y-2 flex-1">
          {character.backstory_chapters.map((chapter, i) => {
            const isRevealed = revealedChapters.includes(i)
            const isActive = activeChapter === i

            return (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isRevealed) handleChapterClick(i, chapter.text)
                }}
                disabled={!isRevealed}
                className={`w-full text-left border transition-all duration-400 overflow-hidden group
                  ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                  ${isActive
                    ? 'border-brass bg-brass/10'
                    : 'border-divider bg-base-light hover:border-brass/50 hover:bg-base-mid'
                  }
                `}
                style={{
                  transitionDelay: isRevealed ? '0ms' : `${i * 50}ms`,
                  borderLeftColor: isActive ? character.color : undefined,
                  borderLeftWidth: isActive ? '3px' : undefined,
                }}
              >
                <div className="px-4 py-3 flex items-start gap-3">
                  <span className="text-base mt-0.5 flex-shrink-0">{chapter.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1"
                      style={{ color: isActive ? character.color : '#A09880' }}>
                      {chapter.label}
                    </p>
                    <p className={`font-body text-sm leading-relaxed transition-colors duration-200 ${
                      isActive ? 'text-paper' : 'text-paper-muted'
                    }`}>
                      {chapter.text}
                    </p>
                  </div>
                  {/* Speaker icon */}
                  <Volume2 className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-opacity duration-200 ${
                    isActive && isSpeaking ? 'opacity-100 text-brass' : 'opacity-0 group-hover:opacity-40'
                  }`} strokeWidth={1.5} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Enter CTA */}
        <div
          className={`mt-8 pb-6 transition-all duration-700 ${
            showEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={handleEnter}
            className="w-full py-4 font-display text-lg font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ backgroundColor: character.color }}
          >
            <span>Step Inside</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </button>
          <p className="text-center font-mono text-[10px] text-paper-muted mt-3 opacity-40 tracking-wider uppercase">
            Music & voice will continue in chat
          </p>
        </div>
      </div>
    </div>
  )
}
