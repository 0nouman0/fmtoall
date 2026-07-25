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
import { ArrowLeft, Volume2, VolumeX, Sparkles, Send } from 'lucide-react'

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

  const getVoiceConfig = useCallback((): { rate: number; pitch: number } => {
    return ({
      onyx:    { rate: 0.80, pitch: 0.68 },
      nova:    { rate: 0.92, pitch: 1.15 },
      echo:    { rate: 0.74, pitch: 0.60 },
      shimmer: { rate: 0.95, pitch: 1.25 },
    } as Record<string, { rate: number; pitch: number }>)[character.voice] ?? { rate: 0.82, pitch: 0.75 }
  }, [character.voice])

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
    // Strip action cues / stage directions in asterisks so TTS reads spoken words naturally
    const spokenContent = text.replace(/\*[^*]+\*/g, '').trim() || text
    const utt = new SpeechSynthesisUtterance(spokenContent)
    const cfg = getVoiceConfig()
    utt.rate = cfg.rate
    utt.pitch = cfg.pitch
    utt.volume = 1

    // Try selecting a specific character voice if available in browser
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      // Find a deeper or distinct voice for character
      const characterVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Male')))
      if (characterVoice) utt.voice = characterVoice
    }

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

  const speakUserReply = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { onEnd?.(); return }
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/\*[^*]+\*/g, '').trim() || text
    const utt = new SpeechSynthesisUtterance(cleanText)
    // Distinct user voice parameters: brighter pitch, faster/snappier rate
    utt.rate = 1.05
    utt.pitch = 1.25
    utt.volume = 1

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      const userVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('US English')))
      if (userVoice) utt.voice = userVoice
    }

    utt.onend = () => onEnd?.()
    utt.onerror = () => onEnd?.()
    window.speechSynthesis.speak(utt)
  }, [])

  const startMusic = useCallback(() => {
    if (musicOn) return
    const engine = getAudioEngine()
    engine.play(character.audioTheme as AudioTheme, 2.5).then(() => {
      setMusicOn(true)
    }).catch((e) => console.warn('Audio failed:', e))
  }, [musicOn, character.audioTheme])

  useEffect(() => {
    const greet = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: character.id,
            customCharacter: character,
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
          customCharacter: character,
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

  const handleSuggestionPick = (suggestion: string) => {
    speakUserReply(suggestion, () => {
      sendMessage(suggestion)
    })
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    sendMessage(transcript)
  }

  const handleVoiceInterim = (interim: string) => setInput(interim)

  const handleBranchSubmit = async (premise: string) => {
    setIsBranchLoading(true)
    try {
      const res = await fetch('/api/branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, customCharacter: character, premise, history: messages }),
      })
      const data = await res.json()
      setBranchTree(data)
      setShowBranchModal(false)
    } catch {
      setError("Couldn't generate the episode. Try again.")
    } finally { setIsBranchLoading(false) }
  }

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

  return (
    <div
      className="flex flex-col h-screen bg-base max-w-phone mx-auto"
      onClick={startMusic}
    >
      <div className="h-0.5 w-full flex-shrink-0" style={{ backgroundColor: character.color }} />

      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3.5 border-b border-divider bg-base sticky top-0 z-10 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            getAudioEngine().stop(1000)
            router.push('/')
          }}
          className="text-paper-muted hover:text-paper transition-colors p-1 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
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
          className={`flex items-center gap-1.5 px-2 py-1 border transition-all duration-200 flex-shrink-0 ${
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
            <div className="flex items-center gap-1">
              <VolumeX className="w-3 h-3 opacity-50" strokeWidth={1.5} />
              <span className="font-mono text-[8px] uppercase tracking-widest opacity-50">off</span>
            </div>
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
                <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5 flex items-center gap-1.5"
                  style={{ color: character.color }}>
                  {character.name.split(' ')[0]}
                  {speakingMsgIndex === i && <Waveform playing={true} bars={5} />}
                </p>
                <div
                  className="px-4 py-3 border-l-2 transition-all duration-300 cursor-pointer hover:bg-base-light group"
                  style={{ borderColor: speakingMsgIndex === i ? character.color : '#3D3A35' }}
                  onClick={(e) => { e.stopPropagation(); startMusic(); speakText(msg.content, i) }}
                  title="Click to hear again"
                >
                  <p className="font-body text-sm text-paper leading-relaxed">
                    {msg.content.split(/(\*[^*]+\*)/g).map((part, pIdx) => {
                      if (part.startsWith('*') && part.endsWith('*')) {
                        return (
                          <span key={pIdx} className="italic text-paper-muted opacity-80 font-serif mr-1">
                            {part}
                          </span>
                        )
                      }
                      return part
                    })}
                  </p>
                  <p className="font-mono text-[8px] text-paper-muted opacity-0 group-hover:opacity-30 mt-1 transition-opacity flex items-center gap-1">
                    <Volume2 className="w-2.5 h-2.5" strokeWidth={1.5} />
                    <span>tap to replay</span>
                  </p>
                </div>

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
          className="w-full border py-2.5 font-body text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ borderColor: '#7A2E2E80', color: '#7A2E2E' }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(122,46,46,0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>What if...?</span>
        </button>
      </div>

      {/* Input bar */}
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
              className="border border-brass text-brass font-mono text-xs px-3 py-3 hover:bg-brass hover:text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0 flex items-center gap-1"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

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
