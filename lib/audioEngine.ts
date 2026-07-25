/**
 * AudioEngine — procedural ambient soundscapes via Web Audio API.
 * Refined for pleasant, smooth, warm harmonic ambiance across all personas.
 */

export type AudioTheme = 'crime' | 'romance' | 'mythic' | 'scifi'

interface OscConfig {
  freq: number
  type: OscillatorType
  gain: number
  lfoRate?: number
  lfoDepth?: number
}

interface ThemeConfig {
  masterGain: number
  oscs: OscConfig[]
  filterFreq: number
  hasNoise: boolean
  noiseGain: number
  hasPulse: boolean
}

const THEMES: Record<AudioTheme, ThemeConfig> = {
  crime: {
    // Warm, mysterious low ambient pad with smooth fifths
    masterGain: 0.30,
    filterFreq: 450,
    hasNoise: true,
    noiseGain: 0.02,
    hasPulse: false,
    oscs: [
      { freq: 65.41,  type: 'sine', gain: 0.55, lfoRate: 0.05, lfoDepth: 0.15 }, // C2
      { freq: 98.00,  type: 'sine', gain: 0.35, lfoRate: 0.04, lfoDepth: 0.10 }, // G2 (5th)
      { freq: 130.81, type: 'sine', gain: 0.25, lfoRate: 0.07, lfoDepth: 0.08 }, // C3
      { freq: 155.56, type: 'sine', gain: 0.15, lfoRate: 0.06, lfoDepth: 0.05 }, // Eb3 (minor 3rd)
    ],
  },
  romance: {
    // Lush, pleasant, soothing warm major chord pad
    masterGain: 0.28,
    filterFreq: 1200,
    hasNoise: false,
    noiseGain: 0,
    hasPulse: false,
    oscs: [
      { freq: 130.81, type: 'sine', gain: 0.40, lfoRate: 0.08, lfoDepth: 0.10 }, // C3 root
      { freq: 164.81, type: 'sine', gain: 0.35, lfoRate: 0.06, lfoDepth: 0.08 }, // E3 major 3rd
      { freq: 196.00, type: 'sine', gain: 0.30, lfoRate: 0.05, lfoDepth: 0.07 }, // G3 5th
      { freq: 246.94, type: 'sine', gain: 0.20, lfoRate: 0.09, lfoDepth: 0.05 }, // B3 maj 7th
      { freq: 261.63, type: 'sine', gain: 0.15, lfoRate: 0.11, lfoDepth: 0.04 }, // C4
    ],
  },
  mythic: {
    // Ancient, serene, ethereal temple pad
    masterGain: 0.32,
    filterFreq: 550,
    hasNoise: false,
    noiseGain: 0,
    hasPulse: false,
    oscs: [
      { freq: 110.00, type: 'sine', gain: 0.50, lfoRate: 0.03, lfoDepth: 0.18 }, // A2
      { freq: 164.81, type: 'sine', gain: 0.35, lfoRate: 0.04, lfoDepth: 0.12 }, // E3 (5th)
      { freq: 220.00, type: 'sine', gain: 0.25, lfoRate: 0.05, lfoDepth: 0.08 }, // A3
      { freq: 277.18, type: 'sine', gain: 0.18, lfoRate: 0.07, lfoDepth: 0.06 }, // C#4 (maj 3rd)
    ],
  },
  scifi: {
    // Soft, soothing, shimmering deep space drone
    masterGain: 0.25,
    filterFreq: 900,
    hasNoise: true,
    noiseGain: 0.03,
    hasPulse: false,
    oscs: [
      { freq: 146.83, type: 'sine', gain: 0.40, lfoRate: 0.10, lfoDepth: 0.12 }, // D3
      { freq: 220.00, type: 'sine', gain: 0.30, lfoRate: 0.15, lfoDepth: 0.09 }, // A3
      { freq: 293.66, type: 'sine', gain: 0.20, lfoRate: 0.20, lfoDepth: 0.06 }, // D4
      { freq: 440.00, type: 'sine', gain: 0.10, lfoRate: 0.25, lfoDepth: 0.03 }, // A4
    ],
  },
}

type AudioCtxType = typeof AudioContext

