import { createClient } from '@supabase/supabase-js'

// Ambil variabel dari environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// JIKA variabel kosong (saat build), gunakan URL placeholder agar library tidak error
// JIKA variabel ada (saat runtime), gunakan nilai aslinya
export const supabase = createClient(
    supabaseUrl || 'https://oeqsfqfypwmqzhexkozi.supabase.co', // Ganti dengan URL Supabase kamu
    supabaseAnonKey || 'dummy-key'
)