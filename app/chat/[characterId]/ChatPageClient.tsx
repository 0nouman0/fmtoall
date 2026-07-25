'use client'

import { useState } from 'react'
import { Character } from '@/lib/personas'
import BackstoryScreen from '@/components/BackstoryScreen'
import ChatInterface from '@/components/ChatInterface'

interface ChatPageClientProps {
  character: Character
}

export default function ChatPageClient({ character }: ChatPageClientProps) {
  const [backstoryDone, setBackstoryDone] = useState(false)

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
