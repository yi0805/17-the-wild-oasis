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
  default: () => <div>Loading dashboard</div>,
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

  it("shows the loading state while required dashboard data is loading", () => {
    useRecentBookings.mockReturnValue({ bookings: undefined, isLoading: true });
    useRecentStays.mockReturnValue({
      confirmedStays: undefined,
      isLoading: false,
      numDays: 7,
    });
    useCabins.mockReturnValue({ cabins: undefined, isLoading: false });

    renderWithProviders(<DashboardLayout />);

    expect(screen.getByText("Loading dashboard")).toBeVisible();
    expect(screen.queryByText(/Stats:/)).not.toBeInTheDocument();
  });

  it("renders the analytics boundary with available dashboard data", () => {
    useRecentBookings.mockReturnValue({
      bookings: [{ created_at: "2026-09-10T00:00:00.000Z" }],
      isLoading: false,
    });
    useRecentStays.mockReturnValue({
      confirmedStays: [{ id: 1 }],
      isLoading: false,
      numDays: 7,
    });
    useCabins.mockReturnValue({ cabins: [{ id: 1 }, { id: 2 }], isLoading: false });

    renderWithProviders(<DashboardLayout />);

    expect(screen.getByText("Stats: 1/1/7/2")).toBeVisible();
    expect(screen.getByText("Today activity")).toBeVisible();
    expect(screen.getByText("Duration chart: 1")).toBeVisible();
    expect(screen.getByText("Sales chart: 1/7")).toBeVisible();
  });
});
