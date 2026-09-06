import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { useCabins } = vi.hoisted(() => ({
  useCabins: vi.fn(),
}));

vi.mock("./useCabins", () => ({
  useCabins,
}));

import CabinTable from "./CabinTable";
import { renderWithProviders } from "../../test/renderWithProviders";

function createCabin(overrides = {}) {
  return {
    created_at: "2026-09-06T00:00:00.000Z",
    id: 1,
    name: "Aspen Cabin",
    image: "https://project.supabase.co/storage/v1/object/public/cabin-images/aspen.png",
    maxCapacity: 2,
    regularPrice: 100,
    discount: 0,
    description: "A quiet cabin.",
    ...overrides,
  };
}

function renderCabinTable(cabins, initialEntry = "/") {
  useCabins.mockReturnValue({ cabins, isLoading: false, error: null });

  return renderWithProviders(<CabinTable />, {
    initialEntries: [initialEntry],
  });
}

describe("CabinTable", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nullable cabin values safely and omits duplicate", async () => {
    const user = userEvent.setup();
    renderCabinTable([
      createCabin({
        name: null,
        image: null,
        maxCapacity: null,
        regularPrice: null,
        discount: null,
        description: null,
      }),
    ]);

    expect(screen.getByText("No image")).toBeVisible();
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getAllByText("—")).toHaveLength(4);
    expect(screen.queryByText("null")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();
  });

  it("falls back to name ascending for a malformed sort URL value", () => {
    renderCabinTable(
      [
        createCabin({ id: 1, name: "Zulu Cabin" }),
        createCabin({ id: 2, name: "Alpha Cabin" }),
      ],
      "/?sortBy=madeUp-desc",
    );

    expect(
      screen
        .getAllByText(/^(Alpha Cabin|Zulu Cabin)$/)
        .map((element) => element.textContent),
    ).toEqual(["Alpha Cabin", "Zulu Cabin"]);
  });

  it("sorts nullable values last without mutating the source array", () => {
    const cabins = [
      createCabin({ id: 1, name: "Birch Cabin", regularPrice: 200 }),
      createCabin({ id: 2, name: "Aspen Cabin", regularPrice: null }),
      createCabin({ id: 3, name: "Cedar Cabin", regularPrice: 100 }),
    ];

    renderCabinTable(cabins, "/?sortBy=regularPrice-asc");

    expect(
      screen
        .getAllByText(/^(Aspen Cabin|Birch Cabin|Cedar Cabin)$/)
        .map((element) => element.textContent),
    ).toEqual(["Cedar Cabin", "Birch Cabin", "Aspen Cabin"]);
    expect(cabins.map((cabin) => cabin.name)).toEqual([
      "Birch Cabin",
      "Aspen Cabin",
      "Cedar Cabin",
    ]);
  });
});
