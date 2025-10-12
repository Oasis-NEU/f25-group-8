// CRUD operations on server side (things that the client should not control)

// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // process.env.SUPABASE_SERVICE_ROLE_KEY!, // Secret key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Can award currency bypassing RLS
export async function awardWinnerCurrency(userId: string, amount: number) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .update({ currency: amount })
    .eq('id', userId)
}