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

function renderCabinTable({
  cabins,
  isLoading = false,
  error = null,
  initialEntry = "/",
} = {}) {
  useCabins.mockReturnValue({ cabins, isLoading, error });

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

  it("shows loading instead of treating undefined cabins as an empty result", () => {
    renderCabinTable({
      cabins: undefined,
      isLoading: true,
      error: new Error("Previous query failed"),
    });

    expect(
      screen.getByRole("status", { name: "Loading cabins" }),
    ).toBeVisible();
    expect(
      screen.queryByText("No cabins could be found."),
    ).not.toBeInTheDocument();
  });

  it("shows a query error instead of the cabins empty state", () => {
    renderCabinTable({
      cabins: undefined,
      error: new Error("Supabase connection failed"),
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Cabins could not be loaded. Please try again.",
    );
    expect(
      screen.queryByText("No cabins could be found."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Supabase connection failed")).not.toBeInTheDocument();
  });

  it("shows the cabins empty state after a successful zero-row query", () => {
    renderCabinTable({ cabins: [] });

    expect(screen.getByText("No cabins could be found.")).toBeVisible();
  });

  it("renders a table after a successful cabin query with data", () => {
    renderCabinTable({ cabins: [createCabin()] });

    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByText("Aspen Cabin")).toBeVisible();
  });

  it("renders nullable cabin values safely and omits duplicate", async () => {
    const user = userEvent.setup();
    renderCabinTable({
      cabins: [
        createCabin({
          name: null,
          image: null,
          maxCapacity: null,
          regularPrice: null,
          discount: null,
          description: null,
        }),
      ],
    });

    expect(screen.getByText("No image")).toBeVisible();
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getAllByText("—")).toHaveLength(4);
    expect(screen.queryByText("null")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();
  });

  it("falls back to name ascending for a malformed sort URL value", () => {
    renderCabinTable({
      cabins: [
        createCabin({ id: 1, name: "Zulu Cabin" }),
        createCabin({ id: 2, name: "Alpha Cabin" }),
      ],
      initialEntry: "/?sortBy=madeUp-desc",
    });

    expect(
      screen
        .getAllByText(/^(Alpha Cabin|Zulu Cabin)$/)
        .map((element) => element.textContent),
    ).toEqual(["Alpha Cabin", "Zulu Cabin"]);
  });

  it("rejects a malformed sort value with a valid prefix", () => {
    renderCabinTable({
      cabins: [
        createCabin({ id: 1, name: "Zulu Cabin", regularPrice: 100 }),
        createCabin({ id: 2, name: "Alpha Cabin", regularPrice: 10 }),
      ],
      initialEntry: "/?sortBy=regularPrice-desc-extra",
    });

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

    renderCabinTable({
      cabins,
      initialEntry: "/?sortBy=regularPrice-asc",
    });

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
