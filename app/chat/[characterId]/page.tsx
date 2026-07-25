import { getCharacterById } from '@/lib/personas'
import { notFound } from 'next/navigation'
import ChatPageClient from './ChatPageClient'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ characterId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { characterId } = await params
  const character = getCharacterById(characterId)
  if (!character) return { title: 'Character Not Found — Echoes' }
  return {
    title: `${character.name} — Echoes`,
    description: `${character.hook}. ${character.backstory_narrative.slice(0, 120)}...`,
  }
}

export default async function ChatPage({ params }: PageProps) {
  const { characterId } = await params
  const character = getCharacterById(characterId)

  if (!character) {
    // Return ChatPageClient with placeholder to client-side hydrate custom character if stored in localStorage
    return <ChatPageClient character={{ id: characterId } as any} />
  }

  return <ChatPageClient character={character} />
}
