import { NextRequest, NextResponse } from 'next/server'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { getCharacterById, buildBranchSystemPrompt } from '@/lib/personas'
import { validateBranchTree, getFallbackBranchTree } from '@/lib/types'

async function generateBranchTree(
  characterId: string,
  premise: string,
  history: { role: string; content: string }[]
) {
  const character = getCharacterById(characterId)
  if (!character) throw new Error('Character not found')

  const systemPrompt = buildBranchSystemPrompt(character)
  const historyContext = history
    .slice(-6)
    .map((h) => `${h.role}: ${h.content}`)
    .join('\n')

  const userPrompt = `${
    historyContext
      ? `RECENT CONVERSATION CONTEXT:\n${historyContext}\n\n`
      : ''
  }WHAT-IF PREMISE: "${premise}"

Generate a complete branching episode tree (beats b1, b2a, b2b, b3) based on this premise. Remember: raw JSON only, no explanation.`

  const groq = getGroqClient()
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 1500,
    temperature: 0.9,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content ?? ''
  return JSON.parse(raw)
}

export async function POST(req: NextRequest) {
  let characterId = ''
  let character = null

  try {
    const body = await req.json()
    const { characterId: cid, premise, history = [], customCharacter } = body
    characterId = cid ?? ''

    if (!characterId || !premise) {
      return NextResponse.json(
        { error: 'Missing characterId or premise' },
        { status: 400 }
      )
    }

    character = customCharacter || getCharacterById(characterId)
    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    // First attempt
    let parsed: unknown
    try {
      parsed = await generateBranchTree(characterId, premise, history)
    } catch (firstErr) {
      console.warn('[/api/branch] First attempt failed, retrying...', firstErr)
      try {
        parsed = await generateBranchTree(
          characterId,
          `${premise} — IMPORTANT: respond with raw JSON only, no markdown`,
          history
        )
      } catch (secondErr) {
        console.error('[/api/branch] Both attempts failed, using fallback', secondErr)
        return NextResponse.json(getFallbackBranchTree(character.name))
      }
    }

    if (!validateBranchTree(parsed)) {
      console.warn('[/api/branch] Invalid tree shape, using fallback')
      return NextResponse.json(getFallbackBranchTree(character.name))
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[/api/branch]', err)
    const fallbackName = character?.name ?? 'The Character'
    return NextResponse.json(getFallbackBranchTree(fallbackName))
  }
}
