import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ozkdxkkyerjrrehnazky.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxZmI4NDhjLTQwNDEtNDFjZi05ZTgyLTkyYmE2MDdjM2Q2MSJ9.eyJwcm9qZWN0SWQiOiJvemtkeGtreWVyanJyZWhuYXpreSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcwODE2NzIzLCJleHAiOjIwODYxNzY3MjMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kGYZZ4fqukqgCCBQ-HZlVoS8ZAIu6nwrDZVANPeK-tU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };