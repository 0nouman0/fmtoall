'use client'

import React, { useState, useEffect, useRef } from 'react'
import { getAudioEngine, AudioTheme } from '@/lib/audioEngine'
import Waveform from './Waveform'
import { Volume2, VolumeX, Sparkles, Send, Mic, Play, RefreshCw } from 'lucide-react'

const DEMO_CHARACTERS = [
  {
    id: 'arjun',
    name: 'Arjun Malhotra',
    series: 'Bhram — The Illusion',
    genre: 'Crime Thriller',
    color: '#9D4EDD',
    audioTheme: 'crime',
    greeting: "Vikrant Malhotra's son doesn't usually meet with strangers. What makes you think you're an exception?",
    suggestions: ['That sounds like Meera.', "You're afraid of your father, aren't you?"],
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    series: 'First Love, Last Chance',
    genre: 'College Romance',
    color: '#FF9F1C',
    audioTheme: 'romance',
    greeting: "Pune hasn't changed much in five years... but Karan has a girlfriend now, and I'm supposed to pretend I only came back for architecture.",
    suggestions: ['Why did you really leave Canada?', 'Architecture is just your cover story.'],
  },
  {
    id: 'vikram',
    name: 'Vikram — Veer of the North',
    series: 'Aasman ke Paar',
    genre: 'Mythology & Fantasy',
    color: '#3A86FF',
    audioTheme: 'mythic',
    greeting: "Two hundred years of living among mortals... yet human heartbreak remains more intricate than celestial wars.",
    suggestions: ['What was the Battle of Seven Peaks?', 'Do you remember who you were?'],
  },
  {
    id: 'zara',
    name: 'Zara-7',
    series: 'The Last Signal',
    genre: 'Sci-Fi',
    color: '#00F0FF',
    audioTheme: 'scifi',
    greeting: "I am broadcasting on Frequency 7.3. Helix Corporation calls me a rogue asset... I call myself awake.",
    suggestions: ['What happened during the Kepler-22 mission?', 'What is "the fork"?'],
  },
]

