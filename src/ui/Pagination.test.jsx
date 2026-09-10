import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Pagination from "./Pagination";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Pagination", () => {
  it("shows the current range and changes pages without crossing its boundaries", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Pagination count={21} />, {
      initialEntries: ["/?page=1&status=checked-in"],
    });

    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 1 to 10 of 21 results");
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 11 to 20 of 21 results");

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 21 to 21 of 21 results");
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 11 to 20 of 21 results");
  });

  it("does not render when the result set fits on one page", () => {
    renderWithProviders(<Pagination count={10} />, { initialEntries: ["/"] });

    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});
