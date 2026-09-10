import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorFallback from "./ErrorFallback";
import { renderWithProviders } from "../test/renderWithProviders";

describe("ErrorFallback", () => {
  it("shows the error message and calls the boundary reset callback", async () => {
    const user = userEvent.setup();
    const resetErrorBoundary = vi.fn();

    renderWithProviders(
      <ErrorFallback
        error={new Error("Dashboard data could not be loaded")}
        resetErrorBoundary={resetErrorBoundary}
      />,
    );

    expect(screen.getByText("Dashboard data could not be loaded")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(resetErrorBoundary).toHaveBeenCalledOnce();
  });
});
