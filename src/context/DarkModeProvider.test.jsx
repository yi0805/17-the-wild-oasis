import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DarkModeProvider } from "./DarkModeProvider";
import { useDarkMode } from "./DarkModeContext";
import { renderWithProviders } from "../test/renderWithProviders";

function ThemeProbe() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <>
      <output>{isDarkMode ? "dark" : "light"}</output>
      <button onClick={toggleDarkMode}>Toggle theme</button>
    </>
  );
}

describe("DarkModeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark-mode", "light-mode");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark-mode", "light-mode");
  });

  it("uses the saved preference, toggles the root class, and persists the next mode", async () => {
    const user = userEvent.setup();
    localStorage.setItem("isDarkMode", JSON.stringify(true));

    renderWithProviders(
      <DarkModeProvider>
        <ThemeProbe />
      </DarkModeProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark-mode");
    expect(document.documentElement).not.toHaveClass("light-mode");

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(screen.getByRole("status")).toHaveTextContent("light");
    expect(document.documentElement).toHaveClass("light-mode");
    expect(document.documentElement).not.toHaveClass("dark-mode");
    expect(localStorage.getItem("isDarkMode")).toBe(JSON.stringify(false));
  });
});