export class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGainNode: GainNode | null = null
  private allNodes: (AudioNode | OscillatorNode | AudioBufferSourceNode)[] = []
  private currentTheme: AudioTheme | null = null
  private _volume = 1

  private async getReadyCtx(): Promise<AudioContext> {
    const AC: AudioCtxType =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: AudioCtxType }).webkitAudioContext!

    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AC()
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
    return this.ctx
  }

  async play(theme: AudioTheme, fadeInSec = 2.5): Promise<void> {
    if (typeof window === 'undefined') return
    if (this.currentTheme === theme) return

    if (this.currentTheme !== null) {
      await this.stop(800)
    }

    this.currentTheme = theme
    const config = THEMES[theme]

    let ctx: AudioContext
    try {
      ctx = await this.getReadyCtx()
    } catch (err) {
      console.warn('[AudioEngine] Could not create/resume AudioContext:', err)
      return
    }

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.001, ctx.currentTime)
    master.gain.linearRampToValueAtTime(
      config.masterGain * this._volume,
      ctx.currentTime + fadeInSec
    )
    master.connect(ctx.destination)
    this.masterGainNode = master
    this.allNodes = [master]

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = config.filterFreq
    filter.Q.value = 0.7
    filter.connect(master)
    this.allNodes.push(filter)

    for (const osc of config.oscs) {
      const o = ctx.createOscillator()
      o.type = osc.type
      o.frequency.value = osc.freq

      const g = ctx.createGain()
      g.gain.value = osc.gain

      o.connect(g)
      g.connect(filter)
      o.start()
      this.allNodes.push(o, g)

      if (osc.lfoRate && osc.lfoDepth) {
        const lfo = ctx.createOscillator()
        const lfoG = ctx.createGain()
        lfo.type = 'sine'
        lfo.frequency.value = osc.lfoRate
        lfoG.gain.value = osc.lfoDepth * osc.gain
        lfo.connect(lfoG)
        lfoG.connect(g.gain)
        lfo.start()
        this.allNodes.push(lfo, lfoG)
      }
    }

    if (config.hasNoise && config.noiseGain > 0) {
      try {
        const bufLen = ctx.sampleRate * 2
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1

        const ns = ctx.createBufferSource()
        ns.buffer = buf
        ns.loop = true

        const nf = ctx.createBiquadFilter()
        nf.type = 'lowpass'
        nf.frequency.value = config.filterFreq * 0.3

        const ng = ctx.createGain()
        ng.gain.value = config.noiseGain

        ns.connect(nf)
        nf.connect(ng)
        ng.connect(master)
        ns.start()
        this.allNodes.push(ns, nf, ng)
      } catch { /* ignore */ }
    }
  }

  async stop(fadeOutMs = 1400): Promise<void> {
    if (!this.masterGainNode || !this.ctx) {
      this.currentTheme = null
      return
    }

    const master = this.masterGainNode
    const nodes = [...this.allNodes]
    const ctx = this.ctx
    this.currentTheme = null
    this.masterGainNode = null
    this.allNodes = []

    try {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fadeOutMs / 1000)
    } catch { /* ignore */ }

    await new Promise<void>((r) => setTimeout(r, fadeOutMs + 80))

    for (const node of nodes) {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) node.stop()
        node.disconnect()
      } catch { /* ignore */ }
    }
  }

  setVolume(fraction: number, rampMs = 500): void {
    this._volume = fraction
    if (!this.masterGainNode || !this.ctx) return
    const config = this.currentTheme ? THEMES[this.currentTheme] : null
    const target = config ? config.masterGain * fraction : fraction * 0.3
    try {
      this.masterGainNode.gain.linearRampToValueAtTime(
        Math.max(0.0001, target),
        this.ctx.currentTime + rampMs / 1000
      )
    } catch { /* ignore */ }
  }

  isPlaying(): boolean {
    return this.currentTheme !== null && this.ctx?.state === 'running'
  }

  getTheme(): AudioTheme | null {
    return this.currentTheme
  }
}

let _instance: AudioEngine | null = null
export function getAudioEngine(): AudioEngine {
  if (!_instance) _instance = new AudioEngine()
  return _instance
}
