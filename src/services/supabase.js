import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qgbaudwrxhlxcqqraneb.supabase.co";
const supabaseKey = "sb_publishable_Dzgj12BAR_RWYtPhWNsOFg_W4Msm9ze";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
