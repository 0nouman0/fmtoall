import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ordnqlxtavzbqayiwdud.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZG5xbHh0YXZ6YnFheWl3ZHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5OTkwODcsImV4cCI6MjEwMDU3NTA4N30.S5JLULbpIqhTohtyZMJMSjvhMKrcjMSjrUnxr-St4ec'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
