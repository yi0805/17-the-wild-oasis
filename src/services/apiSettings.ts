import supabase from "./supabase";
import type { TablesUpdate } from "../types/database.types";

type SettingsUpdate = TablesUpdate<"settings">;

function getSupabaseClient() {
  if (!supabase) throw new Error("Supabase client is unavailable");
  return supabase;
}

export async function getSettings() {
  const { data, error } = await getSupabaseClient()
    .from("settings")
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

export async function updateSetting(newSetting: SettingsUpdate) {
  const { data, error } = await getSupabaseClient()
    .from("settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
