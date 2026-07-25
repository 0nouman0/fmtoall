'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAllCharacters } from '@/lib/personas'
import HowItWorksIllustration from '@/components/HowItWorksIllustration'
import {
  Mic,
  GitBranch,
  Music2,
  Headphones,
  ArrowRight,
  ChevronDown,
  Radio,
  Sparkles,
  Drama,
  Play,
  BookOpen,
  MessageCircle,
  Zap,
  X,
  Eye,
  Users,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Drama,
    title: 'Character Resurrection',
    desc: 'Every Pocket FM character comes alive with full memory, backstory, and a voice — ready to talk.',
    accent: '#7A2E2E',
  },
  {
    icon: GitBranch,
    title: 'Branching Episodes',
    desc: 'Trigger a "what if" moment and watch the story branch in real time across three voiced beats.',
    accent: '#B8862B',
  },
  {
    icon: Mic,
    title: 'Voice Interaction',
    desc: 'Speak your questions aloud. Characters reply in voice. Or tap a pre-built answer to hear yourself speak.',
    accent: '#2E6B7A',
  },
  {
    icon: Music2,
    title: 'Adaptive Music',
    desc: 'Procedural ambient soundscapes generated live — crime drones, romance chords, mythic harmonics, sci-fi pulses.',
    accent: '#2E4A7A',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: BookOpen,
    title: 'Read their story',
    desc: 'Pick a character and explore their backstory — six cinematic chapters that set the scene. Tap any chapter to hear it spoken.',
  },
  {
    step: '02',
    icon: MessageCircle,
    title: 'Talk to them',
    desc: 'The character greets you in-persona. Ask anything. Get voiced replies. When they ask a question, choose from AI-generated answers — or speak your own.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Reshape what happens next',
    desc: 'Hit "What if...?" and type a premise. The app generates a voiced, branching mini-episode — and you decide how it ends.',
  },
]

const GENRE_ICONS: Record<string, string> = {
  'Crime Thriller':      '🎭',
  'College Romance':     '💌',
  'Mythology & Fantasy': '⚡',
  'Sci-Fi':             '🛰️',
}

