import { createClient } from '@supabase/supabase-js'

export const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Gunakan URL asli kamu sebagai cadangan (fallback) agar proses build tidak crash
    return createClient(
        supabaseUrl || 'https://oeqsfqfypwmqzhexkozi.supabase.co',
        supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcXNmcWZ5cHdtcXpoZXhrb3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODY3MjQsImV4cCI6MjA4OTI2MjcyNH0.zPShh5ObeZxDrC4e56gDtRcv_4K-nhETGfPpc5_bkis'
    )
}

// Untuk kompatibilitas dengan file lain yang mungkin masih pakai import { supabase }
export const supabase = getSupabase()