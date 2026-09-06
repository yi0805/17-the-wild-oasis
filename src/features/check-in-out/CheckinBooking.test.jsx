import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

const { getBooking, updateBooking, getSettings } = vi.hoisted(() => ({
  getBooking: vi.fn(),
  updateBooking: vi.fn(),
  getSettings: vi.fn(),
}));

vi.mock("../../services/apiBookings", () => ({
  getBooking,
  updateBooking,
}));

vi.mock("../../services/apiSettings", () => ({
  getSettings,
}));

import CheckinBooking from "./CheckinBooking";
import { renderWithProviders } from "../../test/renderWithProviders";

function createBooking(overrides = {}) {
  return {
    id: 42,
    created_at: "2024-01-01T12:00:00.000Z",
    startDate: "2024-01-10",
    endDate: "2024-01-13",
    numNights: 3,
    numGuests: 2,
    cabinPrice: 600,
    extrasPrice: 0,
    totalPrice: 600,
    hasBreakfast: false,
    observations: "",
    isPaid: false,
    guests: {
      fullName: "Taylor Guest",
      email: "taylor@example.com",
      country: "New Zealand",
      countryFlag: null,
      nationalID: "NZ123456",
    },
    cabins: { name: "001" },
    ...overrides,
  };
}

function renderCheckin({ booking = createBooking(), includeToaster = false } = {}) {
  getBooking.mockResolvedValue(booking);
  getSettings.mockResolvedValue({ breakfastPrice: 15 });
  updateBooking.mockResolvedValue({ id: booking.id });

  return renderWithProviders(
    <>
      <Routes>
        <Route path="/checkin/:bookingId" element={<CheckinBooking />} />
        <Route path="/" element={<p>Check-in complete</p>} />
      </Routes>
      {includeToaster && <Toaster />}
    </>,
    { initialEntries: [`/checkin/${booking.id}`] },
  );
}

async function confirmPayment(user) {
  await user.click(
    await screen.findByRole("checkbox", { name: /I confirm that/ }),
  );
}

describe("CheckinBooking", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requires payment confirmation before an unpaid booking can be checked in", async () => {
    const user = userEvent.setup();
    renderCheckin();

    const checkinButton = await screen.findByRole("button", {
      name: "Check in booking #42",
    });
    expect(checkinButton).toBeDisabled();

    await confirmPayment(user);
    expect(checkinButton).toBeEnabled();
  });

  it("checks in a paid-confirmed booking without adding breakfast and navigates home", async () => {
    const user = userEvent.setup();
    renderCheckin();

    await confirmPayment(user);
    await user.click(
      screen.getByRole("button", { name: "Check in booking #42" }),
    );

    await waitFor(() =>
      expect(updateBooking).toHaveBeenCalledWith(42, {
        status: "checked-in",
        isPaid: true,
      }),
    );
    expect(await screen.findByText("Check-in complete")).toBeVisible();
  });

  it("adds breakfast with the displayed recalculated total to the check-in payload", async () => {
    const user = userEvent.setup();
    renderCheckin();

    const breakfastCheckbox = await screen.findByRole("checkbox", {
      name: "Want to add breakfast for $90.00?",
    });
    await user.click(breakfastCheckbox);

    expect(breakfastCheckbox).toBeChecked();
    expect(
      screen.getByRole("checkbox", {
        name: "I confirm that Taylor Guest has paid the total amount of $690.00 ($600.00 + $90.00)",
      }),
    ).toBeInTheDocument();

    await confirmPayment(user);
    await user.click(
      screen.getByRole("button", { name: "Check in booking #42" }),
    );

    await waitFor(() =>
      expect(updateBooking).toHaveBeenCalledWith(42, {
        status: "checked-in",
        isPaid: true,
        hasBreakfast: true,
        extrasPrice: 90,
        totalPrice: 690,
      }),
    );
  });

  it("requires payment confirmation again after breakfast selection changes", async () => {
    const user = userEvent.setup();
    renderCheckin();

    const checkinButton = await screen.findByRole("button", {
      name: "Check in booking #42",
    });
    await confirmPayment(user);
    expect(checkinButton).toBeEnabled();

    await user.click(
      screen.getByRole("checkbox", {
        name: "Want to add breakfast for $90.00?",
      }),
    );

    expect(
      screen.getByRole("checkbox", { name: /I confirm that/ }),
    ).not.toBeChecked();
    expect(checkinButton).toBeDisabled();
  });

  it("does not navigate away when the check-in mutation fails", async () => {
    const user = userEvent.setup();
    renderCheckin({ includeToaster: true });
    updateBooking.mockRejectedValue(new Error("Booking could not be updated"));

    await confirmPayment(user);
    await user.click(
      screen.getByRole("button", { name: "Check in booking #42" }),
    );

    await waitFor(() => expect(updateBooking).toHaveBeenCalledOnce());
    expect(
      await screen.findByText("There was an error while checking in"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Check-in complete")).not.toBeInTheDocument();
  });
});
