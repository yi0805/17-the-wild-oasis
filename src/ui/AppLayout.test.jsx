import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

vi.mock("../features/authentication/UserAvatar", () => ({
  default: () => <div>Account controls</div>,
}));

import { DarkModeProvider } from "../context/DarkModeProvider";
import { renderWithProviders } from "../test/renderWithProviders";
import AppLayout from "./AppLayout";

function LocationDisplay() {
  const location = useLocation();

  return <p>{location.pathname}</p>;
}

function ShellRoutes() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<h1>Dashboard page</h1>} />
          <Route path="/bookings" element={<h1>Bookings page</h1>} />
          <Route path="/cabins" element={<h1>Cabins page</h1>} />
          <Route path="/settings" element={<h1>Settings page</h1>} />
        </Route>
      </Routes>
      <LocationDisplay />
    </>
  );
}

function renderAppLayout() {
  return renderWithProviders(
    <DarkModeProvider>
      <ShellRoutes />
    </DarkModeProvider>,
    { initialEntries: ["/dashboard"] },
  );
}

describe("AppLayout responsive navigation", () => {
  it("starts collapsed and toggles the mobile primary navigation", async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggle = screen.getByLabelText("Toggle navigation", { selector: "button" });
    expect(toggle).toHaveAttribute("aria-controls", "primary-navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile primary navigation" }),
    ).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile primary navigation" }),
    ).toBeVisible();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile primary navigation" }),
    ).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the navigation toggle", async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggle = screen.getByLabelText("Toggle navigation", { selector: "button" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile primary navigation" }),
    ).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it("closes the mobile navigation after a primary route change", async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggle = screen.getByLabelText("Toggle navigation", { selector: "button" });
    await user.click(toggle);

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile primary navigation",
    });
    await user.click(within(mobileNavigation).getByRole("link", { name: "Bookings" }));

    expect(await screen.findByRole("heading", { name: "Bookings page" })).toBeVisible();
    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
    expect(screen.getByText("/bookings")).toBeVisible();
    expect(
      screen.queryByRole("navigation", { name: "Mobile primary navigation" }),
    ).not.toBeInTheDocument();
  });

  it("keeps every primary destination available through the existing navigation", () => {
    renderAppLayout();

    const primaryNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    expect(within(primaryNavigation).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(within(primaryNavigation).getByRole("link", { name: "Bookings" })).toHaveAttribute(
      "href",
      "/bookings",
    );
    expect(within(primaryNavigation).getByRole("link", { name: "Cabins" })).toHaveAttribute(
      "href",
      "/cabins",
    );
    expect(within(primaryNavigation).getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
  });
});
