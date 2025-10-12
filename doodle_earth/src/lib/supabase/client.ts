import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const user = "TestUser" // Make this dynamic

const { data, error } = await supabase
  .from('User Profiles')
  .select()
  .eq("name", {user})

