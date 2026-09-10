import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";

const { logoutApi } = vi.hoisted(() => ({ logoutApi: vi.fn() }));

vi.mock("../../services/apiAuth", () => ({ logout: logoutApi }));

import Logout from "./Logout";
import { renderWithProviders } from "../../test/renderWithProviders";

function LocationDisplay() {
  const location = useLocation();

  return <p>{location.pathname}</p>;
}

function renderLogout() {
  return renderWithProviders(
    <Routes>
      <Route path="/dashboard" element={<Logout />} />
      <Route path="/login" element={<LocationDisplay />} />
    </Routes>,
    { initialEntries: ["/dashboard"] },
  );
}

describe("Logout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the logout API through the existing mutation", async () => {
    const user = userEvent.setup();
    logoutApi.mockResolvedValue(undefined);
    renderLogout();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(logoutApi).toHaveBeenCalledOnce());
  });

  it("disables the control and shows the pending spinner", async () => {
    const user = userEvent.setup();
    let resolveLogout;
    logoutApi.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogout = resolve;
        }),
    );
    renderLogout();
    const button = screen.getByRole("button", { name: "Log out" });

    await user.click(button);

    await waitFor(() => expect(logoutApi).toHaveBeenCalledOnce());
    expect(button).toBeDisabled();
    expect(screen.getByLabelText("Logging out")).toBeInTheDocument();
    expect(screen.queryByLabelText("Log out icon")).not.toBeInTheDocument();

    resolveLogout(undefined);
  });

  it("clears the query cache and navigates to login after a successful logout", async () => {
    const user = userEvent.setup();
    logoutApi.mockResolvedValue(undefined);
    const { queryClient } = renderLogout();
    queryClient.setQueryData(["synthetic-query"], "synthetic-value");

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(await screen.findByText("/login")).toBeVisible();
    expect(queryClient.getQueryData(["synthetic-query"])).toBeUndefined();
  });
});
