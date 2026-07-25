'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BranchTree, Beat } from '@/lib/types'
import { Character } from '@/lib/personas'
import Waveform from './Waveform'
import { RotateCcw, MessageSquare, ArrowRight, Play, Volume2, GitBranch } from 'lucide-react'

interface EpisodePlayerProps {
  tree: BranchTree
  character: Character
  onReplay: () => void
  onTalkAgain: () => void
}

export default function EpisodePlayer({
  tree,
  character,
  onReplay,
  onTalkAgain,
}: EpisodePlayerProps) {
  const [currentBeatId, setCurrentBeatId] = useState<string>(tree.beats[0]?.id ?? 'b1')
  const [isHardCut, setIsHardCut] = useState(false)
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number>(-1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [episodeEnded, setEpisodeEnded] = useState(false)
  const [showNodeMap, setShowNodeMap] = useState(false)
  const dialogueTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const currentBeat: Beat | undefined = tree.beats.find((b) => b.id === currentBeatId)

  // Voice narration & dialogue
  const speakLine = useCallback((text: string, voiceType: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    if (voiceType === 'narration') {
      utterance.rate = 0.85
      utterance.pitch = 0.9
    } else {
      utterance.rate = 0.88
      utterance.pitch = 1.05
    }
    utterance.volume = 1

    setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      onEnd?.()
    }
    window.speechSynthesis.speak(utterance)
  }, [])

  // Auto-play dialogue sequence when beat changes
  useEffect(() => {
    if (!currentBeat) return

    dialogueTimersRef.current.forEach(clearTimeout)
    dialogueTimersRef.current = []
    setActiveDialogueIndex(-1)

    speakLine(currentBeat.narration, 'narration', () => {
      if (currentBeat.dialogue && currentBeat.dialogue.length > 0) {
        let delay = 0
        currentBeat.dialogue.forEach((d, i) => {
          const t = setTimeout(() => {
            setActiveDialogueIndex(i)
            speakLine(d.line, 'character')
          }, delay)
          dialogueTimersRef.current.push(t)
          delay += Math.max(d.line.length * 60, 2500)
        })
      }
    })

    if (!currentBeat.choices || currentBeat.choices.length === 0) {
      const totalDelay = Math.max(
        (currentBeat.narration.length * 60) +
        ((currentBeat.dialogue?.length ?? 0) * 3000),
        4000
      )
      const endTimer = setTimeout(() => setEpisodeEnded(true), totalDelay)
      dialogueTimersRef.current.push(endTimer)
    }

    return () => {
      dialogueTimersRef.current.forEach(clearTimeout)
      window.speechSynthesis?.cancel()
    }
  }, [currentBeatId, currentBeat, speakLine])

  const handleChoice = (nextBeatId: string) => {
    window.speechSynthesis?.cancel()
    setIsHardCut(true)
    setTimeout(() => {
      setCurrentBeatId(nextBeatId)
      setIsHardCut(false)
    }, 150)
  }

  if (!currentBeat) return null

  return (
    <div className={`flex flex-col min-h-screen bg-base max-w-phone mx-auto transition-opacity ${isHardCut ? 'hard-cut' : ''}`}>
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ backgroundColor: character.color }} />

      {/* Header */}
      <header className="px-5 py-3 border-b border-divider flex items-center justify-between">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-red font-medium flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Branching Episode</span>
          </span>
          <h2 className="font-display text-base text-paper leading-tight">{tree.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNodeMap(!showNodeMap)}
            className={`px-2 py-1 border font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all ${
              showNodeMap
                ? 'border-brass text-brass bg-brass/10'
                : 'border-divider text-paper-muted hover:border-brass/40 hover:text-paper'
            }`}
            title="Toggle Story Node Map"
          >
            <GitBranch className="w-3 h-3" strokeWidth={1.5} />
            <span>Tree</span>
          </button>
          {isSpeaking && <Waveform playing={true} bars={5} />}
        </div>
      </header>

      {/* Node Map Collapsible Visualizer (As shown in Phase 3 illustration) */}
      {showNodeMap && (
        <div className="bg-base-light border-b border-divider p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-brass flex items-center gap-1">
              <GitBranch className="w-3 h-3" strokeWidth={1.5} />
              <span>Story Node Map</span>
            </span>
            <span className="font-mono text-[9px] text-paper-muted opacity-60">Active: {currentBeatId}</span>
          </div>

          <div className="flex flex-col items-center space-y-2 py-2 bg-base border border-divider/60">
            {/* Root Node b1 */}
            <button
              onClick={() => handleChoice('b1')}
              className={`px-3 py-1 font-mono text-[10px] border transition-all ${
                currentBeatId === 'b1'
                  ? 'bg-brass text-base font-bold border-brass shadow-sm'
                  : 'bg-base-light text-paper-muted border-divider hover:border-brass/40'
              }`}
            >
              b1 (Start)
            </button>

            <div className="w-px h-2.5 bg-brass/50" />

            {/* Middle Branch Level */}
            <div className="flex items-center gap-3">
              {tree.beats.filter((b) => b.id.startsWith('b2')).map((b2) => (
                <button
                  key={b2.id}
                  onClick={() => handleChoice(b2.id)}
                  className={`px-2.5 py-0.5 font-mono text-[9px] border transition-all ${
                    currentBeatId === b2.id
                      ? 'bg-brass text-base font-bold border-brass'
                      : 'bg-base-light text-paper-muted border-divider hover:border-brass/40'
                  }`}
                >
                  {b2.id}
                </button>
              ))}
            </div>

            <div className="w-px h-2.5 bg-divider" />

            {/* End Level */}
            {tree.beats.filter((b) => b.id === 'b3' || b.id.startsWith('b3')).map((b3) => (
              <button
                key={b3.id}
                onClick={() => handleChoice(b3.id)}
                className={`px-3 py-0.5 font-mono text-[9px] border transition-all ${
                  currentBeatId === b3.id
                    ? 'bg-brass text-base font-bold border-brass'
                    : 'bg-base-mid text-paper-muted border-divider hover:border-brass/40'
                }`}
              >
                {b3.id} (Ending)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Beat Content */}
      <div className="flex-1 px-5 py-6 flex flex-col justify-between space-y-6 overflow-y-auto">
        {/* Narration Block */}
        <div className="border-l-2 border-brass/60 pl-4 py-1">
          <p className="font-mono text-[9px] tracking-widest uppercase text-brass mb-1 flex items-center gap-1">
            <Volume2 className="w-3 h-3" strokeWidth={1.5} />
            <span>Narration</span>
          </p>
          <p className="font-body text-sm text-paper-muted leading-relaxed italic">
            {currentBeat.narration}
          </p>
        </div>

        {/* Dialogue Block */}
        {currentBeat.dialogue && currentBeat.dialogue.length > 0 && (
          <div className="space-y-3">
            {currentBeat.dialogue.map((d, i) => {
              const isActive = activeDialogueIndex === i
              return (
                <div
                  key={i}
                  className={`p-3.5 border transition-all duration-300 ${
                    isActive
                      ? 'border-brass bg-brass/10'
                      : 'border-divider/60 bg-base-light opacity-80'
                  }`}
                  style={{
                    borderLeftColor: isActive ? character.color : undefined,
                    borderLeftWidth: isActive ? '3px' : undefined,
                  }}
                >
                  <p className="font-mono text-[9px] tracking-widest uppercase mb-1"
                    style={{ color: character.color }}>
                    {d.speaker}
                  </p>
                  <p className="font-body text-sm text-paper leading-relaxed">
                    &ldquo;{d.line}&rdquo;
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Choices or Episode End */}
        {!episodeEnded && currentBeat.choices && currentBeat.choices.length > 0 ? (
          <div className="pt-4 space-y-2.5">
            <p className="font-mono text-[9px] tracking-widest uppercase text-paper-muted opacity-60">
              What do you do next? ↓
            </p>
            {currentBeat.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice.next)}
                className="w-full text-left p-4 border border-divider hover:border-brass bg-base-light hover:bg-base-mid text-paper font-body text-sm transition-all duration-200 group flex items-center justify-between"
              >
                <span>{choice.text}</span>
                <ArrowRight className="w-4 h-4 text-paper-muted group-hover:text-brass group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        ) : null}

        {/* Episode End Screen */}
        {episodeEnded && (
          <div className="pt-6 border-t border-divider text-center space-y-4 animate-fade-in">
            <p className="font-mono text-[10px] tracking-widest uppercase text-brass">
              ✦ End of Episode ✦
            </p>
            <div className="flex gap-3">
              <button
                onClick={onReplay}
                className="flex-1 py-3 border border-divider text-paper-muted font-body text-xs hover:border-brass hover:text-paper transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Replay Premise</span>
              </button>
              <button
                onClick={onTalkAgain}
                className="flex-1 py-3 border border-brass bg-brass text-base font-body text-xs font-semibold hover:bg-paper transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Talk to {character.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
