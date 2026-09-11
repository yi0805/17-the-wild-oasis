import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { retryCabinImageCleanup } = vi.hoisted(() => ({
  retryCabinImageCleanup: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../services/apiCabinImageCleanup", () => ({
  retryCabinImageCleanup,
}));

import { useCabinImageCleanupRetry } from "./useCabinImageCleanupRetry";

function CleanupRetryHarness() {
  useCabinImageCleanupRetry();
  return null;
}

describe("useCabinImageCleanupRetry", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("runs one bounded retry pass on mount without repeating on rerender", async () => {
    const { rerender } = render(<CleanupRetryHarness />);

    await waitFor(() => {
      expect(retryCabinImageCleanup).toHaveBeenCalledTimes(1);
    });

    rerender(<CleanupRetryHarness />);

    expect(retryCabinImageCleanup).toHaveBeenCalledTimes(1);
  });
});
