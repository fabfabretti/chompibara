import { createClient } from "@supabase/supabase-js";

// Database access
const DBurl = import.meta.env.VITE_SUPABASE_URL;
const DBkey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(DBurl, DBkey);

export default supabase;
