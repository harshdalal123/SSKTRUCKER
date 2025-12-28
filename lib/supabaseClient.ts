import { createClient } from '@supabase/supabase-js';

// Access environment variables if available (Vite/Vercel standard), otherwise use fallback
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://qdwbhffzlnulbsesdvyf.supabase.co';
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_KEY || 'sb_publishable_xrFaKWYcioG6yEvdtRzCmA_Mte-m73H';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);