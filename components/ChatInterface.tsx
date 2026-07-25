'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Character } from '@/lib/personas'
import { BranchTree } from '@/lib/types'
import { getAudioEngine, AudioTheme } from '@/lib/audioEngine'
import Waveform from '@/components/Waveform'
import BranchModal from '@/components/BranchModal'
import EpisodePlayer from '@/components/EpisodePlayer'
import SpeechInput from '@/components/SpeechInput'
import SuggestedResponses from '@/components/SuggestedResponses'

interface Message {
  role: 'user' | 'assistant'
  content: string
  suggestions?: string[] | null
}

interface ChatInterfaceProps {
  character: Character & { audioTheme: string }
}

export default function ChatInterface({ character }: ChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(-1)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [isBranchLoading, setIsBranchLoading] = useState(false)
  const [branchTree, setBranchTree] = useState<BranchTree | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [showOwnInput, setShowOwnInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ─── TTS config per character ────────────────────────────────────────────────
  const getVoiceConfig = useCallback((): { rate: number; pitch: number } => {
    return ({
      onyx:    { rate: 0.80, pitch: 0.72 },
      nova:    { rate: 0.90, pitch: 1.08 },
      echo:    { rate: 0.76, pitch: 0.65 },
      shimmer: { rate: 0.94, pitch: 1.15 },
    } as Record<string, { rate: number; pitch: number }>)[character.voice] ?? { rate: 0.87, pitch: 1.0 }
  }, [character.voice])

  // ─── Speak a text string ─────────────────────────────────────────────────────
  const speakText = useCallback((
    text: string,
    msgIndex: number,
    onEnd?: () => void
  ) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    const cfg = getVoiceConfig()
    utt.rate = cfg.rate
    utt.pitch = cfg.pitch
    utt.volume = 1

    // Duck music while speaking
    const engine = getAudioEngine()
    if (engine.isPlaying()) engine.setVolume(0.22, 350)

    utt.onstart = () => setSpeakingMsgIndex(msgIndex)
    const done = () => {
      setSpeakingMsgIndex(-1)
      if (engine.isPlaying()) engine.setVolume(1, 700)
      onEnd?.()
    }
    utt.onend = done
    utt.onerror = done
    window.speechSynthesis.speak(utt)
  }, [getVoiceConfig])

  // ─── Speak the USER's chosen suggestion (neutral voice) ──────────────────────
  const speakUserReply = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { onEnd?.(); return }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 1.0
    utt.pitch = 1.0
    utt.volume = 1
    utt.onend = () => onEnd?.()
    utt.onerror = () => onEnd?.()
    window.speechSynthesis.speak(utt)
  }, [])

  // ─── Start ambient music — MUST be called from user gesture ─────────────────
  const startMusic = useCallback(() => {
    if (musicOn) return
    const engine = getAudioEngine()
    engine.play(character.audioTheme as AudioTheme, 2.5).then(() => {
      setMusicOn(true)
    }).catch((e) => console.warn('Audio failed:', e))
  }, [musicOn, character.audioTheme])

  // ─── Greeting on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    const greet = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: character.id,
            message: '(The user just arrived. Open with a single in-character line — one sentence, intriguing, specific to your story. Do NOT say Hello.)',
            history: [],
          }),
        })
        const data = await res.json()
        if (data.reply) {
          const msg: Message = {
            role: 'assistant',
            content: data.reply,
            suggestions: data.suggestions ?? null,
          }
          setMessages([msg])
          // Auto-speak after slight delay
          setTimeout(() => speakText(data.reply, 0), 600)
        }
      } catch { /* silent */ }
      finally { setIsLoading(false) }
    }
    greet()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ─── Core send message ───────────────────────────────────────────────────────
  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isLoading) return

    setInput('')
    setError(null)
    setShowOwnInput(false)

    const userMsg: Message = { role: 'user', content: msg }
    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          message: msg,
          history: updatedHistory.slice(-10),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply,
        suggestions: data.suggestions ?? null,
      }
      const final = [...updatedHistory, assistantMsg]
      setMessages(final)
      speakText(data.reply, final.length - 1)
    } catch {
      setError("Couldn't reach the character. Check your connection.")
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  // ─── Handle pre-built suggestion picked ──────────────────────────────────────
  const handleSuggestionPick = (suggestion: string) => {
    // 1. Speak it aloud as the user's voice
    speakUserReply(suggestion, () => {
      // 2. After speaking, send it
      sendMessage(suggestion)
    })
  }

  // ─── Voice input ─────────────────────────────────────────────────────────────
  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    sendMessage(transcript)
  }

  const handleVoiceInterim = (interim: string) => setInput(interim)

  // ─── Branch generation ────────────────────────────────────────────────────────
  const handleBranchSubmit = async (premise: string) => {
    setIsBranchLoading(true)
    try {
      const res = await fetch('/api/branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, premise, history: messages }),
      })
      const data = await res.json()
      setBranchTree(data)
      setShowBranchModal(false)
    } catch {
      setError("Couldn't generate the episode. Try again.")
    } finally { setIsBranchLoading(false) }
  }

  // ─── Episode player takeover ──────────────────────────────────────────────────
  if (branchTree) {
    return (
      <EpisodePlayer
        tree={branchTree}
        character={character}
        onReplay={() => setBranchTree(null)}
        onTalkAgain={() => setBranchTree(null)}
      />
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen bg-base max-w-phone mx-auto"
      // Any click on the container starts music (must be user gesture)
      onClick={startMusic}
    >
      {/* Character color accent bar */}
      <div className="h-0.5 w-full flex-shrink-0" style={{ backgroundColor: character.color }} />

      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3.5 border-b border-divider bg-base sticky top-0 z-10 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            getAudioEngine().stop(1000)
            router.push('/')
          }}
          className="text-paper-muted hover:text-paper transition-colors font-mono text-sm flex-shrink-0"
        >
          ←
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-lg text-paper leading-tight truncate">{character.name}</h1>
          <p className="font-mono text-[9px] tracking-widest uppercase truncate" style={{ color: character.color }}>
            {character.series}
          </p>
        </div>

        {/* Music status button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (musicOn) {
              getAudioEngine().stop(800)
              setMusicOn(false)
            } else {
              startMusic()
            }
          }}
          className={`flex items-center gap-1.5 px-2 py-1 border rounded-none transition-all duration-200 flex-shrink-0 ${
            musicOn
              ? 'border-brass/50 text-brass'
              : 'border-divider text-paper-muted hover:border-brass/30'
          }`}
          title={musicOn ? 'Music on — tap to mute' : 'Tap to start music'}
        >
          {musicOn ? (
            <>
              <Waveform playing={true} bars={4} />
              <span className="font-mono text-[8px] uppercase tracking-widest">♪</span>
            </>
          ) : (
            <span className="font-mono text-[8px] uppercase tracking-widest opacity-50">♪ off</span>
          )}
        </button>

        {/* Speaking indicator */}
        {speakingMsgIndex >= 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-mono text-[8px] uppercase text-brass opacity-70 tracking-widest">Speaking</span>
            <Waveform playing={true} bars={4} />
          </div>
        )}
      </header>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Greeting loading */}
        {messages.length === 0 && isLoading && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: character.color }}>
              {character.name.split(' ')[0]}
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: character.color, animationDelay: `${i * 150}ms` }} />
              ))}
            </span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.role === 'assistant' ? (
              <div className="w-full max-w-[92%]">
                {/* Speaker label */}
                <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5 flex items-center gap-1.5"
                  style={{ color: character.color }}>
                  {character.name.split(' ')[0]}
                  {speakingMsgIndex === i && <Waveform playing={true} bars={5} />}
                </p>
                {/* Message bubble — click to replay */}
                <div
                  className="px-4 py-3 border-l-2 transition-all duration-300 cursor-pointer hover:bg-base-light group"
                  style={{ borderColor: speakingMsgIndex === i ? character.color : '#3D3A35' }}
                  onClick={(e) => { e.stopPropagation(); startMusic(); speakText(msg.content, i) }}
                  title="Click to hear again"
                >
                  <p className="font-body text-sm text-paper leading-relaxed">{msg.content}</p>
                  <p className="font-mono text-[8px] text-paper-muted opacity-0 group-hover:opacity-30 mt-1 transition-opacity">
                    🔊 tap to replay
                  </p>
                </div>

                {/* Suggested responses — show only for last assistant message */}
                {i === messages.length - 1 && msg.suggestions && msg.suggestions.length >= 2 && !isLoading && (
                  <SuggestedResponses
                    suggestions={msg.suggestions}
                    characterColor={character.color}
                    onPickSuggestion={(text) => {
                      startMusic()
                      handleSuggestionPick(text)
                    }}
                    onChooseOwn={() => {
                      setShowOwnInput(true)
                      setTimeout(() => inputRef.current?.focus(), 100)
                    }}
                    disabled={isLoading}
                  />
                )}
              </div>
            ) : (
              <div className="max-w-[78%] bg-base-mid border border-divider/50 px-4 py-3">
                <p className="font-body text-sm text-paper-muted leading-relaxed">{msg.content}</p>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && messages.length > 0 && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: character.color }}>
              {character.name.split(' ')[0]}
            </span>
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce opacity-60"
                style={{ backgroundColor: character.color, animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        )}

        {error && (
          <div className="font-mono text-[10px] text-paper-muted opacity-60 border border-divider px-4 py-2 text-center animate-fade-in">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* "What if?" */}
      <div className="px-5 pt-2 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); startMusic(); setShowBranchModal(true) }}
          disabled={messages.length === 0 || isLoading}
          className="w-full border py-2.5 font-body text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ borderColor: '#7A2E2E80', color: '#7A2E2E' }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(122,46,46,0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          What if...?
        </button>
      </div>

      {/* Input bar — only shown when user asks to type own reply or no suggestions */}
      {(showOwnInput ||
        messages.length === 0 ||
        !messages[messages.length - 1]?.suggestions ||
        messages[messages.length - 1]?.role === 'user' ||
        isLoading) && (
        <div className="px-5 py-4 border-t border-divider bg-base mt-2 flex-shrink-0">
          <p className="font-mono text-[8px] uppercase tracking-widest text-paper-muted opacity-40 mb-2 text-center">
            Type or speak your message
          </p>
          <div className="flex gap-2 items-center">
            <SpeechInput
              onTranscript={handleVoiceTranscript}
              onInterim={handleVoiceInterim}
              disabled={isLoading}
            />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              onFocus={startMusic}
              placeholder={`Ask ${character.name.split(' ')[0]}...`}
              disabled={isLoading}
              className="flex-1 bg-base-light border border-divider text-paper placeholder-paper-muted font-body text-sm px-4 py-3 focus:outline-none focus:border-brass transition-colors duration-200 min-w-0"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="border border-brass text-brass font-mono text-xs px-3 py-3 hover:bg-brass hover:text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
            >
              Ask →
            </button>
          </div>
        </div>
      )}

      {/* When suggestions are shown, show minimal mic-only bar */}
      {!showOwnInput &&
        messages.length > 0 &&
        messages[messages.length - 1]?.suggestions &&
        messages[messages.length - 1]?.role === 'assistant' &&
        !isLoading && (
        <div className="px-5 py-3 border-t border-divider bg-base flex-shrink-0">
          <div className="flex items-center gap-3">
            <SpeechInput
              onTranscript={handleVoiceTranscript}
              onInterim={handleVoiceInterim}
              disabled={isLoading}
            />
            <p className="font-mono text-[9px] uppercase tracking-widest text-paper-muted opacity-50">
              Or tap mic to speak your own answer
            </p>
          </div>
        </div>
      )}

      {showBranchModal && (
        <BranchModal
          character={character}
          onClose={() => setShowBranchModal(false)}
          onSubmit={handleBranchSubmit}
          isLoading={isBranchLoading}
        />
      )}
    </div>
  )
}
