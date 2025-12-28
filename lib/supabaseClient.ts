import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qdwbhffzlnulbsesdvyf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xrFaKWYcioG6yEvdtRzCmA_Mte-m73H';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);