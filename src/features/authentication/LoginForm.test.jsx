import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";

const { login } = vi.hoisted(() => ({ login: vi.fn() }));

vi.mock("../../services/apiAuth", () => ({ login }));

import LoginForm from "./LoginForm";
import { renderWithProviders } from "../../test/renderWithProviders";

const credentials = {
  email: "operator@example.invalid",
  password: "not-a-real-password",
};

function renderLoginForm(options = { initialEntries: ["/login"] }) {
  login.mockResolvedValue({ user: {}, session: null });

  return renderWithProviders(<LoginForm />, options);
}

function LoginFields() {
  return {
    email: screen.getByLabelText("Email address"),
    password: screen.getByLabelText("Password"),
    submit: screen.getByRole("button", { name: "Log in" }),
  };
}

async function fillCredentials(user) {
  const fields = LoginFields();

  await user.type(fields.email, credentials.email);
  await user.type(fields.password, credentials.password);

  return fields;
}

function LocationDisplay() {
  const location = useLocation();

  return <p>{location.pathname}</p>;
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty email and password fields", () => {
    renderLoginForm();
    const fields = LoginFields();

    expect(fields.email).toHaveValue("");
    expect(fields.password).toHaveValue("");
  });

  it("does not submit incomplete credentials", async () => {
    const user = userEvent.setup();
    renderLoginForm();
    const fields = LoginFields();

    await user.type(fields.email, credentials.email);
    await user.click(fields.submit);

    expect(login).not.toHaveBeenCalled();
  });

  it("passes the exact credential strings to the login service", async () => {
    const user = userEvent.setup();
    renderLoginForm();
    const fields = await fillCredentials(user);

    await user.click(fields.submit);

    await waitFor(() => expect(login).toHaveBeenCalledWith(credentials));
  });

  it("disables fields and replaces the submit label with a spinner while pending", async () => {
    const user = userEvent.setup();
    let resolveLogin;
    renderLoginForm();
    const fields = await fillCredentials(user);
    login.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
    );

    await user.click(fields.submit);

    await waitFor(() => expect(login).toHaveBeenCalledOnce());
    expect(fields.email).toBeDisabled();
    expect(fields.password).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).not.toHaveTextContent("Log in");
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();

    resolveLogin({ user: {}, session: null });
    await waitFor(() => expect(fields.email).not.toBeDisabled());
  });

  it("clears fields after a failed login attempt settles", async () => {
    const user = userEvent.setup();
    renderLoginForm();
    const fields = await fillCredentials(user);
    login.mockRejectedValue(new Error("Login request failed"));

    await user.click(fields.submit);

    await waitFor(() => expect(fields.email).toHaveValue(""));
    expect(fields.password).toHaveValue("");
  });

  it("navigates to the dashboard and caches the successful login user", async () => {
    const user = userEvent.setup();
    const loginResult = { user: {}, session: null };
    login.mockResolvedValue(loginResult);
    const { queryClient } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<LocationDisplay />} />
      </Routes>,
      { initialEntries: ["/login"] },
    );
    const fields = await fillCredentials(user);

    await user.click(fields.submit);

    expect(await screen.findByText("/dashboard")).toBeVisible();
    expect(queryClient.getQueryData(["user"])).toBe(loginResult.user);
  });
});
