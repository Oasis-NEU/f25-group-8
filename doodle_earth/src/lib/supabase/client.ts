import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const user = "TestUser" // Make this dynamic




const { data, error } = await supabase
  .from('User Profiles')
  .select()
  .eq("name", {user})

// Create
// Create commissions, submission, add or remove friends

// Creating commission
const commission = 'Mordor' // make dynamic
const id = crypto.randomUUID() // generate unique id for each commission

const { data, error } = await supabase
  .from('Commissions')
  .insert({ id , commission })

// Creating submission

const submission = 'Gandalf' // make dynamic
const commission_id = crypto.randomUUID() // make dynamic
const { data, error } = await supabase



// READ
// View, existing commissions, prior commissions/submission

// Make nested query for this s
const { data, error } = await supabase
  .from('Commissions')
  .select('image_url')
  .eq("commission_id", {commission_id})




// Update
// udpdate their own posts, information, account, bio, profile picture



// DELETE
// Delete their own posts, information, account 