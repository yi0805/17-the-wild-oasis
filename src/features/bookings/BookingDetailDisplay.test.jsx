import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

const { useBooking, useCheckout, useDeleteBooking } = vi.hoisted(() => ({
  useBooking: vi.fn(),
  useCheckout: vi.fn(),
  useDeleteBooking: vi.fn(),
}));

vi.mock("./useBooking", () => ({ useBooking }));
vi.mock("./useDeleteBooking", () => ({ useDeleteBooking }));
vi.mock("../check-in-out/useCheckout", () => ({ useCheckout }));

import BookingDataBox from "./BookingDataBox";
import BookingDetail from "./BookingDetail";
import { renderWithProviders } from "../../test/renderWithProviders";

function createBooking(overrides = {}) {
  return {
    id: 1,
    created_at: "2026-09-08T12:00:00.000Z",
    startDate: "2026-09-10",
    endDate: "2026-09-13",
    numNights: 3,
    numGuests: 2,
    cabinPrice: 240,
    extrasPrice: 60,
    totalPrice: 300,
    hasBreakfast: true,
    observations: "Arriving after 8 PM",
    isPaid: true,
    status: "unconfirmed",
    cabins: { name: "Forest Cabin" },
    guests: {
      fullName: "Taylor Guest",
      email: "taylor@example.com",
      nationalID: "NZ-12345",
      nationality: "New Zealander",
      countryFlag: "https://example.com/nz.svg",
    },
    ...overrides,
  };
}

describe("Booking detail display boundary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useCheckout.mockReturnValue({ checkout: vi.fn(), isCheckingOut: false });
    useDeleteBooking.mockReturnValue({ deleteBooking: vi.fn(), isDeleting: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders complete booking, guest, status, and price information", () => {
    const booking = createBooking();
    useBooking.mockReturnValue({ booking, isLoading: false });

    renderWithProviders(<BookingDetail />, { initialEntries: ["/"] });

    expect(screen.getByRole("heading", { name: "Booking #1" })).toBeVisible();
    expect(screen.getByText("unconfirmed")).toBeVisible();
    expect(screen.getByRole("button", { name: "Check in" })).toBeVisible();
    expect(screen.getByText(/3 nights in Cabin/)).toHaveTextContent(
      "3 nights in Cabin Forest Cabin",
    );
    expect(screen.getByText("Taylor Guest + 1 guests")).toBeVisible();
    expect(screen.getByText("Total price").closest("div")).toHaveTextContent(
      "$300.00",
    );
    expect(screen.getByText("Paid")).toBeVisible();
    expect(screen.getByRole("img", { name: "Flag of New Zealander" })).toHaveAttribute(
      "src",
      "https://example.com/nz.svg",
    );
  });

  it("renders null and invalid detail values as neutral data without malformed values", () => {
    renderWithProviders(
      <BookingDataBox
        booking={
          createBooking({
            created_at: "not-a-date",
            startDate: null,
            endDate: "also-not-a-date",
            numNights: null,
            numGuests: null,
            cabinPrice: null,
            extrasPrice: null,
            totalPrice: null,
            hasBreakfast: null,
            isPaid: null,
            cabins: null,
            guests: null,
          })
        }
      />,
    );

    expect(screen.getByText("— nights in Cabin", { exact: false })).toBeVisible();
    expect(screen.getAllByText("—").length).toBeGreaterThan(3);
    expect(screen.getByText("Unknown")).toBeVisible();
    expect(screen.getByText("Payment status unavailable")).toBeVisible();
    expect(screen.queryByText("Will pay at property")).not.toBeInTheDocument();
    expect(screen.queryByText("NaN")).not.toBeInTheDocument();
    expect(screen.queryByText("$0.00")).not.toBeInTheDocument();
    expect(screen.queryByText(/Flag of undefined/)).not.toBeInTheDocument();
  });

  it.each([null, "pending"])(
    "suppresses status-specific actions for %s status",
    (status) => {
      useBooking.mockReturnValue({
        booking: createBooking({ status }),
        isLoading: false,
      });

      renderWithProviders(<BookingDetail />, { initialEntries: ["/"] });

      expect(screen.getByText("Status unavailable")).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Check in" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Check out" }),
      ).not.toBeInTheDocument();
    },
  );
});
