import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { getCurrentuser, updateCurrentUser } = vi.hoisted(() => ({
  getCurrentuser: vi.fn(),
  updateCurrentUser: vi.fn(),
}));

vi.mock("../../services/apiAuth", () => ({
  getCurrentuser,
  updateCurrentUser,
}));

import UpdateUserDataForm from "./UpdateUserDataForm";
import { renderWithProviders } from "../../test/renderWithProviders";

function createSyntheticUser(overrides = {}) {
  return {
    id: "synthetic-user-id",
    email: "operator@example.invalid",
    role: "authenticated",
    user_metadata: {
      fullName: "Synthetic Operator",
      avatar: "https://example.invalid/avatar.png",
    },
    ...overrides,
  };
}

function renderUpdateUserDataForm(user = createSyntheticUser()) {
  getCurrentuser.mockResolvedValue(user);
  updateCurrentUser.mockResolvedValue({ user });

  return renderWithProviders(<UpdateUserDataForm />);
}

async function profileFields() {
  return {
    fullName: await screen.findByDisplayValue("Synthetic Operator"),
    email: screen.getByDisplayValue("operator@example.invalid"),
    avatar: screen.getByLabelText("Avatar image"),
    cancel: screen.getByRole("button", { name: "Cancel" }),
    submit: screen.getByRole("button", { name: "Update account" }),
  };
}

describe("UpdateUserDataForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the existing profile values", async () => {
    renderUpdateUserDataForm();
    const fields = await profileFields();

    expect(fields.email).toHaveValue("operator@example.invalid");
    expect(fields.email).toBeDisabled();
    expect(fields.fullName).toHaveValue("Synthetic Operator");
  });

  it.each(["", "   "])(
    "does not update for an empty or invalid full name",
    async (fullNameValue) => {
    const user = userEvent.setup();
    renderUpdateUserDataForm();
    const { fullName, submit } = await profileFields();

    await user.clear(fullName);
    if (fullNameValue) await user.type(fullName, fullNameValue);
    await user.click(submit);

    expect(updateCurrentUser).not.toHaveBeenCalled();
    },
  );

  it("passes the selected File object in the existing profile payload", async () => {
    const user = userEvent.setup();
    renderUpdateUserDataForm();
    const { avatar, submit } = await profileFields();
    const file = new File(["synthetic-avatar"], "avatar.png", {
      type: "image/png",
    });

    await user.upload(avatar, file);
    await user.click(submit);

    await waitFor(() => expect(updateCurrentUser).toHaveBeenCalledOnce());
    const [payload] = updateCurrentUser.mock.calls[0];

    expect(payload).toEqual({
      fullName: "Synthetic Operator",
      avatar: file,
    });
    expect(payload.avatar).toBe(file);
  });

  it("blocks an unsupported avatar before the mutation", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderUpdateUserDataForm();
    const { avatar, submit } = await profileFields();

    await user.upload(
      avatar,
      new File(["not an image"], "avatar.gif", { type: "image/gif" }),
    );
    await user.click(submit);

    expect(
      await screen.findByText("Use a JPEG, PNG, or WebP image."),
    ).toBeVisible();
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });

  it("blocks an oversized avatar before the mutation", async () => {
    const user = userEvent.setup();
    renderUpdateUserDataForm();
    const { avatar, submit } = await profileFields();
    const file = new File(["synthetic-avatar"], "avatar.png", {
      type: "image/png",
    });
    Object.defineProperty(file, "size", { value: 5 * 1024 * 1024 + 1 });

    await user.upload(avatar, file);
    await user.click(submit);

    expect(
      await screen.findByText("Image must be 5 MB or smaller."),
    ).toBeVisible();
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });

  it("disables editable controls while an update is pending", async () => {
    const user = userEvent.setup();
    let resolveUpdate;
    renderUpdateUserDataForm();
    const { fullName, avatar, cancel, submit } = await profileFields();
    updateCurrentUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    await user.click(submit);

    await waitFor(() => expect(updateCurrentUser).toHaveBeenCalledOnce());
    expect(fullName).toBeDisabled();
    expect(avatar).toBeDisabled();
    expect(cancel).toBeDisabled();
    expect(submit).toBeDisabled();

    resolveUpdate({ user: createSyntheticUser() });
    await waitFor(() => expect(fullName).not.toBeDisabled());
  });

  it("restores the original profile and clears avatar validation when cancelled", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderUpdateUserDataForm();
    const { fullName, avatar, cancel } = await profileFields();
    const file = new File(["not an image"], "avatar.gif", {
      type: "image/gif",
    });

    await user.clear(fullName);
    await user.type(fullName, "Changed Synthetic Operator");
    await user.upload(avatar, file);
    expect(
      await screen.findByText("Use a JPEG, PNG, or WebP image."),
    ).toBeVisible();
    await user.click(cancel);

    expect(fullName).toHaveValue("Synthetic Operator");
    expect(avatar.files).toHaveLength(0);
    expect(
      screen.queryByText("Use a JPEG, PNG, or WebP image."),
    ).not.toBeInTheDocument();
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });

  it("clears the selected avatar after a successful update while retaining the profile value", async () => {
    const user = userEvent.setup();
    renderUpdateUserDataForm();
    const { fullName, avatar, submit } = await profileFields();
    const file = new File(["synthetic-avatar"], "avatar.png", {
      type: "image/png",
    });

    await user.upload(avatar, file);
    await user.click(submit);

    await waitFor(() => expect(avatar.files).toHaveLength(0));
    expect(fullName).toHaveValue("Synthetic Operator");
  });
});
