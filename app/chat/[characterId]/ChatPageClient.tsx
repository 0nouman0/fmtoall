'use client'

import { useState, useEffect } from 'react'
import { Character, getCharacterById } from '@/lib/personas'
import BackstoryScreen from '@/components/BackstoryScreen'
import ChatInterface from '@/components/ChatInterface'

interface ChatPageClientProps {
  character: Character
}

export default function ChatPageClient({ character: initialChar }: ChatPageClientProps) {
  const [character, setCharacter] = useState<Character | null>(initialChar.name ? initialChar : null)
  const [backstoryDone, setBackstoryDone] = useState(false)

  useEffect(() => {
    const hydrateCharacter = async () => {
      if (!character || !character.name) {
        const found = getCharacterById(initialChar.id)
        if (found) {
          setCharacter(found)
          return
        }

        try {
          const res = await fetch('/api/personas')
          const data = await res.json()
          if (data.personas) {
            const dbMatch = data.personas.find((p: any) => p.id === initialChar.id)
            if (dbMatch) {
              setCharacter({
                id: dbMatch.id,
                name: dbMatch.name,
                series: dbMatch.series,
                genre: dbMatch.genre,
                color: dbMatch.color,
                voice: dbMatch.voice,
                audioTheme: dbMatch.audio_theme,
                hook: dbMatch.hook,
                persona_prompt: dbMatch.persona_prompt,
                backstory_narrative: dbMatch.backstory_narrative,
                backstory_chapters: dbMatch.backstory_chapters ?? [],
                backstory_facts: dbMatch.backstory_facts ?? [],
              })
            }
          }
        } catch (err) {
          console.warn('Could not hydrate persona from Supabase:', err)
        }
      }
    }
    hydrateCharacter()
  }, [initialChar.id, character])

  if (!character || !character.name) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 text-paper font-mono text-xs">
        <p className="mb-4 text-paper-muted">Loading persona profile...</p>
        <a href="/characters" className="border border-brass px-4 py-2 text-brass">
          Back to Cast Gallery
        </a>
      </div>
    )
  }

  if (!backstoryDone) {
    return (
      <BackstoryScreen
        character={character}
        onEnter={() => setBackstoryDone(true)}
      />
    )
  }

  return <ChatInterface character={character} />
}
