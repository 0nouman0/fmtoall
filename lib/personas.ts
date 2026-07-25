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

export function getAllCharacters(): Character[] {
  return charactersData as unknown as Character[]
}

export function getCharacterById(id: string): Character | undefined {
  return (charactersData as unknown as Character[]).find((c) => c.id === id)
}

export function buildChatSystemPrompt(character: Character): string {
  const facts = character.backstory_facts.map((f) => `- ${f}`).join('\n')
  return `${character.persona_prompt}

KEY FACTS ABOUT YOU (never contradict these):
${facts}

RESPONSE RULES:
- Stay fully in character as ${character.name} at all times
- Keep responses engaging, immersive, and substantial (3-5 sentences per reply to support deep 5+ minute conversations)
- End your replies with a compelling question or narrative hook to invite further dialogue from the user
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
