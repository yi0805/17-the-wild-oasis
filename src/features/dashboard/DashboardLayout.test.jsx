import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

const { useRecentBookings, useRecentStays, useCabins } = vi.hoisted(() => ({
  useRecentBookings: vi.fn(),
  useRecentStays: vi.fn(),
  useCabins: vi.fn(),
}));

vi.mock("./useRecentBookings", () => ({ useRecentBookings }));
vi.mock("./useRecentStays", () => ({ useRecentStays }));
vi.mock("../cabins/useCabins", () => ({ useCabins }));
vi.mock("../../ui/Spinner", () => ({
  default: (props) => <div {...props}>Loading dashboard</div>,
}));
vi.mock("./Stats", () => ({
  default: ({ bookings, confirmedStays, numDays, cabinCount }) => (
    <div>{`Stats: ${bookings.length}/${confirmedStays.length}/${numDays}/${cabinCount}`}</div>
  ),
}));
vi.mock("../check-in-out/TodayActivity", () => ({
  default: () => <div>Today activity</div>,
}));
vi.mock("./DurationChart", () => ({
  default: ({ confirmedStays }) => (
    <div>{`Duration chart: ${confirmedStays.length}`}</div>
  ),
}));
vi.mock("./SalesChart", () => ({
  default: ({ bookings, numDays }) => (
    <div>{`Sales chart: ${bookings.length}/${numDays}`}</div>
  ),
}));

import DashboardLayout from "./DashboardLayout";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("keeps loading ahead of a stale dashboard query error", () => {
    useRecentBookings.mockReturnValue({
      bookings: undefined,
      isLoading: true,
      error: null,
    });
    useRecentStays.mockReturnValue({
      confirmedStays: undefined,
      isLoading: false,
      numDays: 7,
      error: new Error("Previous dashboard query failed"),
    });
    useCabins.mockReturnValue({
      cabins: undefined,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DashboardLayout />);

    expect(
      screen.getByRole("status", { name: "Loading dashboard" }),
    ).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(/Stats:/)).not.toBeInTheDocument();
  });

  it("renders a dashboard query failure instead of throwing missing-data state", () => {
    useRecentBookings.mockReturnValue({
      bookings: undefined,
      isLoading: false,
      error: new Error("Bookings failed"),
    });
    useRecentStays.mockReturnValue({
      confirmedStays: [],
      isLoading: false,
      numDays: 7,
      error: null,
    });
    useCabins.mockReturnValue({ cabins: [], isLoading: false, error: null });

    renderWithProviders(<DashboardLayout />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Dashboard could not be loaded. Please try again.",
    );
    expect(screen.queryByText(/Stats:/)).not.toBeInTheDocument();
  });

  it("renders the analytics boundary with available dashboard data", () => {
    useRecentBookings.mockReturnValue({
      bookings: [{ created_at: "2026-09-10T00:00:00.000Z" }],
      isLoading: false,
      error: null,
    });
    useRecentStays.mockReturnValue({
      confirmedStays: [{ id: 1 }],
      isLoading: false,
      numDays: 7,
      error: null,
    });
    useCabins.mockReturnValue({
      cabins: [{ id: 1 }, { id: 2 }],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DashboardLayout />);

    expect(screen.getByText("Stats: 1/1/7/2")).toBeVisible();
    expect(screen.getByText("Today activity")).toBeVisible();
    expect(screen.getByText("Duration chart: 1")).toBeVisible();
    expect(screen.getByText("Sales chart: 1/7")).toBeVisible();
  });
});
