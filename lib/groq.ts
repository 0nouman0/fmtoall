import Groq from 'groq-sdk'

let client: Groq | null = null

export function getGroqClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set')
    }
    client = new Groq({ apiKey })
  }
  return client
}

export const GROQ_MODEL = 'llama-3.3-70b-versatile'
