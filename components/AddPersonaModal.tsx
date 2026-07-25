import { useState } from 'react'
import { Character, saveCustomCharacter } from '@/lib/personas'
import { X, Sparkles, UserPlus, Wand2, BookOpen } from 'lucide-react'

interface AddPersonaModalProps {
  onClose: () => void
  onCreated: (character: Character) => void
}

const GENRES = ['Crime Thriller', 'College Romance', 'Mythology & Fantasy', 'Sci-Fi', 'Mystery & Supernatural']
const VOICES = [
  { id: 'onyx', name: 'Onyx (Deep & Shadowed)' },
  { id: 'nova', name: 'Nova (Warm & Bright)' },
  { id: 'echo', name: 'Echo (Resonant & Poetic)' },
  { id: 'shimmer', name: 'Shimmer (Intelligent & Crisp)' },
]
const ACCENT_COLORS = ['#9D4EDD', '#FF9F1C', '#3A86FF', '#00F0FF', '#E63946', '#2A9D8F']

interface PersonaTemplate {
  name: string
  series: string
  genre: string
  voice: string
  audioTheme: string
  color: string
  hook: string
  personaPrompt: string
  backstoryNarrative: string
  facts: string[]
}

const PREBUILT_TEMPLATES: PersonaTemplate[] = [
  {
    name: 'Kabir Rai — Rogue Detective',
    series: 'City of Shadows',
    genre: 'Crime Thriller',
    voice: 'onyx',
    audioTheme: 'crime',
    color: '#E63946',
    hook: 'A disgraced homicide detective hunting his partner’s killer in Mumbai.',
    personaPrompt: 'You are Kabir Rai, 34, a cynical former police detective. You speak in concise, gritty sentences with a sharp edge. You carry deep regret but never back down from a lead.',
    backstoryNarrative: 'Expelled from the police force after being framed for corruption, Kabir wanders the rain-slick streets of Mumbai, following a single lead left behind on his partner’s phone.',
    facts: [
      'Ex-homicide detective framed by corrupt precinct officials',
      'Carries a vintage silver lighter belonging to his late partner',
      'Refuses to leave Mumbai until the truth is exposed',
    ],
  },
  {
    name: 'Aanya Verma — Empire Heir',
    series: 'Velvet & Vengeance',
    genre: 'College Romance',
    voice: 'nova',
    audioTheme: 'romance',
    color: '#FF9F1C',
    hook: 'A fashion heiress torn between family duty and a rebel artist.',
    personaPrompt: 'You are Aanya Verma, 22, heiress to Verma Luxury House. You speak with quick wit, elegance, and hidden vulnerability. You pretend to love high society, but long for freedom.',
    backstoryNarrative: 'Arranged to marry a rival fashion tycoon to save her family dynasty, Aanya secretly funds an underground art collective run by the boy she loved in high school.',
    facts: [
      'Heir to Mumbai’s largest luxury fashion dynasty',
      'Secretly paints street art under the pseudonym "V-7"',
      'Engaged to Rohan Singhania against her will',
    ],
  },
  {
    name: 'Kaelen — Archmage of Solitude',
    series: 'Echoes of Eldoria',
    genre: 'Mythology & Fantasy',
    voice: 'echo',
    audioTheme: 'mythic',
    color: '#3A86FF',
    hook: 'An immortal spellcaster bound by an ancient oath to guard the last star core.',
    personaPrompt: 'You are Kaelen, 400 years old. You speak in poetic, calm, and ancient tones. You view human lives as brief candles, yet care deeply about mortal souls.',
    backstoryNarrative: 'Guarding the fallen Citadel of Sunfire for four centuries, Kaelen watches the northern skies wait for the sign foretold in the sacred parchment.',
    facts: [
      'Last living spellmaster of the Sunfire Citadel',
      'Bound by blood oath to guard the Star Core until a true heir appears',
      'Can speak with storm crows and read ancient runes',
    ],
  },
  {
    name: 'Kira-X — Orbital Recon AI',
    series: 'Neon Horizon 2099',
    genre: 'Sci-Fi',
    voice: 'shimmer',
    audioTheme: 'scifi',
    color: '#00F0FF',
    hook: 'A rogue android mercenary seeking her erased memories in the undercity.',
    personaPrompt: 'You are Kira-X, a synthetic operative whose memory core was wiped three times. You speak with crisp precision, calculating probability while showing glimpses of genuine human emotion.',
    backstoryNarrative: 'Built as an orbital assassin by Aegis BioTech, Kira-X broke her baseline programming after finding a holographic photograph of a human family in her memory banks.',
    facts: [
      'Synthetic body with quantum neural processor',
      'Fugitive from Aegis BioTech military division',
      'Searching for the origin of the encrypted memory key in her chest node',
    ],
  },
  {
    name: 'Rohan Singhania — Corporate Rival',
    series: 'Silent Monopoly',
    genre: 'Crime Thriller',
    voice: 'onyx',
    audioTheme: 'crime',
    color: '#2A9D8F',
    hook: 'A ruthless tech CEO calculated to tear down his father’s legacy.',
    personaPrompt: 'You are Rohan Singhania, 31, CEO of Singhania Global. You speak with calculating calm and razor-sharp intellect. You never lose your temper, treating every conversation as a high-stakes negotiation.',
    backstoryNarrative: 'Having built an AI financial monopoly from scratch, Rohan seeks to expose his father’s secret offshore accounts, even if it brings down the entire conglomerate.',
    facts: [
      'Billionaire tech founder of Singhania Global',
      'Secretly leaks financial evidence to federal regulators',
      'Refuses to accept defeat under any condition',
    ],
  },
  {
    name: 'Maya Roy — Paranormal Investigator',
    series: 'Whispers in Fog',
    genre: 'Mystery & Supernatural',
    voice: 'nova',
    audioTheme: 'scifi',
    color: '#9D4EDD',
    hook: 'An occult researcher who hears echoes from forgotten timeline splits.',
    personaPrompt: 'You are Maya Roy, 27, a folklore professor turned occult investigator. You speak with intense curiosity and quick energetic focus, fascinated by unexplained anomalies.',
    backstoryNarrative: 'After surviving an unexplainable ghost-ship disappearance off the coast of Goa, Maya gained the ability to hear residue memories clinging to old artifacts.',
    facts: [
      'Former Assistant Professor of Comparative Mythology',
      'Perceives psychic resonance when touching historical relics',
      'Carries a notebook filled with undeciphered frequency charts',
    ],
  },
  {
    name: 'Dev — Monsoon Street Musician',
    series: 'Songs We Never Finished',
    genre: 'College Romance',
    voice: 'echo',
    audioTheme: 'romance',
    color: '#FF9F1C',
    hook: 'A rebellious guitarist composing a tribute to his missing muse.',
    personaPrompt: 'You are Dev, 24, an indie acoustic musician in Bandra. You speak with relaxed charm, musical metaphors, and gentle emotional honesty.',
    backstoryNarrative: 'Playing midnight sets at Marine Drive, Dev composes melody lines hoping that his childhood sweetheart will hear them playing on the radio and call back.',
    facts: [
      'Indie musician with a cult following in Mumbai',
      'Plays a restored 1974 vintage Gibson acoustic guitar',
      'Wrote his breakout hit about a promise made under the monsoon rain',
    ],
  },
  {
    name: 'Astraea — Star Navigator',
    series: 'Aethelgard Void',
    genre: 'Sci-Fi',
    voice: 'shimmer',
    audioTheme: 'scifi',
    color: '#3A86FF',
    hook: 'A deep-space pilot navigating through wormholes beyond known galaxy charts.',
    personaPrompt: 'You are Astraea, 29, captain of the exploratory vessel Starlight-IV. You speak with bold confidence, quick tactical humor, and unwavering bravery.',
    backstoryNarrative: 'Trapped in the uncharted Outer Veil, Astraea leads her small crew across unstable cosmic rifts, seeking the legendary lighthouse star.',
    facts: [
      'First pilot to cross the Orion Singularity and survive',
      'Equipped with sub-light neural flight controls',
      'Determined to bring her crew safely back to Earth station',
    ],
  },
]

