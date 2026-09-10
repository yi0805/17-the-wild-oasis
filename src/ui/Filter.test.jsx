import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";

import Filter from "./Filter";
import { renderWithProviders } from "../test/renderWithProviders";

function SearchParamsDisplay() {
  return <output>{useLocation().search}</output>;
}

describe("Filter", () => {
  it("uses the default filter and preserves unrelated search parameters when changing it", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <Filter
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
          ]}
        />
        <SearchParamsDisplay />
      </>,
      { initialEntries: ["/?page=3&source=dashboard"] },
    );

    expect(screen.getByRole("button", { name: "All" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Active" }));

    const params = new URLSearchParams(screen.getByRole("status").textContent);
    expect(params.get("status")).toBe("active");
    expect(params.get("page")).toBe("1");
    expect(params.get("source")).toBe("dashboard");
  });
});
