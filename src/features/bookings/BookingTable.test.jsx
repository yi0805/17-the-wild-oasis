import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { getBookings, deleteBooking, updateBooking } = vi.hoisted(() => ({
  getBookings: vi.fn(),
  deleteBooking: vi.fn(),
  updateBooking: vi.fn(),
}));

vi.mock("../../services/apiBookings", () => ({
  getBookings,
  deleteBooking,
  updateBooking,
}));

import BookingTable from "./BookingTable";
import { renderWithProviders } from "../../test/renderWithProviders";

function createBooking(overrides = {}) {
  return {
    id: 1,
    created_at: "2026-09-08T00:00:00.000Z",
    startDate: "2026-09-10",
    endDate: "2026-09-13",
    numNights: 3,
    numGuests: 2,
    totalPrice: 300,
    status: "checked-in",
    cabins: { name: "Forest Cabin" },
    guests: { fullName: "Taylor Guest", email: "taylor@example.com" },
    ...overrides,
  };
}

function renderBookingTable({
  bookings = [createBooking()],
  initialEntry = "/",
  getBookingsImplementation,
} = {}) {
  getBookings.mockImplementation(
    getBookingsImplementation ??
      (() => Promise.resolve({ data: bookings, count: bookings.length })),
  );

  return renderWithProviders(<BookingTable />, {
    initialEntries: [initialEntry],
  });
}

describe("BookingTable", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading while the bookings query is pending", () => {
    renderBookingTable({
      getBookingsImplementation: () => new Promise(() => {}),
    });

    expect(
      screen.getByRole("status", { name: "Loading bookings" }),
    ).toBeVisible();
    expect(
      screen.queryByText("No bookings could be found."),
    ).not.toBeInTheDocument();
  });

  it("shows a query error instead of the bookings empty state", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderBookingTable({
      getBookingsImplementation: () =>
        Promise.reject(new Error("Supabase connection failed")),
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Bookings could not be loaded. Please try again.",
    );
    expect(
      screen.queryByText("No bookings could be found."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Supabase connection failed")).not.toBeInTheDocument();
  });

  it("shows the bookings empty state after a successful zero-row query", async () => {
    renderBookingTable({ bookings: [] });

    expect(
      await screen.findByText("No bookings could be found."),
    ).toBeVisible();
  });

  it("renders a table after a successful booking query with data", async () => {
    renderBookingTable();

    expect(await screen.findByRole("table")).toBeVisible();
    expect(screen.getByText("Forest Cabin")).toBeVisible();
  });

  it("uses the valid status and sort URL contract while retaining checkout", async () => {
    const user = userEvent.setup();
    renderBookingTable({
      initialEntry: "/?status=checked-in&sortBy=totalPrice-asc",
    });

    await screen.findByText("Forest Cabin");
    await waitFor(() =>
      expect(getBookings).toHaveBeenCalledWith({
        filter: { field: "status", value: "checked-in" },
        sortBy: { field: "totalPrice", direction: "asc" },
        page: 1,
      }),
    );

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("Check out")).toBeVisible();
  });

  it("deletes the selected booking after its confirmation", async () => {
    const user = userEvent.setup();
    deleteBooking.mockResolvedValue({});
    renderBookingTable({ bookings: [createBooking({ id: 42 })] });

    await screen.findByText("Forest Cabin");
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("menuitem", { name: "Delete booking" }));

    expect(
      screen.getByRole("heading", { name: "Delete booking" }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deleteBooking).toHaveBeenCalledTimes(1);
      expect(deleteBooking).toHaveBeenCalledWith(42);
    });
  });

  it("falls back to the default sort for malformed sort input", async () => {
    renderBookingTable({
      initialEntry: "/?sortBy=startDate-desc-extra",
    });

    await screen.findByText("Forest Cabin");
    await waitFor(() =>
      expect(getBookings).toHaveBeenCalledWith({
        filter: null,
        sortBy: { field: "startDate", direction: "desc" },
        page: 1,
      }),
    );
  });

  it("falls back to all bookings for malformed status input", async () => {
    renderBookingTable({
      initialEntry: "/?status=not-a-booking-status",
    });

    await screen.findByText("Forest Cabin");
    await waitFor(() =>
      expect(getBookings).toHaveBeenCalledWith({
        filter: null,
        sortBy: { field: "startDate", direction: "desc" },
        page: 1,
      }),
    );
  });

  it("renders nullable booking and joined values without fabricated data", async () => {
    renderBookingTable({
      bookings: [
        createBooking({
          startDate: null,
          endDate: null,
          numNights: null,
          totalPrice: null,
          status: null,
          cabins: null,
          guests: null,
        }),
      ],
    });

    expect((await screen.findAllByText("—")).length).toBeGreaterThan(3);
    expect(screen.queryByText("null")).not.toBeInTheDocument();
  });
});
