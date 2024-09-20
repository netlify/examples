import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_DATABASE_URL as string
const supabaseKey = process.env.SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
