const SUPABASE_URL = "https://ltstvsuaiwxbrfwemxgj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8EGcp4kDuunVq_a2Yq8EQA_DpOJjV_B";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Flagged: Supabase подключён");
