import supabase, { supabaseUrl } from "./supabase";
import type { Tables, TablesInsert, TablesUpdate } from "../types/database.types";

type Cabin = Tables<"cabins">;
type CabinInsert = TablesInsert<"cabins">;
type CabinUpdate = TablesUpdate<"cabins">;
type CabinMutationInput = Omit<CabinInsert & CabinUpdate, "image"> & {
  image: File | string;
};

function getSupabaseClient() {
  if (!supabase) throw new Error("Supabase client is unavailable");
  return supabase;
}

export async function getCabins() {
  const { data, error } = await getSupabaseClient().from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(
  newCabin: CabinMutationInput,
  id?: Cabin["id"],
) {
  const existingImagePath =
    typeof newCabin.image === "string" && newCabin.image.startsWith(supabaseUrl)
      ? newCabin.image
      : null;
  const hasImagePath = Boolean(existingImagePath);

  const imageName = `${Math.random()}-${
    typeof newCabin.image === "string" ? undefined : newCabin.image.name
  }`.replace(/\//g, "");
  const imagePath =
    existingImagePath ??
    `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  if (!hasImagePath) {
    const { error: storageError } = await getSupabaseClient().storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    if (storageError) {
      console.error(storageError);
      throw new Error("Cabin image could not be uploaded");
    }
  }

  const client = getSupabaseClient();
  const cabinData = { ...newCabin, image: imagePath };

  // A) CREATE
  const result = !id
    ? await client.from("cabins").insert([cabinData]).select().single()
    : await client
        .from("cabins")
        .update(cabinData)
        .eq("id", id)
        .select()
        .single();

  const { data, error } = result;

  if (error) {
    if (!hasImagePath) {
      const { error: cleanupError } = await client.storage
        .from("cabin-images")
        .remove([imageName]);

      if (cleanupError) console.error(cleanupError);
    }

    console.error(error);
    throw new Error("Cabin could not be saved");
  }

  return data;
}

export async function deleteCabin(id: Cabin["id"]) {
  const { data, error } = await getSupabaseClient()
    .from("cabins")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
