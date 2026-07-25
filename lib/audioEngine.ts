/**
 * AudioEngine — procedural ambient soundscapes via Web Audio API.
 * IMPORTANT: play() MUST be called from a direct user gesture handler
 * (click / tap / keydown) — never from useEffect or setTimeout.
 * Browsers block AudioContext creation/resume outside user gestures.
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
    masterGain: 0.35,
    filterFreq: 500,
    hasNoise: true,
    noiseGain: 0.06,
    hasPulse: false,
    oscs: [
      { freq: 55,   type: 'sine',     gain: 0.6,  lfoRate: 0.08, lfoDepth: 0.2 },
      { freq: 82.5, type: 'sine',     gain: 0.35, lfoRate: 0.05, lfoDepth: 0.12 },
      { freq: 110,  type: 'triangle', gain: 0.2,  lfoRate: 0.13, lfoDepth: 0.1 },
    ],
  },
  romance: {
    masterGain: 0.3,
    filterFreq: 1500,
    hasNoise: false,
    noiseGain: 0,
    hasPulse: false,
    oscs: [
      { freq: 261.63, type: 'sine', gain: 0.45, lfoRate: 0.1,  lfoDepth: 0.12 },
      { freq: 329.63, type: 'sine', gain: 0.32, lfoRate: 0.08, lfoDepth: 0.09 },
      { freq: 392,    type: 'sine', gain: 0.25, lfoRate: 0.06, lfoDepth: 0.08 },
      { freq: 523.25, type: 'sine', gain: 0.12, lfoRate: 0.12, lfoDepth: 0.05 },
    ],
  },
  mythic: {
    masterGain: 0.38,
    filterFreq: 600,
    hasNoise: true,
    noiseGain: 0.04,
    hasPulse: false,
    oscs: [
      { freq: 55,  type: 'sine',     gain: 0.55, lfoRate: 0.04, lfoDepth: 0.22 },
      { freq: 110, type: 'sine',     gain: 0.38, lfoRate: 0.03, lfoDepth: 0.16 },
      { freq: 165, type: 'triangle', gain: 0.22, lfoRate: 0.05, lfoDepth: 0.1 },
      { freq: 220, type: 'sine',     gain: 0.1,  lfoRate: 0.07, lfoDepth: 0.06 },
    ],
  },
  scifi: {
    masterGain: 0.28,
    filterFreq: 1200,
    hasNoise: true,
    noiseGain: 0.08,
    hasPulse: true,
    oscs: [
      { freq: 220, type: 'sine', gain: 0.3,  lfoRate: 0.18, lfoDepth: 0.18 },
      { freq: 440, type: 'sine', gain: 0.15, lfoRate: 0.28, lfoDepth: 0.1 },
      { freq: 880, type: 'sine', gain: 0.05, lfoRate: 0.45, lfoDepth: 0.04 },
    ],
  },
}

type AudioCtxType = typeof AudioContext

export class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGainNode: GainNode | null = null
  private allNodes: (AudioNode | OscillatorNode | AudioBufferSourceNode)[] = []
  private currentTheme: AudioTheme | null = null
  private pulseTimer: ReturnType<typeof setInterval> | null = null
  private _volume = 1

  /** Must be called from a user gesture. Creates + resumes AudioContext. */
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

  /** Call this ONLY from a click/tap handler. */
  async play(theme: AudioTheme, fadeInSec = 2.5): Promise<void> {
    if (typeof window === 'undefined') return
    if (this.currentTheme === theme) return // already playing this theme

    // Fade out any existing audio
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

    // Master gain (fades in)
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.001, ctx.currentTime)
    master.gain.linearRampToValueAtTime(
      config.masterGain * this._volume,
      ctx.currentTime + fadeInSec
    )
    master.connect(ctx.destination)
    this.masterGainNode = master
    this.allNodes = [master]

    // Low-pass filter on master bus
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = config.filterFreq
    filter.Q.value = 0.8
    filter.connect(master)
    this.allNodes.push(filter)

    // Oscillators
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

      // LFO tremolo
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

    // Noise layer
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
        nf.frequency.value = config.filterFreq * 0.4

        const ng = ctx.createGain()
        ng.gain.value = config.noiseGain

        ns.connect(nf)
        nf.connect(ng)
        ng.connect(master)
        ns.start()
        this.allNodes.push(ns, nf, ng)
      } catch {
        // noise is optional — don't fail
      }
    }

    // Sci-fi periodic pulse
    if (config.hasPulse) {
      this.pulseTimer = setInterval(() => {
        if (!this.masterGainNode || this.ctx?.state !== 'running') return
        try {
          const po = ctx.createOscillator()
          const pg = ctx.createGain()
          po.type = 'sine'
          po.frequency.value = 1320
          pg.gain.setValueAtTime(0.07, ctx.currentTime)
          pg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
          po.connect(pg)
          pg.connect(master)
          po.start()
          po.stop(ctx.currentTime + 0.45)
        } catch { /* ignore */ }
      }, 3500)
    }
  }

  /** Fade out and disconnect all nodes. */
  async stop(fadeOutMs = 1400): Promise<void> {
    if (this.pulseTimer) {
      clearInterval(this.pulseTimer)
      this.pulseTimer = null
    }
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

  /** Duck to a fraction of full volume (e.g. 0.3 while speaking). */
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

// One engine for the entire session
let _instance: AudioEngine | null = null
export function getAudioEngine(): AudioEngine {
  if (!_instance) _instance = new AudioEngine()
  return _instance
}
