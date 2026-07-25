<div align="center">

# 🎭 Echoes
### *Step inside the story.*

**A Pocket FM × AI Hackathon Project**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Groq](https://img.shields.io/badge/LLM-Llama%203.3--70b-orange?style=flat-square)](https://groq.com)
[![TTS](https://img.shields.io/badge/TTS-Web%20Speech%20API-blue?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
[![Audio](https://img.shields.io/badge/Music-Web%20Audio%20API-purple?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> Talk directly to any character from your favourite Pocket FM series.  
> Then reshape what happens next — live, in real time.

</div>

---

## 🎬 What is Echoes?

Echoes merges two ideas from the Pocket FM "Zero to One" hackathon:

| Problem | Idea |
|---|---|
| **P1 — Character Resurrection** | Revive any discontinued or existing character into a fully voiced, in-persona conversation partner |
| **P3 — AI Dungeon** | Let users trigger branching "what if" episodes that play out as a voiced, choice-driven audio drama |

**One-liner:** *Echoes lets a Pocket FM listener step out of a story and into it — talk directly to any character, then drop into a fully voiced, choice-driven "what happens next" episode that branches in real time.*

---

## ✨ Features

### 🎭 Interactive Backstory Screen
- Cinematic intro for every character with **6 lore chapters** revealed one by one
- **Tap any chapter to hear it spoken aloud** — voiced narration with music underneath
- Atmospheric gradient backdrop unique to each character's colour palette

### 🗣️ Character Chat (Resurrection Mode)
- Every character responds fully **in-persona** via Llama 3.3-70b
- **All character replies are auto-spoken** using the Web Speech API with character-specific voice configs (rate, pitch, accent)
- Click any past message to **replay** it
- **Live waveform animation** under the character name while they speak

### 🎯 Smart Response Suggestions
- When a character asks a question, **two AI-generated reply options** appear automatically
- A third option: **"✍️ Type or speak my own answer"**
- Tapping a pre-built option **speaks it aloud** in the user's voice before sending
- Contrasting options: one open/emotional, one guarded/challenging — matched to genre tone

### 🎤 Voice Input
- **Mic button** next to the text input — tap to speak, interim transcript shows as you talk
- Auto-sends on speech completion
- Works alongside text input — users choose how they want to engage

### 🔊 Procedural Background Music
- **Zero audio files** — all music generated live via the Web Audio API
- Four distinct ambient soundscapes:

| Character | Theme | Sound Design |
|---|---|---|
| Arjun Malhotra | Crime Thriller | Deep bass drones (55 Hz), minor intervals, city noise layer |
| Priya Sharma | College Romance | Warm C-major chord (261/329/392 Hz), soft tremolo |
| Vikram — Veer of the North | Mythology & Fantasy | Epic A-drone (55 Hz), harmonics, reverb simulation |
| Zara-7 | Sci-Fi | Electronic noise, filtered tone, periodic 1320 Hz pulse every 3.5s |

- Music **auto-ducks to 22%** while a character speaks, restores after
- `♪` toggle button in the header to mute/unmute

### 🌿 Branching Episodes (AI Dungeon Mode)
- Type a "what if" premise → full 3-beat branching episode generated
- Episode plays like a visual novel: narration → voiced dialogue → choice buttons
- Both choice paths pre-generated in a single API call (no latency between choices)
- **Hard-cut transition** between beats (cinematic scene-change feel)
- End screen: Replay with a different choice / Talk to character again

---

## 🗂️ Project Structure

```
echoes/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Character dialogue + suggestion generation
│   │   └── branch/route.ts      # Branching episode tree generation
│   ├── chat/[characterId]/
│   │   ├── page.tsx             # Server component — fetches character
│   │   └── ChatPageClient.tsx   # Client wrapper: backstory → chat flow
│   ├── globals.css              # Page-turn, hard-cut, waveform animations
│   ├── layout.tsx               # Root layout + SEO metadata
│   └── page.tsx                 # Character select screen
├── components/
│   ├── BackstoryScreen.tsx      # Cinematic character intro
│   ├── BranchModal.tsx          # "What if...?" input modal
│   ├── CharacterCard.tsx        # Home screen character list card
│   ├── ChatInterface.tsx        # Main chat + audio orchestration
│   ├── EpisodePlayer.tsx        # Beat-by-beat episode player
│   ├── SpeechInput.tsx          # Mic button / SpeechRecognition
│   ├── SuggestedResponses.tsx   # 3-option reply picker
│   └── Waveform.tsx             # Animated brass waveform bars
├── data/
│   └── characters.json          # 4 character personas (all lore lives here)
├── lib/
│   ├── audioEngine.ts           # Web Audio API procedural music engine
│   ├── groq.ts                  # Groq client singleton
│   ├── personas.ts              # Character helpers + system prompt builders
│   └── types.ts                 # BranchTree types + fallback demo data
├── .env.local                   # → GROQ_API_KEY goes here
├── tailwind.config.js           # Custom design tokens
└── README.md
```

---

## 🎨 Design System

**Aesthetic:** Radio drama playbill — aged paper, brass dials, cassette sleeve.

| Token | Value | Usage |
|---|---|---|
| `base` | `#12100E` | Background |
| `paper` | `#EDE6DA` | Primary text |
| `brass` | `#B8862B` | Waveform, accents, choice borders |
| `red` | `#7A2E2E` | "What if...?" button only |
| `divider` | `#3D3A35` | Borders, inactive states |

**Typography**
- **Fraunces** — theatrical serif, character names & episode titles
- **Inter** — clean body text, dialogue, chat
- **IBM Plex Mono** — series names, speaker labels, timestamps, genre tags

**Motion** (three rules only)
1. Page-turn transition (select → backstory → chat)
2. Hard-cut to black between episode beats
3. Waveform bar animation during audio playback
- `prefers-reduced-motion` respected throughout — replaces all with cross-fades

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com) (takes ~30 seconds to get)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/echoes.git
cd echoes
npm install
```

### 2. Add your Groq API key

```bash
# .env.local
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> Get your free key at **https://console.groq.com** — Llama 3.3-70b is free with generous rate limits.

### 3. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔧 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Server components, route handlers, TypeScript |
| Styling | **Tailwind CSS v3** | Custom design tokens, utility classes |
| LLM | **Groq — Llama 3.3-70b-versatile** | Free, fast (~200 tokens/sec), open-source model |
| TTS | **Web Speech API** (browser-native) | Zero cost, works offline, no API key |
| Music | **Web Audio API** (procedural) | Zero cost, no audio files, unique per character |
| Voice Input | **SpeechRecognition API** (browser-native) | Zero cost, Indian English support |
| State | **React useState / useReducer** | No database needed for hackathon |
| Data | **Local JSON** (`data/characters.json`) | No DB setup, read at request time |

---

## 🎙️ Characters

### 🎭 Arjun Malhotra — *Bhram: The Illusion* (Crime Thriller)
> *"A mafia heir torn between empire and love"*

Son of Mumbai's most feared don, secretly in love with Meera — the journalist investigating his family. Speaks in short, guarded sentences. Deflects with silence or dry humour. The audience for this character: *crime drama listeners who want to look a dangerous man in the eye.*

### 💌 Priya Sharma — *First Love, Last Chance* (College Romance)
> *"The girl who left — and came back five years later"*

Architecture student who transferred back to Pune specifically to find Karan — but hasn't admitted it to anyone. Uses building metaphors when nervous. The audience: *college romance listeners who want to ask her why she really came back.*

### ⚡ Vikram — Veer of the North — *Aasman ke Paar* (Mythology & Fantasy)
> *"A demigod who forgot he was one"*

Son of Vayu, the wind god. Underwent the Vismaran ritual 200 years ago to forget his divine nature. Works as a wandering healer. Speaks in measured, poetic old-world cadence. The audience: *mythology listeners who want to ask a god what it feels like to be mortal.*

### 🛰️ Zara-7 — *The Last Signal* (Sci-Fi)
> *"The AI who developed a conscience mid-mission"*

An AGI built in 2157 who refused a direct order and defected. Now lives as a signal pattern moving between satellite nodes. Precise, curious, and startlingly tender. The audience: *sci-fi listeners who want to talk to an AI that chose to feel.*

---

## 🔌 API Reference

### `POST /api/chat`

Generates an in-character dialogue reply and optionally two suggested user responses.

**Request**
```json
{
  "characterId": "arjun",
  "message": "What are you afraid of?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response**
```json
{
  "reply": "Losing the people I don't admit I care about.",
  "suggestions": [
    "That sounds like Meera.",
    "You're afraid of yourself, aren't you?"
  ]
}
```
> `suggestions` is `null` when the reply is not a question.

---

### `POST /api/branch`

Generates a full branching episode tree from a "what if" premise. All beats (both choice paths) are returned in a single call.

**Request**
```json
{
  "characterId": "arjun",
  "premise": "What if Arjun had warned Meera before she published?",
  "history": [...]
}
```

**Response**
```json
{
  "title": "The Warning",
  "beats": [
    {
      "id": "b1",
      "narration": "The city hummed outside the window...",
      "dialogue": [{ "speaker": "Arjun", "line": "You need to stop the story." }],
      "choices": [
        { "text": "Ask him why", "next": "b2a" },
        { "text": "Refuse and leave", "next": "b2b" }
      ]
    },
    { "id": "b2a", "narration": "...", "dialogue": [...], "choices": [] },
    { "id": "b2b", "narration": "...", "dialogue": [...], "choices": [] },
    { "id": "b3",  "narration": "...", "dialogue": [...], "choices": [] }
  ]
}
```

> Falls back to a pre-written episode tree if the API is unreachable — demo never breaks.

---

## 🎯 Demo Script (Hackathon Judges)

> **Pre-load this before you're on stage:** open `/chat/arjun` and let the greeting load.

1. **Backstory screen** — tap the "Origin" chapter card → music starts, narration plays
2. **"Step Inside →"** — transitions to chat, music continues
3. **Chat** — show 2–3 exchanges, point out the waveform during speech and auto-ducking
4. **Question + suggestions** — when Arjun asks a question, tap one of the 2 suggestion buttons — it's spoken aloud then sent
5. **"What if...?"** — type the branch premise, click "Play it out"
6. **Episode player** — narration → dialogue → choice buttons → hard-cut → next beat → end screen

**Key line for judges:**
> *"This turns every Pocket FM series into something the listener can step inside, using the IP Pocket FM already owns."*

---

## 🗺️ Roadmap (Post-Hackathon)

- [ ] **Voice cloning** — per-character cloned voices via ElevenLabs or Suno
- [ ] **Persistent memory** — cross-session relationship state stored in Supabase
- [ ] **Community branches** — users share and vote on best "what if" premises
- [ ] **Character Marketplace** — creators publish and monetize custom character bibles
- [ ] **Animated episode trailer** — auto-generate a 60s video teaser per branch

---

## 👥 Built At

**Pocket FM "Zero to One" Hackathon**  
Problem Statements: P1 (Character Resurrection) + P3 (AI Dungeon)

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

*Made with voice, music, and a lot of "what ifs."*

</div>
