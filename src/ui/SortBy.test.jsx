import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";

import SortBy from "./SortBy";
import { renderWithProviders } from "../test/renderWithProviders";

function SearchParamsDisplay() {
  return <output>{useLocation().search}</output>;
}

describe("SortBy", () => {
  it("reflects and updates sortBy while preserving unrelated search parameters", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <SortBy
          options={[
            { value: "name-asc", label: "Sort by name" },
            { value: "price-desc", label: "Sort by price" },
          ]}
        />
        <SearchParamsDisplay />
      </>,
      { initialEntries: ["/?sortBy=name-asc&status=active"] },
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("name-asc");

    await user.selectOptions(select, "price-desc");

    const params = new URLSearchParams(screen.getByRole("status").textContent);
    expect(params.get("sortBy")).toBe("price-desc");
    expect(params.get("status")).toBe("active");
  });
});
