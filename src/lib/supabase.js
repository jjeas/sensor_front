import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// VITE_SUPABASE_URL="https://ncrffjayzzbewfylbbqd.supabase.co"
// VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcmZmamF5enpiZXdmeWxiYnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODgxODcsImV4cCI6MjA4MTM2NDE4N30.HeS8zi0nkcSbpqSYtkiDgAhOvUQmoRhMQZtc7HqsUdM"