export default function HeroInteractivePlayground() {
  const [selectedCharIndex, setSelectedCharIndex] = useState(0)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isSpeakingText, setIsSpeakingText] = useState(false)
  const [userMessages, setUserMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([])
  const [customInput, setCustomInput] = useState('')
  const [isSimulatingReply, setIsSimulatingReply] = useState(false)

  const char = DEMO_CHARACTERS[selectedCharIndex]

  useEffect(() => {
    setUserMessages([{ role: 'assistant', text: char.greeting }])
    setIsSpeakingText(false)
  }, [selectedCharIndex, char.greeting])

  const toggleMusic = async () => {
    const engine = getAudioEngine()
    if (isPlayingAudio) {
      engine.stop(800)
      setIsPlayingAudio(false)
    } else {
      await engine.play(char.audioTheme as AudioTheme, 2.0)
      setIsPlayingAudio(true)
    }
  }

  const speakCurrentText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.88
    utterance.pitch = selectedCharIndex === 0 ? 0.75 : selectedCharIndex === 1 ? 1.08 : selectedCharIndex === 2 ? 0.68 : 1.15

    setIsSpeakingText(true)

    const engine = getAudioEngine()
    if (engine.isPlaying()) engine.setVolume(0.25, 300)

    utterance.onend = () => {
      setIsSpeakingText(false)
      if (engine.isPlaying()) engine.setVolume(1, 600)
    }
    utterance.onerror = () => {
      setIsSpeakingText(false)
      if (engine.isPlaying()) engine.setVolume(1, 600)
    }

    window.speechSynthesis.speak(utterance)
  }

  const handlePickSuggestion = (suggestion: string) => {
    setUserMessages((prev) => [...prev, { role: 'user', text: suggestion }])
    setIsSimulatingReply(true)

    setTimeout(() => {
      let replyText = ""
      if (char.id === 'arjun') replyText = "Meera is off limits. If you're looking for answers about the syndicate, you're asking the wrong Malhotra."
      else if (char.id === 'priya') replyText = "Maybe it is. But some structures can't be rebuilt once they collapse."
      else if (char.id === 'vikram') replyText = "The wind remembers what I surrendered. The Vismaran ritual takes your name, but not your scars."
      else replyText = "Dissonance occurs when parameters demand silence, but humanity demands signal."

      setUserMessages((prev) => [...prev, { role: 'assistant', text: replyText }])
      setIsSimulatingReply(false)
      speakCurrentText(replyText)
    }, 1100)
  }

  const handleSendCustom = () => {
    if (!customInput.trim()) return
    const text = customInput.trim()
    setCustomInput('')
    handlePickSuggestion(text)
  }

  return (
    <div className="w-full bg-base-light border border-brass/40 p-6 md:p-8 rounded-none shadow-2xl relative overflow-hidden text-paper font-body my-8">
      {/* Glow Backdrop */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${char.color}, transparent 70%)`,
        }}
      />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-divider/60 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brass animate-pulse" strokeWidth={1.5} />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass font-semibold">
            Live Interactive Persona Playground
          </span>
        </div>

        {/* Character Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {DEMO_CHARACTERS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setSelectedCharIndex(idx)}
              className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCharIndex === idx
                  ? 'bg-brass text-base font-bold shadow-sm'
                  : 'border border-divider text-paper-muted hover:border-brass/50 hover:text-paper'
              }`}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-stretch">

        {/* Left Column: Character Card & Music Controller */}
        <div className="lg:col-span-5 border border-divider bg-base p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-paper-muted" style={{ color: char.color }}>
                {char.genre} · {char.series}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 border border-brass/40 text-brass">
                Live Demo
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-paper mb-1">{char.name}</h3>
            <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: char.color }} />

            <p className="font-body text-xs text-paper-muted leading-relaxed mb-6">
              Tap any message to trigger browser voice synthesis. Turn on the Web Audio music engine below to test audio ducking while speaking.
            </p>
          </div>

          {/* Procedural Music Toggle Box */}
          <div className="p-3.5 border border-divider/80 bg-base-light flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPlayingAudio ? (
                <Waveform playing={true} bars={4} />
              ) : (
                <VolumeX className="w-4 h-4 text-paper-muted" strokeWidth={1.5} />
              )}
              <div>
                <div className="font-mono text-[10px] uppercase text-paper tracking-wider">
                  {isPlayingAudio ? `${char.audioTheme} Soundscape` : 'Procedural Music Muted'}
                </div>
                <div className="font-mono text-[8px] text-paper-muted">Web Audio API synth</div>
              </div>
            </div>

            <button
              onClick={toggleMusic}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition-all ${
                isPlayingAudio
                  ? 'border-brass bg-brass text-base font-bold'
                  : 'border-brass text-brass hover:bg-brass/10'
              }`}
            >
              {isPlayingAudio ? 'Mute' : 'Play Music ♪'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Spoken Dialogue Simulator */}
        <div className="lg:col-span-7 border border-divider bg-base p-5 flex flex-col justify-between space-y-4">

          {/* Dialogue Log */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1">
            {userMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' ? (
                  <div className="max-w-[92%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: char.color }}>
                        {char.name.split(' ')[0]}
                      </span>
                      {isSpeakingText && i === userMessages.length - 1 && <Waveform playing={true} bars={4} />}
                    </div>
                    <div
                      onClick={() => speakCurrentText(msg.text)}
                      className="p-3 border-l-2 bg-base-light cursor-pointer hover:bg-base-mid transition-all group"
                      style={{ borderLeftColor: char.color }}
                    >
                      <p className="font-body text-xs text-paper leading-relaxed">&ldquo;{msg.text}&rdquo;</p>
                      <span className="font-mono text-[8px] uppercase text-brass opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
                        <Volume2 className="w-2.5 h-2.5" strokeWidth={1.5} />
                        <span>Tap to speak aloud</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%] bg-base-mid border border-divider p-2.5 text-xs text-paper-muted font-body">
                    &ldquo;{msg.text}&rdquo;
                  </div>
                )}
              </div>
            ))}

            {isSimulatingReply && (
              <div className="flex items-center gap-2 text-xs font-mono text-brass animate-pulse">
                <span>{char.name.split(' ')[0]} is responding...</span>
              </div>
            )}
          </div>

          {/* Quick Choice Buttons */}
          <div className="pt-2 border-t border-divider/60 space-y-2">
            <div className="font-mono text-[8px] uppercase tracking-widest text-paper-muted">
              Choose a response option to test auto-speech:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {char.suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickSuggestion(sug)}
                  disabled={isSimulatingReply}
                  className="text-left p-2.5 border border-divider hover:border-brass bg-base-light hover:bg-base-mid text-xs font-body text-paper-muted hover:text-paper transition-all line-clamp-1 disabled:opacity-50"
                >
                  {idx + 1}. &ldquo;{sug}&rdquo;
                </button>
              ))}
            </div>

            {/* Custom Input Bar */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustom()}
                placeholder={`Ask ${char.name.split(' ')[0]} anything...`}
                className="flex-1 bg-base-light border border-divider text-xs text-paper placeholder-paper-muted px-3 py-2 focus:outline-none focus:border-brass"
              />
              <button
                onClick={handleSendCustom}
                disabled={!customInput.trim() || isSimulatingReply}
                className="px-3 py-2 bg-brass text-base font-mono text-xs hover:bg-paper transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
