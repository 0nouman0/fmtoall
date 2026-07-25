import { NextRequest, NextResponse } from 'next/server'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { getCharacterById, buildChatSystemPrompt, Character } from '@/lib/personas'

function isQuestion(text: string): boolean {
  const t = text.trim()
  // Ends with "?" or contains a clear question word near the end
  return (
    t.endsWith('?') ||
    /\?\s*["']?\s*$/.test(t) ||
    (t.split('?').length - 1 > 0)
  )
}

async function generateSuggestions(
  character: { name: string; genre: string; persona_prompt: string },
  characterQuestion: string
): Promise<string[]> {
  const groq = getGroqClient()
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content: `You generate short, realistic reply options a user might say to the character ${character.name} from a ${character.genre} story.
        
Rules:
- Return a JSON object: { "suggestions": ["option 1", "option 2"] }
- Each suggestion must be under 12 words
- Both options should feel natural and human — not narrator-like
- They should be contrasting: one more open/emotional, one more guarded/challenging
- Match the ${character.genre} genre tone
- Write them as the USER talking TO ${character.name}, not the other way around
- Raw JSON only, no explanation`,
      },
      {
        role: 'user',
        content: `The character just said: "${characterQuestion}"\n\nGive 2 short reply options the user could say back.`,
      },
    ],
    max_tokens: 120,
    temperature: 0.85,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content ?? '{}'
  const parsed = JSON.parse(raw)
  if (Array.isArray(parsed.suggestions) && parsed.suggestions.length >= 2) {
    return [parsed.suggestions[0], parsed.suggestions[1]]
  }
  return [
    `Tell me more about what you mean, ${character.name.split(' ')[0]}.`,
    `I'm not sure if I can trust your answer.`,
  ]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { characterId, message, history = [], customCharacter } = body

    if (!characterId || !message) {
      return NextResponse.json({ error: 'Missing characterId or message' }, { status: 400 })
    }

    const character: Character | undefined = customCharacter || getCharacterById(characterId)
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    const systemPrompt = buildChatSystemPrompt(character)

    const sanitizedHistory = history.slice(-10).map((h: { role: string; content: string }) => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: String(h.content || ''),
    }))

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...sanitizedHistory,
      { role: 'user' as const, content: message },
    ]

    const groq = getGroqClient()
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      max_tokens: 300,
      temperature: 0.85,
    })

    const reply = completion.choices[0]?.message?.content ?? '...'

    // Generate 2 suggested user responses for every turn
    let suggestions: string[] = []
    try {
      suggestions = await generateSuggestions(character, reply)
    } catch (err) {
      console.warn('[/api/chat] Could not generate suggestions:', err)
      suggestions = [
        `Tell me more about what you mean, ${character.name.split(' ')[0]}.`,
        `I'm not sure if I can trust your answer.`,
      ]
    }

    return NextResponse.json({ reply, suggestions: suggestions.length >= 2 ? suggestions : null })
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json(
      { error: "Couldn't reach the character right now. Try again." },
      { status: 502 }
    )
  }
}
