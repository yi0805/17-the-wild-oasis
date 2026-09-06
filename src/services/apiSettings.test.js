import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: vi.fn(),
  },
}));

vi.mock("./supabase", () => ({
  default: supabaseMock,
}));

import { updateSetting } from "./apiSettings";

describe("updateSetting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates the global settings row and returns Supabase's updated row", async () => {
    const newSetting = { breakfastPrice: 20 };
    const updatedSetting = { id: 1, breakfastPrice: 20 };
    const single = vi.fn().mockResolvedValue({
      data: updatedSetting,
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    supabaseMock.from.mockReturnValue({ update });

    await expect(updateSetting(newSetting)).resolves.toEqual(updatedSetting);

    expect(supabaseMock.from).toHaveBeenCalledWith("settings");
    expect(update).toHaveBeenCalledWith(newSetting);
    expect(eq).toHaveBeenCalledWith("id", 1);
    expect(select).toHaveBeenCalledOnce();
    expect(single).toHaveBeenCalledOnce();
  });

  it("preserves the public error when Supabase rejects the update", async () => {
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database update failed" },
    });
    const select = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    supabaseMock.from.mockReturnValue({ update });

    await expect(updateSetting({ breakfastPrice: 20 })).rejects.toThrow(
      "Settings could not be updated",
    );
  });
});
