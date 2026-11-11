import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jdiojgczrurlwegjaouf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW9qZ2N6cnVybHdlZ2phb3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDUyODcsImV4cCI6MjEwOTEyMTI4N30.E0eRixa1CNnjHUvfagvqjQjEBi9Cdx9cRGzVcqASmVs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

