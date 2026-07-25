'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Character, getAllCharacters } from '@/lib/personas'
import AddPersonaModal from '@/components/AddPersonaModal'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Drama, Radio, Search, PlusCircle } from 'lucide-react'

interface CharactersPageClientProps {
  characters: Character[]
}

const GENRE_ICONS: Record<string, string> = {
  'Crime Thriller':      '🎭',
  'College Romance':     '💌',
  'Mythology & Fantasy': '⚡',
  'Sci-Fi':             '🛰️',
}

const ITEMS_PER_PAGE = 4

export default function CharactersPageClient({ characters: initialCharacters }: CharactersPageClientProps) {
  const router = useRouter()
  const [characterList, setCharacterList] = useState<Character[]>(initialCharacters || [])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const loadPersonas = async () => {
      const localChars = getAllCharacters()
      setCharacterList(localChars)

      try {
        const res = await fetch('/api/personas')
        const data = await res.json()
        if (data.personas && Array.from(data.personas).length > 0) {
          const dbChars: Character[] = data.personas.map((p: any) => ({
            id: p.id,
            name: p.name,
            series: p.series,
            genre: p.genre,
            color: p.color,
            voice: p.voice,
            audioTheme: p.audio_theme,
            hook: p.hook,
            persona_prompt: p.persona_prompt,
            backstory_narrative: p.backstory_narrative,
            backstory_chapters: p.backstory_chapters ?? [],
            backstory_facts: p.backstory_facts ?? [],
          }))

          // Merge DB chars with local and default chars
          const existingIds = new Set(localChars.map((c) => c.id))
          const newFromDb = dbChars.filter((c) => !existingIds.has(c.id))
          setCharacterList([...newFromDb, ...localChars])
        }
      } catch (err) {
        console.warn('Could not fetch personas from Supabase:', err)
      }
    }
    loadPersonas()
  }, [])

  const safeCharacters = characterList || []
  const genres = ['All', ...Array.from(new Set(safeCharacters.map((c) => c.genre)))]

  // Filter characters
  const filtered = safeCharacters.filter((c) => {
    const matchesGenre = selectedGenre === 'All' || c.genre === selectedGenre
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hook.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesQuery
  })

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const paginatedCharacters = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-base text-paper flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="border-b border-divider/50 bg-base/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-paper-muted group-hover:text-brass transition-colors" strokeWidth={1.5} />
            <span className="font-mono text-xs uppercase tracking-widest text-paper-muted group-hover:text-paper transition-colors">
              Back to Home
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-brass" strokeWidth={1.5} />
            <span className="font-display text-lg font-bold text-paper">Echoes</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-paper-muted opacity-50 ml-2">
              Cast Gallery
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Page Title */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-brass/30 px-3 py-1 bg-brass/5 mb-3">
            <Drama className="w-3.5 h-3.5 text-brass" strokeWidth={1.5} />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-brass">
              Character Roster
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-paper mb-3">
            Choose Your Protagonist
          </h1>
          <p className="font-body text-sm text-paper-muted leading-relaxed mb-6">
            Select any character below to open their backstory, hear their memories, and reshape their journey in real time.
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-brass text-base font-mono text-xs px-5 py-2.5 uppercase tracking-widest font-semibold hover:bg-brass/90 transition-all duration-200 shadow-md"
          >
            <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
            <span>Add New Persona</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-divider pb-6">
          {/* Genre Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-2 sm:pb-0">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`font-mono text-xs px-3.5 py-1.5 uppercase tracking-wider transition-all whitespace-nowrap rounded-none ${
                  selectedGenre === genre
                    ? 'bg-brass text-base font-semibold'
                    : 'border border-divider text-paper-muted hover:border-brass/40 hover:text-paper'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-paper-muted absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search persona, series..."
              className="w-full bg-base-light border border-divider text-paper placeholder-paper-muted font-body text-xs pl-8 pr-3 py-2 focus:outline-none focus:border-brass transition-colors"
            />
          </div>
        </div>

        {/* Character Cards Grid */}
        {paginatedCharacters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {paginatedCharacters.map((char, index) => (
              <Link
                key={char.id}
                href={`/chat/${char.id}`}
                className="character-landing-card group block relative overflow-hidden border border-divider bg-base-light hover:border-brass/50 transition-all duration-300"
              >
                {/* Color Top Bar */}
                <div
                  className="h-1.5 w-full transition-all duration-500 group-hover:h-2"
                  style={{ backgroundColor: char.color }}
                />

                {/* Subtle Radial Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${char.color}, transparent 70%)` }}
                />

                <div className="p-7 relative z-10">
                  {/* Genre Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-paper-muted flex items-center gap-1.5">
                      <span>{GENRE_ICONS[char.genre] ?? '✦'}</span>
                      <span>{char.genre}</span>
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-divider text-brass/80">
                      Voiced Persona
                    </span>
                  </div>

                  {/* Character Name */}
                  <h2 className="font-display text-2xl font-bold text-paper leading-tight mb-1 group-hover:text-white transition-colors duration-200">
                    {char.name}
                  </h2>

                  {/* Series Name */}
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-4 opacity-90"
                    style={{ color: char.color }}
                  >
                    {char.series}
                  </p>

                  {/* Hook */}
                  <p className="font-body text-sm text-paper-muted leading-relaxed mb-6">
                    {char.hook}
                  </p>

                  {/* CTA Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-divider/40">
                    <span className="font-mono text-xs tracking-widest uppercase text-paper-muted group-hover:text-brass transition-colors duration-200">
                      Step Inside Story →
                    </span>
                    <ArrowRight className="w-4 h-4 text-paper-muted group-hover:text-brass group-hover:translate-x-1.5 transition-all duration-200" strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-divider mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-paper-muted mb-2">No characters found</p>
            <p className="font-body text-sm text-paper-muted/60">Try adjusting your search query or genre filter.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-divider pt-6 font-mono text-xs">
            <div className="text-paper-muted opacity-70">
              Showing Page <span className="text-brass font-bold">{currentPage}</span> of{' '}
              <span className="text-paper">{totalPages}</span> ({filtered.length} total)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-divider text-paper-muted hover:border-brass hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Prev</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 flex items-center justify-center transition-all ${
                        currentPage === pageNum
                          ? 'border border-brass bg-brass text-base font-bold'
                          : 'border border-divider text-paper-muted hover:border-brass/50 hover:text-paper'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-divider text-paper-muted hover:border-brass hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-divider py-6 px-6 bg-base-light">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs font-mono text-paper-muted opacity-60">
          <span>Echoes · Character Directory</span>
          <span>4 Characters per page</span>
        </div>
      </footer>

      {showAddModal && (
        <AddPersonaModal
          onClose={() => setShowAddModal(false)}
          onCreated={(newChar) => {
            setShowAddModal(false)
            setCharacterList(getAllCharacters())
            router.push(`/chat/${newChar.id}`)
          }}
        />
      )}
    </div>
  )
}
