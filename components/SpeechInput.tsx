'use client'

import { useState, useRef, useEffect } from 'react'
import Waveform from './Waveform'

interface SpeechInputProps {
  onTranscript: (text: string) => void
  onInterim?: (text: string) => void
  disabled?: boolean
}

type RecordingState = 'idle' | 'listening' | 'processing' | 'error'

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default function SpeechInput({ onTranscript, onInterim, disabled }: SpeechInputProps) {
  const [state, setState] = useState<RecordingState>('idle')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    setIsSupported(supported)
  }, [])

  const startListening = () => {
    if (!isSupported || disabled) return

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-IN' // Indian English — works for the demo context

    recognition.onstart = () => {
      setState('listening')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (interimTranscript && onInterim) {
        onInterim(interimTranscript)
      }

      if (finalTranscript) {
        setState('processing')
        onTranscript(finalTranscript.trim())
        setTimeout(() => setState('idle'), 300)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('Speech recognition error:', event.error)
      setState(event.error === 'not-allowed' ? 'error' : 'idle')
      setTimeout(() => setState('idle'), 2000)
    }

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setState((prev) => (prev === 'listening' ? 'idle' : prev))
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setState('idle')
  }

  const handleClick = () => {
    if (state === 'listening') {
      stopListening()
    } else if (state === 'idle') {
      startListening()
    }
  }

  if (!isSupported) {
    return null // Don't render mic button if unsupported
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === 'processing'}
      title={
        state === 'listening'
          ? 'Listening… tap to stop'
          : state === 'error'
          ? 'Microphone access denied'
          : 'Speak your message'
      }
      className={`flex items-center justify-center w-11 h-11 border transition-all duration-200 flex-shrink-0
        ${state === 'listening'
          ? 'border-red bg-red/20 text-red'
          : state === 'error'
          ? 'border-divider text-paper-muted/40 cursor-not-allowed'
          : 'border-divider text-paper-muted hover:border-brass hover:text-brass'
        }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      {state === 'listening' ? (
        // Animated listening indicator
        <Waveform playing={true} bars={5} />
      ) : state === 'processing' ? (
        <span className="text-xs animate-spin inline-block">⟳</span>
      ) : state === 'error' ? (
        <span className="text-sm">🚫</span>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      )}
    </button>
  )
}
