import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// This name MUST match the variable name you just created in Vercel
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  // This error will now show if the variables are missing in Vercel
  throw new Error('Missing Supabase URL or Anon Key from Vercel environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

