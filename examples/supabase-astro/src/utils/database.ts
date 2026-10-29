import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'

// Read from the runtime environment: Astro inlines import.meta.env values into the server bundle at build.
const supabaseUrl = process.env.SUPABASE_DATABASE_URL as string
const supabaseKey = process.env.SUPABASE_ANON_KEY as string

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
