import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ntgrodtzkdcgiapzfwiq.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_KEY);


const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
