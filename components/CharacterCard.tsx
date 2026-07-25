import { Character } from '@/lib/personas'
import Link from 'next/link'

interface CharacterCardProps {
  character: Character
  index: number
}

const genreIcons: Record<string, string> = {
  'Crime Thriller': '🎭',
  'College Romance': '💌',
  'Mythology & Fantasy': '⚡',
  'Sci-Fi': '🛰️',
}

export default function CharacterCard({ character, index }: CharacterCardProps) {
  return (
    <Link
      href={`/chat/${character.id}`}
      className="block w-full text-left group relative overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Main card */}
      <div className="relative border border-divider bg-base-light hover:bg-base-mid transition-all duration-300 overflow-hidden">
        {/* Accent top bar using character color */}
        <div
          className="h-0.5 w-full transition-all duration-500 group-hover:h-1"
          style={{ backgroundColor: character.color }}
        />

        <div className="p-5 pl-6">
          {/* Genre tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-paper-muted">
              {genreIcons[character.genre] ?? '✦'} {character.genre}
            </span>
          </div>

          {/* Character name */}
          <h2 className="font-display text-2xl font-bold text-paper leading-tight mb-1 group-hover:text-white transition-colors duration-200">
            {character.name}
          </h2>

          {/* Series name */}
          <p className="font-mono text-[11px] tracking-widest uppercase text-brass mb-3 opacity-80">
            {character.series}
          </p>

          {/* Hook line */}
          <p className="font-body text-sm text-paper-muted leading-relaxed">
            {character.hook}
          </p>

          {/* CTA arrow */}
          <div className="mt-4 flex items-center gap-2 text-paper-muted group-hover:text-brass transition-colors duration-200">
            <span className="font-mono text-xs tracking-widest uppercase">Talk to them</span>
            <span className="text-sm transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${character.color}, transparent 70%)` }}
        />
      </div>
    </Link>
  )
}
