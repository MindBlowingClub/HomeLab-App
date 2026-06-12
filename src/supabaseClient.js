import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verify that variables are present and are not placeholder values
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  !supabaseAnonKey.includes('your-key-here') &&
  supabaseAnonKey.trim() !== ''

export const isRealSupabase = !!isConfigured

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null
