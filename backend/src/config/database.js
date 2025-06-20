import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://kzidvbhqgmnrqeqvemvq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aWR2YmhxZ21ucnFlcXZlbXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA0MDMsImV4cCI6MjA2NjAxNjQwM30.r9qrqeLZI2_kmsh4Ihkl0uS6ZSi2fQKMyDRJ8iJhuHc'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase; 