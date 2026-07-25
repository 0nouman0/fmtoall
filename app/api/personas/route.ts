import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase.from('personas').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('[/api/personas GET]', error)
      return NextResponse.json({ personas: [] }, { status: 500 })
    }
    return NextResponse.json({ personas: data ?? [] })
  } catch (err) {
    console.error('[/api/personas GET]', err)
    return NextResponse.json({ personas: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      name,
      series,
      genre,
      color,
      voice,
      audioTheme,
      hook,
      persona_prompt,
      backstory_narrative,
      backstory_chapters = [],
      backstory_facts = [],
    } = body

    if (!id || !name || !series) {
      return NextResponse.json({ error: 'Missing required persona fields' }, { status: 400 })
    }

    const payload = {
      id,
      name,
      series,
      genre,
      color: color || '#9D4EDD',
      voice: voice || 'onyx',
      audio_theme: audioTheme || 'crime',
      hook,
      persona_prompt,
      backstory_narrative,
      backstory_chapters,
      backstory_facts,
    }

    const { data, error } = await supabase.from('personas').upsert(payload).select().single()

    if (error) {
      console.error('[/api/personas POST]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, persona: data })
  } catch (err) {
    console.error('[/api/personas POST]', err)
    return NextResponse.json({ error: 'Failed to create persona in database' }, { status: 500 })
  }
}
