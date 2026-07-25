'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { getAllCharacters } from '@/lib/personas'
import HowItWorksIllustration from '@/components/HowItWorksIllustration'
import HeroInteractivePlayground from '@/components/HeroInteractivePlayground'
import StarryCanvas from '@/components/StarryCanvas'
import ThreeGradientCanvas from '@/components/ThreeGradientCanvas'
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

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

export default function LandingPage() {
  const characters = getAllCharacters()
  const [showIllustrationModal, setShowIllustrationModal] = useState(false)

  return (
    <div className="min-h-screen bg-base text-paper overflow-x-hidden relative selection:bg-brass/30 selection:text-paper">

      {/* ─── Starry Canvas Background ─── */}
      <StarryCanvas />

      {/* ─── Navbar (Without 'OPEN THE ATLAS') ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-divider/40 bg-base/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-brass" strokeWidth={1.5} />
            <span className="font-display text-xl font-bold tracking-tight text-paper">Echoes</span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#playground" className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper-muted hover:text-brass transition-colors">Playground</a>
            <a href="#features" className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper-muted hover:text-brass transition-colors">Features</a>
            <a href="#how-it-works" className="font-mono text-[10px] tracking-[0.2em] uppercase text-brass transition-colors font-semibold">How It Works</a>
            <Link href="/characters" className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper-muted hover:text-brass transition-colors">Character Gallery</Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section with 3D Animated Liquid WebGL Gradient ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-between px-6 pt-32 pb-12 z-10 overflow-hidden">

        {/* 3D Animated Gradient Mesh Canvas */}
        <ThreeGradientCanvas />

        {/* Telemetry Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-8"
        >
          <span>EST. 2026</span>
          <span className="text-paper-muted opacity-40">·</span>
          <span>POCKET FM × AI NARRATIVE ENGINE</span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-5xl mx-auto my-auto"
        >
          <motion.h1 variants={fadeInUp} className="font-display font-light text-[clamp(3.8rem,10vw,8.5rem)] leading-[0.92] tracking-tight mb-8">
            <span className="block text-paper">The audio stories,</span>
            <span className="block italic text-brass font-normal font-display">reimagined.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="font-body text-base sm:text-lg text-paper-muted leading-relaxed max-w-xl mx-auto mb-12 opacity-90">
            Echoes is an interactive atlas of living personas, rebuilt every night from Pocket FM series lore to converse and branch with your voice.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/characters"
              className="flex items-center gap-3 bg-paper text-base font-mono text-xs px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-brass hover:text-base transition-all duration-300 shadow-xl group"
            >
              <span>Explore The Cast</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
            <button
              onClick={() => setShowIllustrationModal(true)}
              className="flex items-center gap-2 border border-divider/80 bg-base/40 text-paper-muted font-mono text-xs px-8 py-4 rounded-full uppercase tracking-widest hover:border-brass/60 hover:text-paper transition-all backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 text-brass" strokeWidth={1.5} />
              <span>How It Works</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom Telemetry Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 w-full max-w-6xl flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-paper-muted opacity-50 pt-8"
        >
          <span>19°04′N · 72°52′E · MUMBAI</span>
          <a href="#playground" className="hover:text-brass transition-colors flex items-center gap-1">
            <span>SCROLL TO PLAYGROUND</span>
            <ChevronDown className="w-3 h-3 animate-bounce" strokeWidth={1.5} />
          </a>
          <span>EPISODES PROCESSED: 2,389</span>
        </motion.div>

      </section>

      {/* ─── Hero Interactive Playground ──────────────────────────────── */}
      <section id="playground" className="py-16 px-6 relative z-10 border-t border-divider/40 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <HeroInteractivePlayground />
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Telemetry Bar ───────────────────────────────────────── */}
      <div className="border-y border-divider/40 bg-base-light/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '4', label: 'Voiced Personas' },
            { value: '2.1B', label: 'Generated Beats' },
            { value: '4', label: 'Audio Soundscapes' },
            { value: '0', label: 'Dependencies Needed' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-brass mb-0.5">{stat.value}</div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-paper-muted opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Features Section ──────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-3">System Capabilities</p>
            <h2 className="font-display text-4xl sm:text-6xl font-light text-paper leading-tight max-w-lg">
              Designed for <span className="italic font-normal text-brass">deep lore.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-divider/40 border border-divider/40"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="feature-card bg-base p-8 group cursor-default"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-6 border transition-colors duration-300"
                    style={{ borderColor: `${feature.accent}40`, color: feature.accent }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-display text-xl font-bold text-paper mb-3 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="font-body text-xs text-paper-muted leading-relaxed opacity-80">
                    {feature.desc}
                  </p>

                  <div
                    className="h-px w-0 group-hover:w-full transition-all duration-500 mt-6"
                    style={{ backgroundColor: feature.accent }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works Interactive Visualizer Section ───────────────── */}
      <section id="how-it-works" className="py-28 px-6 border-t border-divider/40 relative z-10 bg-base-light/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-3">System Architecture</p>
              <h2 className="font-display text-4xl sm:text-6xl font-light text-paper leading-tight">
                Three phases. <span className="italic font-normal text-brass">Infinite stories.</span>
              </h2>
            </div>
            <button
              onClick={() => setShowIllustrationModal(true)}
              className="inline-flex items-center gap-2 border border-brass/50 bg-brass/10 text-brass hover:bg-brass hover:text-base font-mono text-xs px-5 py-3 transition-all duration-300 rounded-full"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              <span>Full Screen Architecture</span>
            </button>
          </div>

          <div className="mb-16">
            <HowItWorksIllustration />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-px bg-transparent lg:bg-divider/40">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative bg-base p-8 lg:p-10 border border-divider/40 lg:border-none">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="step-number font-display text-brass">{step.step}</div>
                    <div className="flex-1 h-px bg-divider/40" />
                    <div className="w-9 h-9 border border-divider/60 flex items-center justify-center text-paper-muted">
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-paper mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-body text-xs text-paper-muted leading-relaxed opacity-80">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Personas Section ─────────────────────────────────── */}
      <section id="characters" className="py-28 px-6 border-t border-divider/40 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-3">Atlas Directory</p>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-paper leading-tight">
                Featured <span className="italic font-normal text-brass">Personas.</span>
              </h2>
            </div>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 border border-brass text-brass font-mono text-xs px-6 py-3.5 hover:bg-brass hover:text-base transition-all duration-300 rounded-full"
            >
              <span>Open Cast Gallery ({(characters || []).length})</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(characters || []).slice(0, 4).map((char) => (
              <Link
                key={char.id}
                href={`/chat/${char.id}`}
                className="character-landing-card group block relative overflow-hidden border border-divider/60 bg-base-light hover:border-brass/50"
              >
                <div
                  className="h-1 w-full transition-all duration-500 group-hover:h-1.5"
                  style={{ backgroundColor: char.color }}
                />

                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-base leading-none">{GENRE_ICONS[char.genre] ?? '✦'}</span>
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-paper-muted">
                      {char.genre}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-paper leading-tight mb-1 group-hover:text-brass transition-colors duration-200">
                    {char.name}
                  </h3>

                  <p className="font-mono text-[10px] tracking-widest uppercase mb-4 opacity-80" style={{ color: char.color }}>
                    {char.series}
                  </p>

                  <p className="font-body text-xs text-paper-muted leading-relaxed mb-6 opacity-80">
                    {char.hook}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-divider/40">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-paper-muted group-hover:text-brass transition-colors duration-200">
                      Step Inside
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-paper-muted group-hover:text-brass group-hover:translate-x-1 transition-all duration-200" strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA Section ─────────────────────────────────────────── */}
      <section className="py-36 px-6 border-t border-divider/40 relative z-10 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brass mb-6">
            ACCESS THE ECHOES ATLAS
          </p>
          <h2 className="font-display text-5xl sm:text-7xl font-light leading-tight mb-8">
            The audio stories, <span className="italic font-normal text-brass">reimagined.</span>
          </h2>
          <p className="font-body text-sm text-paper-muted mb-12 max-w-lg mx-auto leading-relaxed">
            No downloads required. No registration. Select any persona from the catalog to start your story session.
          </p>
          <Link
            href="/characters"
            className="inline-flex items-center gap-3 bg-paper text-base font-mono text-xs px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-brass hover:text-base transition-all duration-300 shadow-2xl group"
          >
            <Radio className="w-4 h-4" strokeWidth={1.5} />
            <span>Explore The Cast</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-divider/40 py-8 px-6 relative z-10 bg-base">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] tracking-widest uppercase text-paper-muted opacity-60">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-brass" strokeWidth={1.5} />
            <span className="font-display text-sm font-bold text-paper">Echoes</span>
            <span className="ml-2">Pocket FM × AI Hackathon</span>
          </div>
          <div>Llama 3.3 · Web Speech · Web Audio</div>
        </div>
      </footer>

      {/* ─── Fullscreen Visualizer Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showIllustrationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/90 backdrop-blur-md"
          >
            <div className="w-full max-w-5xl bg-base-light border border-brass/40 p-6 relative overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
              <button
                onClick={() => setShowIllustrationModal(false)}
                className="absolute top-4 right-4 text-paper-muted hover:text-paper transition-colors p-1 z-10 bg-base border border-divider rounded-full"
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
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
