// accessing client's own information (profile, currency, etc.)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// These are example functions - you'll call these from your components
// Don't run queries at the top level of this file

// READ - Get user profile
export async function getUserProfile(userName: string) {
  const { data, error } = await supabase
    .from('Users')  // Changed from 'User Profiles' to 'Users'
    .select()
    .eq("Username", userName)  // Changed from "name" to "Username" to match your column
  
  if (error) console.error('Error fetching user:', error)
  return data
}
// CREATE - Create commission
export async function createCommission(commissionData: any) {
  const id = crypto.randomUUID() // generate unique id for each commission
  
  const { data, error } = await supabase
    .from('Commissions')
    .insert({ id, ...commissionData })
  
  if (error) console.error('Error creating commission:', error)
  return data
}

// CREATE - Create submission
export async function createSubmission(submissionData: any, commissionId: string) {
  const { data, error } = await supabase
    .from('Submissions')
    .insert({ 
      commission_id: commissionId,
      ...submissionData 
    })
  
  if (error) console.error('Error creating submission:', error)
  return data
}

// READ - Get commission image
export async function getCommissionImage(commissionId: string) {
  const { data, error } = await supabase
    .from('Commissions')
    .select('image_url')
    .eq("commission_id", commissionId) // removed curly braces
  
  if (error) console.error('Error fetching commission:', error)
  return data
}

// UPDATE - Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('User Profiles')
    .update(updates)
    .eq('id', userId)
  
  if (error) console.error('Error updating profile:', error)
  return data
}

// DELETE - Delete commission
export async function deleteCommission(commissionId: string) {
  const { data, error } = await supabase
    .from('Commissions')
    .delete()
    .eq('id', commissionId)
  
  if (error) console.error('Error deleting commission:', error)
  return data
}