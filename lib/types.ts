export interface Beat {
  id: string
  narration: string
  dialogue: { speaker: string; line: string }[]
  choices: { text: string; next: string }[]
}

export interface BranchTree {
  title: string
  beats: Beat[]
}

export function validateBranchTree(data: unknown): data is BranchTree {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  if (typeof d.title !== 'string') return false
  if (!Array.isArray(d.beats)) return false
  return d.beats.every((beat) => {
    if (!beat || typeof beat !== 'object') return false
    const b = beat as Record<string, unknown>
    return (
      typeof b.id === 'string' &&
      typeof b.narration === 'string' &&
      Array.isArray(b.dialogue) &&
      Array.isArray(b.choices)
    )
  })
}

// Fallback branch tree used if the API fails on demo day
export function getFallbackBranchTree(characterName: string): BranchTree {
  return {
    title: 'The Moment of Truth',
    beats: [
      {
        id: 'b1',
        narration: `The silence between them stretched thin as a blade. ${characterName} felt the weight of every unspoken word pressing down.`,
        dialogue: [
          { speaker: characterName, line: 'You think I haven\'t thought about this? Every single night?' },
          { speaker: 'Voice', line: 'Then why didn\'t you say something?' },
        ],
        choices: [
          { text: 'Tell the whole truth', next: 'b2a' },
          { text: 'Walk away without answering', next: 'b2b' },
        ],
      },
      {
        id: 'b2a',
        narration: 'The words came out slowly at first, then all at once — years of silence undone in a single breath.',
        dialogue: [
          { speaker: characterName, line: 'I was afraid. Not of you. Of what being honest would cost me.' },
          { speaker: 'Voice', line: 'That\'s the first real thing you\'ve said to me in years.' },
        ],
        choices: [],
      },
      {
        id: 'b2b',
        narration: `${characterName} took three steps, then stopped. The door was right there. All it would take was one more step.`,
        dialogue: [
          { speaker: characterName, line: 'Some questions don\'t deserve answers. They deserve time.' },
        ],
        choices: [],
      },
      {
        id: 'b3',
        narration: 'Whatever happened next would not be undone. The story had shifted — and both of them felt it.',
        dialogue: [
          { speaker: characterName, line: 'Maybe that\'s enough for now.' },
        ],
        choices: [],
      },
    ],
  }
}
