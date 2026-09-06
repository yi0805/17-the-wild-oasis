import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigurationError =
  !supabaseUrl || !supabasePublishableKey
    ? "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    : null;

const supabase = supabaseConfigurationError
  ? null
  : createClient<Database>(supabaseUrl, supabasePublishableKey);

export default supabase;
