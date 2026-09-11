import supabase, { supabaseUrl } from "./supabase";
import type { UserAttributes } from "@supabase/supabase-js";
import { validateImageFile } from "../utils/imageUpload";

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
type UserMetadata = NonNullable<UserAttributes["data"]>;

const avatarBucket = "avatars";
const avatarPublicPath = "/storage/v1/object/public/avatars/";

function getSupabaseClient() {
  if (!supabase) throw new Error("Supabase client is unavailable");
  return supabase;
}

function escapeRegularExpression(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getOwnedAvatarObjectName(
  avatarUrl: unknown,
  userId: string,
  newAvatarName: string,
) {
  if (typeof avatarUrl !== "string") return null;

  try {
    const avatar = new URL(avatarUrl);
    const project = new URL(supabaseUrl);

    if (
      avatar.origin !== project.origin ||
      !avatar.pathname.startsWith(avatarPublicPath)
    ) {
      return null;
    }

    const objectName = decodeURIComponent(
      avatar.pathname.slice(avatarPublicPath.length),
    );
    const avatarNamePattern = new RegExp(
      `^avatar-${escapeRegularExpression(userId)}-[^/]+$`,
    );

    if (
      objectName === newAvatarName ||
      objectName.includes("/") ||
      !avatarNamePattern.test(objectName)
    ) {
      return null;
    }

    return objectName;
  } catch {
    return null;
  }
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
  const { data: session, error: sessionError } =
    await getSupabaseClient().auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

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
  if (avatar) {
    const validationError = validateImageFile(avatar);
    if (validationError) throw new Error(validationError);
  }

  const client = getSupabaseClient();
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

  if (!avatar) {
    const { data, error } = await client.auth.updateUser(updateData);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  const { data: currentUserData, error: currentUserError } =
    await client.auth.getUser();

  if (currentUserError) {
    throw new Error(currentUserError.message);
  }

  const currentUser = currentUserData.user;
  if (!currentUser) {
    throw new Error("Current user could not be loaded");
  }

  const avatarName = `avatar-${currentUser.id}-${Math.random()}`;
  const avatarUrl = `${supabaseUrl}${avatarPublicPath}${avatarName}`;

  const { error: storageError } = await client.storage
    .from(avatarBucket)
    .upload(avatarName, avatar);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const avatarData: UserMetadata = {
    ...(fullName ? { fullName } : {}),
    avatar: avatarUrl,
  };
  const { data, error } = await client.auth.updateUser({ data: avatarData });

  if (error) {
    const { error: cleanupError } = await client.storage
      .from(avatarBucket)
      .remove([avatarName]);

    if (cleanupError) console.error(cleanupError);
    throw new Error(error.message);
  }

  const previousAvatarName = getOwnedAvatarObjectName(
    currentUser.user_metadata.avatar,
    currentUser.id,
    avatarName,
  );

  if (previousAvatarName) {
    const { error: cleanupError } = await client.storage
      .from(avatarBucket)
      .remove([previousAvatarName]);

    if (cleanupError) console.error(cleanupError);
  }

  return data;
}
