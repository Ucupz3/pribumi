import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://molhpgekczamqhaqffjd.supabase.co"
const supabaseAnonKey = "sb_publishable_3CnLAlN5CqWUytGnrVYs0w_Zayi3gD-"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)