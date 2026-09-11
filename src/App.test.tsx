import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App routes", () => {
  it("shows the route fallback and eventually renders the lazy public login page", async () => {
    window.history.pushState({}, "", "/login");

    render(<App />);

    expect(screen.getByRole("status", { name: "Loading page" })).not.toBeNull();
    expect(
      await screen.findByRole("heading", { name: "Log in to your account" }),
    ).not.toBeNull();
  });
});
