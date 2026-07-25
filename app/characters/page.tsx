import { getAllCharacters } from '@/lib/personas'
import CharactersPageClient from './CharactersPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Choose Character — Echoes',
  description: 'Browse the full cast of Pocket FM personas available in Echoes.',
}

export default function CharactersPage() {
  const characters = getAllCharacters()
  return <CharactersPageClient characters={characters} />
}