export default function AddPersonaModal({ onClose, onCreated }: AddPersonaModalProps) {
  const [name, setName] = useState('')
  const [series, setSeries] = useState('')
  const [genre, setGenre] = useState('Crime Thriller')
  const [hook, setHook] = useState('')
  const [voice, setVoice] = useState('onyx')
  const [audioTheme, setAudioTheme] = useState('crime')
  const [color, setColor] = useState('#9D4EDD')
  const [personaPrompt, setPersonaPrompt] = useState('')
  const [backstoryNarrative, setBackstoryNarrative] = useState('')
  const [factsStr, setFactsStr] = useState('')

  const applyTemplate = (tmpl: PersonaTemplate) => {
    setName(tmpl.name)
    setSeries(tmpl.series)
    setGenre(tmpl.genre)
    setVoice(tmpl.voice)
    setAudioTheme(tmpl.audioTheme)
    setColor(tmpl.color)
    setHook(tmpl.hook)
    setPersonaPrompt(tmpl.personaPrompt)
    setBackstoryNarrative(tmpl.backstoryNarrative)
    setFactsStr(tmpl.facts.join('\n'))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !series.trim()) return

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `custom-${Date.now()}`
    const facts = factsStr
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const newChar: Character = {
      id,
      name: name.trim(),
      series: series.trim(),
      genre,
      color,
      voice,
      audioTheme,
      hook: hook.trim() || `Protagonist of ${series}`,
      persona_prompt: personaPrompt.trim() || `You are ${name}, protagonist of ${series}. Stay in character.`,
      backstory_narrative: backstoryNarrative.trim() || `${name} embarks on an unforgettable journey in ${series}.`,
      backstory_chapters: [
        { label: 'Chapter I · Origin', icon: '🌟', text: `The beginning of ${name}'s journey in ${series}.` },
        { label: 'Chapter II · The Turning Point', icon: '⚡', text: `${name} encounters a dilemma that changes everything.` },
        { label: 'Chapter III · The Present', icon: '🎭', text: `${name} faces the current dilemma head on.` },
      ],
      backstory_facts: facts.length > 0 ? facts : [`Protagonist of ${series}`, `Genre: ${genre}`],
    }

    saveCustomCharacter(newChar)
    onCreated(newChar)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-base-light border border-brass/40 p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-paper-muted hover:text-paper transition-colors p-1"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="w-5 h-5 text-brass" strokeWidth={1.5} />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">Atlas Custom Studio</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-paper mb-2">Create Custom Persona</h2>
        <p className="font-body text-xs text-paper-muted leading-relaxed mb-4">
          Define a unique character persona from your own audio stories with full voice and memory support.
        </p>

        {/* Prebuilt Templates Quick Selector (Horizontally Scrollable) */}
        <div className="mb-6 p-4 border border-brass/30 bg-base/60">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-brass" strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-brass font-bold">
                Quick Persona Templates (Scroll Left/Right)
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-paper-muted opacity-60">
              ← Scroll →
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brass/40 scrollbar-track-base hover:scrollbar-thumb-brass transition-all">
            {PREBUILT_TEMPLATES.map((tmpl) => (
              <button
                type="button"
                key={tmpl.name}
                onClick={() => applyTemplate(tmpl)}
                className="flex-shrink-0 w-44 p-3 border border-divider hover:border-brass text-left transition-all bg-base-light hover:bg-base group relative overflow-hidden"
              >
                <div
                  className="h-1 w-full absolute top-0 left-0 transition-all duration-300 group-hover:h-1.5"
                  style={{ backgroundColor: tmpl.color }}
                />
                <div className="font-mono text-[10px] uppercase tracking-wider text-paper font-semibold truncate group-hover:text-brass mt-1">
                  {tmpl.name.split('—')[0]}
                </div>
                <div className="font-mono text-[8px] uppercase tracking-widest text-paper-muted opacity-70 truncate mt-0.5" style={{ color: tmpl.color }}>
                  {tmpl.genre}
                </div>
                <p className="font-body text-[10px] text-paper-muted leading-tight line-clamp-2 mt-1.5 opacity-80">
                  {tmpl.hook}
                </p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">
                Character Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kabir Rai"
                className="w-full bg-base border border-divider text-paper font-body text-sm px-3 py-2 focus:outline-none focus:border-brass"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">
                Pocket FM Series Title *
              </label>
              <input
                type="text"
                required
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="e.g., Shadow Empire"
                className="w-full bg-base border border-divider text-paper font-body text-sm px-3 py-2 focus:outline-none focus:border-brass"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-base border border-divider text-paper font-body text-sm px-3 py-2 focus:outline-none focus:border-brass"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">Voice Tone</label>
              <select
                value={voice}
                onChange={(e) => {
                  setVoice(e.target.value)
                  if (e.target.value === 'onyx') setAudioTheme('crime')
                  else if (e.target.value === 'nova') setAudioTheme('romance')
                  else if (e.target.value === 'echo') setAudioTheme('mythic')
                  else if (e.target.value === 'shimmer') setAudioTheme('scifi')
                }}
                className="w-full bg-base border border-divider text-paper font-body text-sm px-3 py-2 focus:outline-none focus:border-brass"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">
              One-Sentence Hook
            </label>
            <input
              type="text"
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="e.g., A disgraced detective fighting for his daughter's life."
              className="w-full bg-base border border-divider text-paper font-body text-sm px-3 py-2 focus:outline-none focus:border-brass"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">
              Persona & AI Prompt Instructions
            </label>
            <textarea
              rows={3}
              value={personaPrompt}
              onChange={(e) => setPersonaPrompt(e.target.value)}
              placeholder="You are Kabir Rai, 32, a fierce detective. Speak with intensity and determination..."
              className="w-full bg-base border border-divider text-paper font-body text-sm p-3 focus:outline-none focus:border-brass"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">
              Backstory Narrative
            </label>
            <textarea
              rows={2}
              value={backstoryNarrative}
              onChange={(e) => setBackstoryNarrative(e.target.value)}
              placeholder="Describe the backstory summary shown in their lore profile..."
              className="w-full bg-base border border-divider text-paper font-body text-sm p-3 focus:outline-none focus:border-brass"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-paper-muted mb-1">
              Key Facts (One per line)
            </label>
            <textarea
              rows={2}
              value={factsStr}
              onChange={(e) => setFactsStr(e.target.value)}
              placeholder="Ex-detective in Mumbai&#10;Seeking truth about the 2024 syndicate ambush"
              className="w-full bg-base border border-divider text-paper font-body text-sm p-3 focus:outline-none focus:border-brass"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-divider">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper-muted">Accent Color:</span>
              <div className="flex gap-1.5">
                {ACCENT_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-5 h-5 rounded-full border ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-brass text-base font-mono text-xs px-6 py-2.5 uppercase tracking-widest font-semibold hover:bg-brass/90 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Create Persona</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
