import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znrrjluztyncdvzrhtgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucnJqbHV6dHluY2R2enJodGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDI5MzEsImV4cCI6MjEwNDk3ODkzMX0.TfRQmixdRpZNX_6SoOeJUJlurl52zXtCzZLhnWcuKrU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
