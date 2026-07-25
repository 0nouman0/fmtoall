'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  MessageSquare,
  GitBranch,
  Volume2,
  Mic,
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export default function HowItWorksIllustration() {
  const [activeStep, setActiveStep] = useState<number>(1)

  return (
    <div className="w-full bg-base border border-divider/80 p-6 md:p-8 rounded-none shadow-2xl relative overflow-hidden text-paper font-body">
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brass via-red to-brass" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-divider/60 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-brass font-mono text-[10px] uppercase tracking-[0.2em] mb-1">
            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
            <span>Interactive Architecture Visualizer</span>
          </div>
          <h4 className="font-display text-2xl font-bold text-paper">
            How Echoes Works In Real Time
          </h4>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-base-light p-1 border border-divider">
          {[
            { num: 1, label: '1. Backstory' },
            { num: 2, label: '2. Voice Chat' },
            { num: 3, label: '3. Story Branch' },
          ].map((tab) => (
            <button
              key={tab.num}
              onClick={() => setActiveStep(tab.num)}
              className={`font-mono text-xs px-3 py-1.5 transition-all uppercase tracking-wider ${
                activeStep === tab.num
                  ? 'bg-brass text-base font-semibold shadow-sm'
                  : 'text-paper-muted hover:text-paper hover:bg-base-mid'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column HTML/CSS Mockup Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* ── COLUMN 1: Backstory Engine ── */}
        <div
          onClick={() => setActiveStep(1)}
          className={`cursor-pointer transition-all duration-300 border p-5 flex flex-col justify-between ${
            activeStep === 1
              ? 'border-brass bg-brass/10 shadow-[0_0_25px_rgba(184,134,43,0.15)] scale-[1.01]'
              : 'border-divider bg-base-light opacity-75 hover:opacity-100 hover:border-brass/40'
          }`}
        >
          <div>
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brass border border-brass/30 px-2 py-0.5 bg-brass/5">
                Phase 01 · Lore Engine
              </span>
              <BookOpen className={`w-4 h-4 ${activeStep === 1 ? 'text-brass' : 'text-paper-muted'}`} strokeWidth={1.5} />
            </div>

            <h5 className="font-display text-lg font-bold text-paper mb-2 flex items-center gap-2">
              <span>Interactive Backstory</span>
            </h5>
            <p className="text-xs text-paper-muted leading-relaxed mb-5">
              6 staggered chapters per persona. Tap any chapter to trigger TTS speech synthesis with music ducking.
            </p>

            {/* Visual UI Box */}
            <div className="bg-base border border-divider p-3.5 space-y-2.5 rounded-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                <span className="font-mono text-[10px] text-paper-muted uppercase tracking-wider">Arjun Malhotra · Crime</span>
              </div>
              <div className="p-2.5 bg-base-light border border-brass/50 text-xs font-body border-l-2 border-l-brass flex items-center justify-between">
                <div>
                  <div className="font-mono text-[9px] text-brass uppercase">Chapter I · Origin</div>
                  <div className="text-[11px] text-paper mt-0.5 line-clamp-1">Son of Vikrant Malhotra...</div>
                </div>
                <Volume2 className="w-3.5 h-3.5 text-brass animate-pulse" strokeWidth={1.5} />
              </div>
              <div className="p-2.5 bg-base-mid border border-divider text-xs font-body opacity-60">
                <div className="font-mono text-[9px] text-paper-muted uppercase">Chapter II · The Love</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-divider/40 flex items-center justify-between text-[11px] font-mono text-paper-muted">
            <span>Audio Context</span>
            <span className="text-brass">Web Audio API ♪</span>
          </div>
        </div>

        {/* ── COLUMN 2: Spoken Voice Chat ── */}
        <div
          onClick={() => setActiveStep(2)}
          className={`cursor-pointer transition-all duration-300 border p-5 flex flex-col justify-between ${
            activeStep === 2
              ? 'border-brass bg-brass/10 shadow-[0_0_25px_rgba(184,134,43,0.15)] scale-[1.01]'
              : 'border-divider bg-base-light opacity-75 hover:opacity-100 hover:border-brass/40'
          }`}
        >
          <div>
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brass border border-brass/30 px-2 py-0.5 bg-brass/5">
                Phase 02 · Voice Chat
              </span>
              <MessageSquare className={`w-4 h-4 ${activeStep === 2 ? 'text-brass' : 'text-paper-muted'}`} strokeWidth={1.5} />
            </div>

            <h5 className="font-display text-lg font-bold text-paper mb-2 flex items-center gap-2">
              <span>Spoken Persona & Suggestions</span>
            </h5>
            <p className="text-xs text-paper-muted leading-relaxed mb-5">
              Groq Llama 3.3 replies in-persona, auto-voiced. Generates 2 quick response options + speech recognition input.
            </p>

            {/* Visual UI Box */}
            <div className="bg-base border border-divider p-3.5 space-y-2.5 rounded-none">
              <div className="p-2.5 bg-base-light border-l-2 border-l-brass text-xs">
                <div className="font-mono text-[9px] text-brass uppercase flex items-center justify-between">
                  <span>Arjun</span>
                  <span className="inline-flex gap-0.5">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className="w-0.5 h-2 bg-brass animate-pulse" />
                    ))}
                  </span>
                </div>
                <div className="text-[11px] text-paper mt-1">&ldquo;What makes you think you're an exception?&rdquo;</div>
              </div>

              {/* Suggestions */}
              <div className="space-y-1 pt-1">
                <div className="p-2 bg-brass/15 border border-brass text-[10px] text-paper font-mono flex items-center justify-between">
                  <span>1. &ldquo;That sounds like Meera.&rdquo;</span>
                  <Volume2 className="w-3 h-3 text-brass" strokeWidth={1.5} />
                </div>
                <div className="p-1.5 bg-base-mid border border-divider text-[10px] text-paper-muted font-mono">
                  <span>2. &ldquo;You're afraid of yourself.&rdquo;</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-divider/40 flex items-center justify-between text-[11px] font-mono text-paper-muted">
            <span>Voice Input</span>
            <span className="text-brass flex items-center gap-1">
              <Mic className="w-3 h-3" strokeWidth={1.5} />
              <span>SpeechRecognition</span>
            </span>
          </div>
        </div>

        {/* ── COLUMN 3: Branching Tree ── */}
        <div
          onClick={() => setActiveStep(3)}
          className={`cursor-pointer transition-all duration-300 border p-5 flex flex-col justify-between ${
            activeStep === 3
              ? 'border-brass bg-brass/10 shadow-[0_0_25px_rgba(184,134,43,0.15)] scale-[1.01]'
              : 'border-divider bg-base-light opacity-75 hover:opacity-100 hover:border-brass/40'
          }`}
        >
          <div>
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brass border border-brass/30 px-2 py-0.5 bg-brass/5">
                Phase 03 · AI Dungeon
              </span>
              <GitBranch className={`w-4 h-4 ${activeStep === 3 ? 'text-brass' : 'text-paper-muted'}`} strokeWidth={1.5} />
            </div>

            <h5 className="font-display text-lg font-bold text-paper mb-2 flex items-center gap-2">
              <span>3-Beat Branching Episode</span>
            </h5>
            <p className="text-xs text-paper-muted leading-relaxed mb-5">
              Type a &ldquo;what if&rdquo; premise to construct a multi-path mini-drama with hard-cuts between decisions.
            </p>

            {/* Visual Tree Node Graph */}
            <div className="bg-base border border-divider p-3.5 rounded-none relative">
              <div className="flex flex-col items-center space-y-2 py-1">
                {/* Node 1 */}
                <div className="px-3 py-1 bg-brass text-base font-mono text-[10px] font-bold border border-brass flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Beat b1 (Start)</span>
                </div>
                {/* Connecting Lines */}
                <div className="w-px h-3 bg-brass" />
                <div className="flex items-center gap-4">
                  {/* Node b2a */}
                  <div className="px-2.5 py-1 bg-base-light border border-brass text-brass font-mono text-[9px]">
                    b2a: Investigate
                  </div>
                  {/* Node b2b */}
                  <div className="px-2.5 py-1 bg-base-light border border-divider text-paper-muted font-mono text-[9px]">
                    b2b: Confront
                  </div>
                </div>
                <div className="w-px h-3 bg-divider" />
                {/* Node b3 */}
                <div className="px-3 py-1 bg-base-mid border border-divider text-paper-muted font-mono text-[9px]">
                  b3: Climax & Resolution
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-divider/40 flex items-center justify-between text-[11px] font-mono text-paper-muted">
            <span>LLM Engine</span>
            <span className="text-brass">Groq Llama 3.3-70b</span>
          </div>
        </div>

      </div>

      {/* Interactive Workflow Explanatory Footer */}
      <div className="mt-6 pt-4 border-t border-divider/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-paper-muted">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brass" strokeWidth={1.5} />
          <span>Click any phase above to highlight its underlying subsystem architecture</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-paper">Zero Latency Pre-Generation</span>
          <span>·</span>
          <span className="text-brass">100% Client-Side Web Speech</span>
        </div>
      </div>
    </div>
  )
}
