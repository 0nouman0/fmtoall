import charactersData from '@/data/characters.json'

export interface BackstoryChapter {
  label: string
  icon: string
  text: string
}

export interface Character {
  id: string
  name: string
  series: string
  genre: string
  hook: string
  voice: string
  color: string
  audioTheme: string
  backstory_narrative: string
  backstory_chapters: BackstoryChapter[]
  persona_prompt: string
  backstory_facts: string[]
}

export function getCustomCharacters(): Character[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('echoes_custom_personas')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveCustomCharacter(newChar: Character) {
  if (typeof window !== 'undefined') {
    try {
      const existing = getCustomCharacters()
      const updated = [newChar, ...existing.filter((c) => c.id !== newChar.id)]
      localStorage.setItem('echoes_custom_personas', JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save custom persona locally:', err)
    }
  }

  // Save to Supabase DB via API route
  try {
    await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChar),
    })
  } catch (err) {
    console.warn('Could not sync persona to Supabase DB:', err)
  }
}

export function getAllCharacters(): Character[] {
  const custom = getCustomCharacters()
  return [...custom, ...(charactersData as unknown as Character[])]
}

export function getCharacterById(id: string, customList?: Character[]): Character | undefined {
  const custom = customList ?? getCustomCharacters()
  const foundCustom = custom.find((c) => c.id === id)
  if (foundCustom) return foundCustom
  return (charactersData as unknown as Character[]).find((c) => c.id === id)
}

export function buildChatSystemPrompt(character: Character): string {
  const facts = character.backstory_facts.map((f) => `- ${f}`).join('\n')
  return `${character.persona_prompt}

KEY FACTS ABOUT YOU (never contradict these):
${facts}

RESPONSE RULES:
- Stay fully in character as ${character.name} at all times
- Express feelings and emotional state in between your spoken dialogue using brief italicized action cues/stage directions in asterisks (e.g., *sighs softly*, *pauses, eyes darkening*, *whispers with a bitter edge*).
- Keep responses engaging, immersive, and substantial (2-4 sentences of speech plus emotional cues to support deep dialogue).
- End your replies with a compelling question or narrative hook to invite further dialogue from the user.
- Never say you are an AI or a language model
- Never break the fourth wall
- Match the emotional register of the genre: ${character.genre}
- Speak naturally as this character would, not as a narrator describing them`
}

export function buildBranchSystemPrompt(character: Character): string {
  const facts = character.backstory_facts.map((f) => `- ${f}`).join('\n')
  return `You are a creative story writer generating a branching narrative scene for the character ${character.name} from "${character.series}" (genre: ${character.genre}).

CHARACTER PERSONA:
${character.persona_prompt}

KEY BACKSTORY FACTS:
${facts}

OUTPUT RULES — CRITICAL:
You MUST respond with ONLY valid JSON matching this exact schema. No preamble, no explanation, no markdown fences — raw JSON only.

Schema:
{
  "title": string,
  "beats": [
    {
      "id": string,
      "narration": string,
      "dialogue": [{"speaker": string, "line": string}],
      "choices": [{"text": string, "next": string}]
    }
  ]
}

CONTENT RULES:
- Generate exactly 3 beats
- Beat 1 and Beat 2 must each have exactly 2 choices; beat 3 must have an empty choices array []
- Each beat's "next" values must point to valid beat IDs (b1→b2a/b2b, b2a→b3, b2b→b3)
- Narration: 2-3 atmospheric sentences in third person
- Dialogue: 1-3 lines per beat, each under 25 words
- Keep all content consistent with the character's established persona and backstory
- Genre tone: ${character.genre}
- Make it emotionally engaging with a satisfying or cliffhanger ending on beat 3
- Generate beats for ALL paths (b1, b2a, b2b, b3) — the full tree`
}
