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
} = {}) {
  getBookings.mockResolvedValue({ data: bookings, count: bookings.length });

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
