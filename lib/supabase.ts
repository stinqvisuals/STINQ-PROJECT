import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oeqsfqfypwmqzhexkozi.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcXNmcWZ5cHdtcXpoZXhrb3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODY3MjQsImV4cCI6MjA4OTI2MjcyNH0.zPShh5ObeZxDrC4e56gDtRcv_4K-nhETGfPpc5_bkis'
)