import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hohpiuvqjrwpnryvjayx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaHBpdXZxanJ3cG5yeXZqYXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjU0ODMsImV4cCI6MjA5MDk0MTQ4M30.aaqvwH-QKv0wJ4nDrxx-glY2WDIJgp6kFA2FdCWhqAw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)