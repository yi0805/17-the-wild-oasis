import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { render } from "@testing-library/react";

const { getCurrentuser } = vi.hoisted(() => ({ getCurrentuser: vi.fn() }));

vi.mock("../services/apiAuth", () => ({ getCurrentuser }));

import ProtectedRoute from "./ProtectedRoute";
import { renderWithProviders } from "../test/renderWithProviders";

function LocationDisplay() {
  const location = useLocation();

  return <p>{location.pathname}</p>;
}

function ProtectedRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <p>Protected content</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
      <LocationDisplay />
    </>
  );
}

function renderProtectedRoutes() {
  return renderWithProviders(<ProtectedRoutes />, {
    initialEntries: ["/protected"],
  });
}

function renderWithCachedUser(user) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["user"], user);

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={["/protected"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProtectedRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return { ...result, queryClient };
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the loading spinner instead of protected content during the initial query", async () => {
    getCurrentuser.mockImplementation(() => new Promise(() => {}));
    renderProtectedRoutes();

    expect(
      await screen.findByRole("status", { name: "Loading user" }),
    ).toBeVisible();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("renders protected children for an authenticated user", async () => {
    getCurrentuser.mockResolvedValue({ role: "authenticated" });
    renderProtectedRoutes();

    expect(await screen.findByText("Protected content")).toBeVisible();
    expect(screen.getByText("/protected")).toBeVisible();
  });

  it("does not render protected children and redirects after an unauthenticated query completes", async () => {
    let resolveUser;
    getCurrentuser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUser = resolve;
        }),
    );
    renderProtectedRoutes();

    expect(
      await screen.findByRole("status", { name: "Loading user" }),
    ).toBeVisible();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();

    resolveUser(null);

    expect(await screen.findByText("Login page")).toBeVisible();
    expect(screen.getByText("/login")).toBeVisible();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders an authentication query failure without redirecting to login", async () => {
    getCurrentuser.mockRejectedValue(new Error("Auth lookup failed"));
    renderProtectedRoutes();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your account could not be loaded. Please try again.",
    );
    expect(screen.getByText("/protected")).toBeVisible();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("does not redirect while an unauthenticated cached query is still fetching", async () => {
    getCurrentuser.mockImplementation(() => new Promise(() => {}));
    renderWithCachedUser(null);

    await waitFor(() => expect(getCurrentuser).toHaveBeenCalledOnce());
    expect(screen.getByText("/protected")).toBeVisible();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("shows a failed cached unauthenticated refetch instead of redirecting", async () => {
    getCurrentuser.mockRejectedValue(new Error("Auth refresh failed"));
    const { queryClient } = renderWithCachedUser(null);

    await waitFor(() =>
      expect(queryClient.getQueryState(["user"])?.fetchStatus).toBe("idle"),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your account could not be loaded. Please try again.",
    );
    expect(screen.getByText("/protected")).toBeVisible();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("keeps verified cached authenticated content when a background refetch fails", async () => {
    getCurrentuser.mockRejectedValue(new Error("Auth refresh failed"));
    const { queryClient } = renderWithCachedUser({ role: "authenticated" });

    await waitFor(() =>
      expect(queryClient.getQueryState(["user"])?.fetchStatus).toBe("idle"),
    );

    expect(screen.getByText("Protected content")).toBeVisible();
    expect(screen.getByText("/protected")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });
});
