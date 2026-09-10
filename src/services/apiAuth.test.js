import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { supabaseMock, supabaseUrl } = vi.hoisted(() => ({
  supabaseUrl: "https://project.supabase.co",
  supabaseMock: {
    auth: {
      getUser: vi.fn(),
      updateUser: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
  },
}));

vi.mock("./supabase", () => ({
  default: supabaseMock,
  supabaseUrl,
}));

import { updateCurrentUser } from "./apiAuth";

const userId = "synthetic-user-id";
const newAvatarName = `avatar-${userId}-0.5`;
const newAvatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${newAvatarName}`;
const avatar = { name: "synthetic-avatar.png" };

function mockStorage({ uploadError = null, removeError = null } = {}) {
  const upload = vi.fn().mockResolvedValue({ error: uploadError });
  const remove = vi.fn().mockResolvedValue({ error: removeError });
  supabaseMock.storage.from.mockReturnValue({ upload, remove });

  return { upload, remove };
}

function mockCurrentUser({ avatarUrl = null, error = null, user = true } = {}) {
  supabaseMock.auth.getUser.mockResolvedValue({
    data: {
      user: user
        ? { id: userId, user_metadata: { avatar: avatarUrl } }
        : null,
    },
    error,
  });
}

function mockAuthUpdate({ data = { user: {} }, error = null } = {}) {
  supabaseMock.auth.updateUser.mockResolvedValue({ data, error });
}

describe("updateCurrentUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps password-only updates on the Auth path without touching Storage", async () => {
    const result = { user: {} };
    mockAuthUpdate({ data: result });

    await expect(
      updateCurrentUser({ password: "synthetic-password" }),
    ).resolves.toBe(result);

    expect(supabaseMock.auth.updateUser).toHaveBeenCalledWith({
      password: "synthetic-password",
    });
    expect(supabaseMock.auth.getUser).not.toHaveBeenCalled();
    expect(supabaseMock.storage.from).not.toHaveBeenCalled();
  });

  it("keeps full-name-only updates on the Auth path without touching Storage", async () => {
    const result = { user: {} };
    mockAuthUpdate({ data: result });

    await expect(
      updateCurrentUser({ fullName: "Synthetic Operator" }),
    ).resolves.toBe(result);

    expect(supabaseMock.auth.updateUser).toHaveBeenCalledWith({
      data: { fullName: "Synthetic Operator" },
    });
    expect(supabaseMock.auth.getUser).not.toHaveBeenCalled();
    expect(supabaseMock.storage.from).not.toHaveBeenCalled();
  });

  it("does not upload or mutate profile metadata when current-user lookup fails", async () => {
    mockCurrentUser({ error: { message: "Current user lookup failed" }, user: false });

    await expect(updateCurrentUser({ avatar })).rejects.toThrow(
      "Current user lookup failed",
    );

    expect(supabaseMock.storage.from).not.toHaveBeenCalled();
    expect(supabaseMock.auth.updateUser).not.toHaveBeenCalled();
  });

  it("does not mutate profile metadata when avatar upload fails", async () => {
    mockCurrentUser();
    const { upload, remove } = mockStorage({
      uploadError: { message: "Avatar upload failed" },
    });

    await expect(updateCurrentUser({ avatar })).rejects.toThrow(
      "Avatar upload failed",
    );

    expect(upload).toHaveBeenCalledWith(newAvatarName, avatar);
    expect(remove).not.toHaveBeenCalled();
    expect(supabaseMock.auth.updateUser).not.toHaveBeenCalled();
  });

  it("removes only the new avatar when profile metadata persistence fails", async () => {
    mockCurrentUser();
    const { upload, remove } = mockStorage();
    mockAuthUpdate({ error: { message: "Profile metadata failed" } });

    await expect(
      updateCurrentUser({ fullName: "Synthetic Operator", avatar }),
    ).rejects.toThrow("Profile metadata failed");

    expect(upload).toHaveBeenCalledWith(newAvatarName, avatar);
    expect(supabaseMock.auth.updateUser).toHaveBeenCalledWith({
      data: { fullName: "Synthetic Operator", avatar: newAvatarUrl },
    });
    expect(upload.mock.invocationCallOrder[0]).toBeLessThan(
      supabaseMock.auth.updateUser.mock.invocationCallOrder[0],
    );
    expect(remove).toHaveBeenCalledWith([newAvatarName]);
  });

  it("preserves the Auth metadata error when rollback cleanup fails", async () => {
    mockCurrentUser();
    const cleanupError = { message: "Rollback cleanup failed" };
    const { remove } = mockStorage({ removeError: cleanupError });
    mockAuthUpdate({ error: { message: "Profile metadata failed" } });

    await expect(updateCurrentUser({ avatar })).rejects.toThrow(
      "Profile metadata failed",
    );

    expect(remove).toHaveBeenCalledWith([newAvatarName]);
    expect(console.error).toHaveBeenCalledWith(cleanupError);
  });

  it("removes a previous application-owned avatar for the same user after success", async () => {
    const previousAvatarName = `avatar-${userId}-previous`;
    mockCurrentUser({
      avatarUrl: `${supabaseUrl}/storage/v1/object/public/avatars/${previousAvatarName}`,
    });
    const { remove } = mockStorage();
    const result = { user: {} };
    mockAuthUpdate({ data: result });

    await expect(updateCurrentUser({ avatar })).resolves.toBe(result);

    expect(remove).toHaveBeenCalledWith([previousAvatarName]);
  });

  it("keeps a successful profile update when old-avatar cleanup fails", async () => {
    const previousAvatarName = `avatar-${userId}-previous`;
    const cleanupError = { message: "Old avatar cleanup failed" };
    mockCurrentUser({
      avatarUrl: `${supabaseUrl}/storage/v1/object/public/avatars/${previousAvatarName}`,
    });
    const { remove } = mockStorage({ removeError: cleanupError });
    const result = { user: {} };
    mockAuthUpdate({ data: result });

    await expect(updateCurrentUser({ avatar })).resolves.toBe(result);

    expect(remove).toHaveBeenCalledWith([previousAvatarName]);
    expect(console.error).toHaveBeenCalledWith(cleanupError);
  });

  it("does not delete an external previous avatar", async () => {
    mockCurrentUser({ avatarUrl: "https://images.example.invalid/avatar.png" });
    const { remove } = mockStorage();
    mockAuthUpdate();

    await updateCurrentUser({ avatar });

    expect(remove).not.toHaveBeenCalled();
  });

  it("does not delete another user's application-named avatar", async () => {
    mockCurrentUser({
      avatarUrl: `${supabaseUrl}/storage/v1/object/public/avatars/avatar-another-user-previous`,
    });
    const { remove } = mockStorage();
    mockAuthUpdate();

    await updateCurrentUser({ avatar });

    expect(remove).not.toHaveBeenCalled();
  });
});
