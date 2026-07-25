import { getAllCharacters } from '@/lib/personas'
import CharacterCard from '@/components/CharacterCard'

export default function Home() {
  const characters = getAllCharacters()

  return (
    <main className="min-h-screen bg-base relative">
      {/* Spine line decoration */}
      <div className="spine-line" />

      <div className="max-w-phone mx-auto px-6 page-turn">
        {/* Header */}
        <header className="pt-12 pb-8">
          <div className="mb-2">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass opacity-70">
              Pocket FM × Echoes
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold text-paper leading-[1.05] mb-1">
            Echoes
          </h1>
          <p className="font-display text-lg text-paper-muted italic font-light mt-1">
            Step inside the story.
          </p>
          <div className="w-10 h-0.5 bg-brass mt-5 mb-1" />
          <p className="font-body text-sm text-paper-muted leading-relaxed mt-4 max-w-xs">
            Talk directly to any character. Then reshape what happens next.
          </p>
        </header>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-divider" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-paper-muted opacity-50">
            Choose a character
          </span>
          <div className="h-px flex-1 bg-divider" />
        </div>

        {/* Character list */}
        <div className="space-y-px">
          {characters.map((character, index) => (
            <CharacterCard key={character.id} character={character} index={index} />
          ))}
        </div>

        {/* Footer */}
        <footer className="py-10 mt-8 border-t border-divider">
          <p className="font-mono text-[10px] tracking-widest uppercase text-paper-muted opacity-40 text-center">
            Powered by Llama 3.3 · Voice by Web Speech API
          </p>
        </footer>
      </div>
    </main>
  )
}