export default function LandingPage() {
  const characters = getAllCharacters()
  const [showIllustrationModal, setShowIllustrationModal] = useState(false)

  return (
    <div className="min-h-screen bg-base text-paper overflow-x-hidden">

      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-divider/50 bg-base/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-brass" strokeWidth={1.5} />
            <span className="font-display text-lg font-bold text-paper">Echoes</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="font-mono text-[10px] tracking-widest uppercase text-paper-muted hover:text-brass transition-colors">Features</a>
            <a href="#how-it-works" className="font-mono text-[10px] tracking-widest uppercase text-paper-muted hover:text-brass transition-colors">How It Works</a>
            <Link href="/characters" className="font-mono text-[10px] tracking-widest uppercase text-paper-muted hover:text-brass transition-colors">Character Gallery</Link>
          </div>
          <Link
            href="/characters"
            className="flex items-center gap-2 bg-brass text-base font-mono text-xs px-4 py-2 hover:bg-paper transition-colors duration-200"
          >
            <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="uppercase tracking-widest">Choose Character</span>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="hero-glow" />
        <div className="scanlines opacity-30" />

        <div className="absolute left-0 top-1/4 w-px h-40 bg-gradient-to-b from-transparent via-brass/30 to-transparent hidden lg:block" />
        <div className="absolute right-0 top-1/3 w-px h-56 bg-gradient-to-b from-transparent via-divider to-transparent hidden lg:block" />

        <div className="relative z-10 mb-6 flex items-center gap-2 border border-brass/30 px-4 py-1.5 bg-brass/5">
          <Sparkles className="w-3 h-3 text-brass" strokeWidth={1.5} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-brass">
            Pocket FM × AI Hackathon
          </span>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="font-display font-black leading-[0.9] tracking-tight mb-6">
            <span className="block text-[clamp(3.5rem,12vw,8rem)] text-paper">Step Inside</span>
            <span className="block text-[clamp(3.5rem,12vw,8rem)] gradient-text italic font-light">the Story.</span>
          </h1>

          <p className="font-body text-lg text-paper-muted leading-relaxed max-w-xl mx-auto mb-10">
            Talk directly to any character from your favourite Pocket FM series.
            Then reshape what happens next — live, in real time, with your voice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/characters"
              className="flex items-center gap-3 bg-brass text-base font-body font-semibold text-sm px-8 py-4 hover:bg-paper transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
            >
              <span>Choose Your Character</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
            </Link>
            <button
              onClick={() => setShowIllustrationModal(true)}
              className="flex items-center gap-2 border border-divider text-paper-muted font-body text-sm px-8 py-4 hover:border-brass/50 hover:text-paper transition-colors duration-200 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-brass/80" strokeWidth={1.5} />
              <span>See How It Works</span>
            </button>
          </div>

          <div className="flex items-end justify-center gap-1 h-12 opacity-40">
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [12, 18, 28, 22, 36, 28, 18, 32, 24, 16, 38, 28, 20, 34, 26, 18, 30, 22, 16, 28, 20, 14, 24, 18]
              return (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{
                    height: `${heights[i]}px`,
                    animation: `waveform ${0.5 + (i % 5) * 0.15}s ease-in-out ${i * 40}ms infinite alternate`,
                    opacity: 0.5 + (i % 3) * 0.2,
                  }}
                />
              )
            })}
          </div>
        </div>

        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-paper-muted hover:text-brass transition-colors group"
        >
          <span className="font-mono text-[9px] tracking-widest uppercase opacity-50">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce opacity-50" strokeWidth={1.5} />
        </a>
      </section>

      {/* ─── Stats bar ──────────────────────────────────────────────────── */}
      <div className="border-y border-divider bg-base-light">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '4', label: 'Voiced Characters' },
            { value: '∞', label: 'Story Branches' },
            { value: '4', label: 'Music Themes' },
            { value: '0', label: 'Files Needed' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-brass mb-0.5">{stat.value}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-paper-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-3">What it does</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-paper leading-tight max-w-md">
              Four ideas.
              <span className="italic font-light text-paper-muted"> One demo.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-divider">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="feature-card bg-base-light p-6 group cursor-default"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-5 border transition-colors duration-300"
                    style={{ borderColor: `${feature.accent}40`, color: feature.accent }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-display text-xl font-bold text-paper mb-2 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="font-body text-sm text-paper-muted leading-relaxed">
                    {feature.desc}
                  </p>

                  <div
                    className="h-px w-0 group-hover:w-full transition-all duration-500 mt-5"
                    style={{ backgroundColor: feature.accent }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works (Includes HTML/CSS Illustration directly) ───────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-divider">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-3">The experience</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-paper leading-tight">
                Three steps.
                <span className="italic font-light text-paper-muted"> Infinite stories.</span>
              </h2>
            </div>
            <button
              onClick={() => setShowIllustrationModal(true)}
              className="inline-flex items-center gap-2 border border-brass/50 bg-brass/10 text-brass hover:bg-brass hover:text-base font-mono text-xs px-4 py-2.5 transition-all duration-200 self-start md:self-auto"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              <span>Expand Interactive Visualizer</span>
            </button>
          </div>

          {/* HTML & CSS Interactive Illustration Component */}
          <div className="mb-12">
            <HowItWorksIllustration />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-px bg-transparent lg:bg-divider">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative bg-base p-8 lg:p-10 border border-divider lg:border-none">
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-[52px] right-0 w-px h-6 bg-brass/20 translate-x-px z-10" />
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className="step-number font-display">{step.step}</div>
                    <div className="flex-1 h-px bg-divider" />
                    <div className="w-9 h-9 border border-divider flex items-center justify-center text-paper-muted">
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-paper mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-paper-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Preview ────────────────────────────────────────────── */}
      <section id="characters" className="py-24 px-6 border-t border-divider scroll-mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-3">The Cast</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-paper leading-tight">
                Featured Personas.
              </h2>
            </div>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 border border-brass text-brass font-mono text-xs px-5 py-3 hover:bg-brass hover:text-base transition-all duration-200"
            >
              <span>Open Full Character Directory ({characters.length})</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {characters.slice(0, 4).map((char) => (
              <Link
                key={char.id}
                href={`/chat/${char.id}`}
                className="character-landing-card group block relative overflow-hidden border border-divider bg-base-light hover:border-brass/40"
              >
                <div
                  className="h-1 w-full transition-all duration-500 group-hover:h-1.5"
                  style={{ backgroundColor: char.color }}
                />

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${char.color}, transparent 70%)` }}
                />

                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-base leading-none">{GENRE_ICONS[char.genre] ?? '✦'}</span>
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-paper-muted">
                      {char.genre}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-paper leading-tight mb-1 group-hover:text-white transition-colors duration-200">
                    {char.name}
                  </h3>

                  <p className="font-mono text-[10px] tracking-widest uppercase mb-4 opacity-80"
                    style={{ color: char.color }}>
                    {char.series}
                  </p>

                  <p className="font-body text-xs text-paper-muted leading-relaxed mb-5">
                    {char.hook}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-divider/40">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-paper-muted group-hover:text-brass transition-colors duration-200">
                      Step Inside
                    </span>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-paper-muted group-hover:text-brass group-hover:translate-x-1 transition-all duration-200"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tech Strip ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-divider bg-base-light">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[10px] tracking-widest uppercase text-paper-muted text-center mb-8 opacity-50">
            Powered by open-source & browser-native technology
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { icon: Zap,       label: 'Llama 3.3-70b (Groq)',   sub: 'Language Model' },
              { icon: Mic,       label: 'Web Speech API',          sub: 'Voice Input & TTS' },
              { icon: Music2,    label: 'Web Audio API',           sub: 'Ambient Music' },
              { icon: Headphones,label: 'Next.js 16',              sub: 'App Framework' },
              { icon: Radio,     label: 'Tailwind CSS v3',         sub: 'Styling' },
            ].map((tech) => {
              const Icon = tech.icon
              return (
                <div key={tech.label} className="flex items-center gap-2.5 text-paper-muted hover:text-paper transition-colors group">
                  <Icon className="w-3.5 h-3.5 text-brass opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  <div>
                    <div className="font-mono text-[10px] tracking-wide">{tech.label}</div>
                    <div className="font-mono text-[9px] text-paper-muted opacity-50 uppercase tracking-widest">{tech.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-divider relative overflow-hidden">
        <div className="hero-glow opacity-60" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-6 opacity-70">
            Ready?
          </p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold leading-tight mb-6">
            Every story has a version
            <span className="italic font-light text-paper-muted"> where you were there.</span>
          </h2>
          <p className="font-body text-paper-muted mb-12 leading-relaxed">
            No setup. No accounts. Open the character gallery and step inside.
          </p>
          <Link
            href="/characters"
            className="inline-flex items-center gap-3 bg-brass text-base font-body font-semibold px-10 py-5 text-base hover:bg-paper transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
          >
            <Radio className="w-4 h-4" strokeWidth={1.5} />
            <span>Open Character Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-divider py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-brass" strokeWidth={1.5} />
            <span className="font-display text-base font-bold text-paper">Echoes</span>
            <span className="font-mono text-[9px] text-paper-muted opacity-50 ml-2">
              Pocket FM × AI Hackathon
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/characters" className="font-mono text-[9px] tracking-widest uppercase text-paper-muted hover:text-brass transition-colors">
              Character Directory
            </Link>
          </div>
          <p className="font-mono text-[9px] text-paper-muted opacity-40 tracking-wide">
            Llama 3.3 · Web Speech · Web Audio
          </p>
        </div>
      </footer>

      {/* ─── How It Works Illustration Modal ────────────────────────────── */}
      {showIllustrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-5xl bg-base-light border border-brass/40 p-6 relative overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
            <button
              onClick={() => setShowIllustrationModal(false)}
              className="absolute top-4 right-4 text-paper-muted hover:text-paper transition-colors p-1 z-10 bg-base/80 border border-divider rounded-full"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <div className="mb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-brass">
                System Architecture & Experience Flow
              </span>
              <h3 className="font-display text-2xl font-bold text-paper">
                How Echoes Works Under The Hood
              </h3>
            </div>

            <div className="overflow-y-auto pr-1">
              <HowItWorksIllustration />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
