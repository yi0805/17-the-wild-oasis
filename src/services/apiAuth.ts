import supabase, { supabaseUrl } from "./supabase";
import type { UserAttributes } from "@supabase/supabase-js";

type LoginCredentials = {
  email: string;
  password: string;
};
type UpdateCurrentUserInput = {
  password?: string;
  fullName?: string;
  avatar?: File | null;
};
type CurrentUserAttributes = Pick<UserAttributes, "password" | "data">;

function getSupabaseClient() {
  if (!supabase) throw new Error("Supabase client is unavailable");
  return supabase;
}

export async function login({ email, password }: LoginCredentials) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getCurrentuser() {
  const { data: session } = await getSupabaseClient().auth.getSession();
  if (!session?.session) {
    return null;
  }

  const { data, error } = await getSupabaseClient().auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data?.user;
}

export async function logout() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
}: UpdateCurrentUserInput) {
  let updateData: CurrentUserAttributes = {};
  if (password) {
    updateData = { password };
  }
  if (fullName) {
    updateData = {
      data: {
        fullName,
      },
    };
  }

  const { data, error } = await getSupabaseClient().auth.updateUser(updateData);

  if (error) {
    throw new Error(error.message);
  }

  if (!avatar) return data;

  if (!data.user) {
    throw new Error("User could not be updated");
  }

  // upload the avater image
  const filedName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await getSupabaseClient().storage
    .from("avatars")
    .upload(filedName, avatar);

  if (storageError) {
    throw new Error(storageError.message);
  }

  // update avatar in the user
  const { data: updateUser, error: updateUserError } =
    await getSupabaseClient().auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${filedName}`,
      },
    });

  if (updateUserError) {
    throw new Error(updateUserError.message);
  }

  return updateUser;
}
