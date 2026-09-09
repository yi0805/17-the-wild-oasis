import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { updateCurrentUser } = vi.hoisted(() => ({
  updateCurrentUser: vi.fn(),
}));

vi.mock("../../services/apiAuth", () => ({ updateCurrentUser }));

import UpdatePasswordForm from "./UpdatePasswordForm";
import { renderWithProviders } from "../../test/renderWithProviders";

const validPassword = "synthetic-password";

function renderUpdatePasswordForm() {
  updateCurrentUser.mockResolvedValue({ user: {} });

  return renderWithProviders(<UpdatePasswordForm />);
}

function PasswordFields() {
  return {
    password: screen.getByLabelText("New Password (min 8 chars)"),
    passwordConfirm: screen.getByLabelText("Confirm password"),
    cancel: screen.getByRole("button", { name: "Cancel" }),
    submit: screen.getByRole("button", { name: "Update password" }),
  };
}

async function fillMatchingPasswords(user) {
  const fields = PasswordFields();

  await user.type(fields.password, validPassword);
  await user.type(fields.passwordConfirm, validPassword);

  return fields;
}

describe("UpdatePasswordForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows required validation and does not update for an empty submission", async () => {
    const user = userEvent.setup();
    renderUpdatePasswordForm();
    const { submit } = PasswordFields();

    await user.click(submit);

    expect(
      (await screen.findAllByText("This field is required")).length,
    ).toBe(2);
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });

  it("rejects a password shorter than eight characters", async () => {
    const user = userEvent.setup();
    renderUpdatePasswordForm();
    const fields = PasswordFields();

    await user.type(fields.password, "short");
    await user.type(fields.passwordConfirm, "short");
    await user.click(fields.submit);

    expect(
      await screen.findByText("Password needs a minimum of 8 characters"),
    ).toBeVisible();
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });

  it("rejects a password confirmation that does not match", async () => {
    const user = userEvent.setup();
    renderUpdatePasswordForm();
    const fields = PasswordFields();

    await user.type(fields.password, validPassword);
    await user.type(fields.passwordConfirm, "different-synthetic-password");
    await user.click(fields.submit);

    expect(await screen.findByText("Passwords need to match")).toBeVisible();
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });

  it("sends only the matching password to the update service", async () => {
    const user = userEvent.setup();
    renderUpdatePasswordForm();
    const fields = await fillMatchingPasswords(user);

    await user.click(fields.submit);

    await waitFor(() =>
      expect(updateCurrentUser).toHaveBeenCalledWith({ password: validPassword }),
    );
  });

  it("disables password fields and the update button while pending", async () => {
    const user = userEvent.setup();
    let resolveUpdate;
    renderUpdatePasswordForm();
    const fields = await fillMatchingPasswords(user);
    updateCurrentUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    await user.click(fields.submit);

    await waitFor(() => expect(updateCurrentUser).toHaveBeenCalledOnce());
    expect(fields.password).toBeDisabled();
    expect(fields.passwordConfirm).toBeDisabled();
    expect(fields.submit).toBeDisabled();

    resolveUpdate({ user: {} });
    await waitFor(() => expect(fields.password).not.toBeDisabled());
  });

  it("resets both fields after a successful update", async () => {
    const user = userEvent.setup();
    renderUpdatePasswordForm();
    const fields = await fillMatchingPasswords(user);

    await user.click(fields.submit);

    await waitFor(() => expect(fields.password).toHaveValue(""));
    expect(fields.passwordConfirm).toHaveValue("");
  });

  it("resets both fields without updating when cancelled", async () => {
    const user = userEvent.setup();
    renderUpdatePasswordForm();
    const fields = await fillMatchingPasswords(user);

    await user.click(fields.cancel);

    expect(fields.password).toHaveValue("");
    expect(fields.passwordConfirm).toHaveValue("");
    expect(updateCurrentUser).not.toHaveBeenCalled();
  });
});
