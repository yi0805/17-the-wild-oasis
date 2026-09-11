import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { getSettings, updateSetting } = vi.hoisted(() => ({
  getSettings: vi.fn(),
  updateSetting: vi.fn(),
}));

vi.mock("../../services/apiSettings", () => ({
  getSettings,
  updateSetting,
}));

import UpdateSettingsForm from "./UpdateSettingsForm";
import { renderWithProviders } from "../../test/renderWithProviders";

function createSettings(overrides = {}) {
  return {
    id: 1,
    created_at: "2026-09-10T00:00:00.000Z",
    minBookingLength: 2,
    maxBookingLength: 30,
    maxGuestsPerBooking: 4,
    breakfastPrice: 15,
    ...overrides,
  };
}

function renderSettingsForm(settings = createSettings()) {
  getSettings.mockResolvedValue(settings);
  updateSetting.mockResolvedValue(settings);

  return renderWithProviders(<UpdateSettingsForm />);
}

describe("UpdateSettingsForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders existing setting values from the real query hook", async () => {
    renderSettingsForm();

    expect(await screen.findByLabelText("Minimum nights/booking")).toHaveValue(2);
    expect(screen.getByLabelText("Maximum nights/booking")).toHaveValue(30);
    expect(screen.getByLabelText("Maximum guests/booking")).toHaveValue(4);
    expect(screen.getByLabelText("Breakfast price")).toHaveValue(15);
  });

  it("renders a query failure instead of editable settings inputs", async () => {
    getSettings.mockRejectedValue(new Error("Settings query failed"));
    updateSetting.mockResolvedValue(createSettings());

    renderWithProviders(<UpdateSettingsForm />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Settings could not be loaded. Please try again.",
    );
    expect(
      screen.queryByLabelText("Minimum nights/booking"),
    ).not.toBeInTheDocument();
  });

  it("uses a neutral fallback for nullable settings values", async () => {
    renderSettingsForm(createSettings({ breakfastPrice: null }));

    expect(await screen.findByLabelText("Breakfast price")).toHaveValue(null);
  });

  it("updates a numeric setting as a number after blur", async () => {
    const user = userEvent.setup();
    renderSettingsForm();
    const input = await screen.findByLabelText("Maximum nights/booking");

    await user.clear(input);
    await user.type(input, "20");
    await user.tab();

    await waitFor(() =>
      expect(updateSetting).toHaveBeenCalledWith({ maxBookingLength: 20 }),
    );
  });

  it("updates zero rather than treating it as an empty value", async () => {
    const user = userEvent.setup();
    renderSettingsForm();
    const input = await screen.findByLabelText("Breakfast price");

    await user.clear(input);
    await user.type(input, "0");
    await user.tab();

    await waitFor(() =>
      expect(updateSetting).toHaveBeenCalledWith({ breakfastPrice: 0 }),
    );
  });

  it("skips an update when a numeric input is cleared", async () => {
    const user = userEvent.setup();
    renderSettingsForm();
    const input = await screen.findByLabelText("Minimum nights/booking");

    await user.clear(input);
    await user.tab();

    expect(updateSetting).not.toHaveBeenCalled();
  });

  it("disables settings inputs while an update is pending", async () => {
    const user = userEvent.setup();
    let resolveUpdate;
    renderSettingsForm();
    const input = await screen.findByLabelText("Maximum guests/booking");
    updateSetting.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    await user.clear(input);
    await user.type(input, "5");
    await user.tab();

    await waitFor(() => expect(updateSetting).toHaveBeenCalledOnce());
    expect(input).toBeDisabled();
    expect(screen.getByLabelText("Breakfast price")).toBeDisabled();

    resolveUpdate(createSettings());
    await waitFor(() => expect(input).not.toBeDisabled());
    await waitFor(() => expect(getSettings).toHaveBeenCalledTimes(2));
  });
});
