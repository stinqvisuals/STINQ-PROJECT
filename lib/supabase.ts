import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Tambahkan pengecekan ini agar Vercel tidak bingung saat build
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase Env Variables")
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
)