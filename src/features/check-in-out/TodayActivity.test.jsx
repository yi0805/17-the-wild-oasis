import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { getStaysTodayActivity, updateBooking } = vi.hoisted(() => ({
  getStaysTodayActivity: vi.fn(),
  updateBooking: vi.fn(),
}));

vi.mock("../../services/apiBookings", () => ({
  getStaysTodayActivity,
  updateBooking,
}));

import TodayActivity from "./TodayActivity";
import { renderWithProviders } from "../../test/renderWithProviders";

function createActivity(overrides = {}) {
  return {
    id: 1,
    status: "unconfirmed",
    numNights: 1,
    guests: {
      fullName: "Taylor Guest",
      nationality: "New Zealander",
      countryFlag: "https://example.com/nz.svg",
    },
    ...overrides,
  };
}

function renderActivity(activities, { error = null } = {}) {
  if (error) getStaysTodayActivity.mockRejectedValue(error);
  else getStaysTodayActivity.mockResolvedValue(activities);

  updateBooking.mockResolvedValue({ id: 1 });
  return renderWithProviders(<TodayActivity />, { initialEntries: ["/"] });
}

describe("TodayActivity", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it("renders arriving guest data and the check-in link", async () => {
    renderActivity([createActivity()]);

    expect(await screen.findByText("Arriving")).toBeVisible();
    expect(screen.getByText("Taylor Guest")).toBeVisible();
    expect(screen.getByText("1 night")).toBeVisible();
    expect(
      screen.getByRole("img", { name: "Flag of New Zealander" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Check in" })).toHaveAttribute(
      "href",
      "/checkin/1",
    );
  });

  it("checks out departing activities with the existing mutation payload", async () => {
    const user = userEvent.setup();
    renderActivity([createActivity({ status: "checked-in", numNights: 2 })]);

    expect(await screen.findByText("Departing")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Check out" }));

    await waitFor(() =>
      expect(updateBooking).toHaveBeenCalledWith(1, { status: "checked-out" }),
    );
  });

  it("renders a query failure instead of the no-activity empty state", async () => {
    renderActivity(undefined, { error: new Error("Today activity failed") });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Today's activities could not be loaded. Please try again.",
    );
    expect(screen.queryByText("No activities today")).not.toBeInTheDocument();
  });

  it.each([null, []])("renders no activity for %s data", async (activities) => {
    renderActivity(activities);
    expect(await screen.findByText("No activities today")).toBeVisible();
  });

  it("renders neutral fallbacks and no actions for unknown activity data", async () => {
    renderActivity([
      createActivity({ status: "pending", numNights: null, guests: null }),
    ]);

    expect(await screen.findByText("Status unavailable")).toBeVisible();
    expect(screen.getByText("Guest")).toBeVisible();
    expect(screen.getByText("Guest").previousElementSibling).toBeEmptyDOMElement();
    expect(screen.getByText("—")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Check in" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Check out" }),
    ).not.toBeInTheDocument();
  });
});
