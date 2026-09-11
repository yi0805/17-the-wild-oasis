import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { useCabinImageCleanupRetry } = vi.hoisted(() => ({
  useCabinImageCleanupRetry: vi.fn(),
}));

vi.mock("../features/cabins/useCabinImageCleanupRetry", () => ({
  useCabinImageCleanupRetry,
}));
vi.mock("../features/cabins/CabinTable", () => ({ default: () => null }));
vi.mock("../features/cabins/AddCabin", () => ({ default: () => null }));
vi.mock("../features/cabins/CabinTableOperations", () => ({ default: () => null }));
vi.mock("../ui/Heading", () => ({ default: ({ children }) => <h1>{children}</h1> }));
vi.mock("../ui/Row", () => ({ default: ({ children }) => <div>{children}</div> }));

import Cabins from "./Cabins";

describe("Cabins", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("starts the bounded cleanup retry through the production Cabins workflow", () => {
    render(<Cabins />);

    expect(useCabinImageCleanupRetry).toHaveBeenCalledTimes(1);
  });
});
