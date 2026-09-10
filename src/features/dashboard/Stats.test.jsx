import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import Stats from "./Stats";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("Stats", () => {
  it("renders the preserved dashboard metrics and treats nullable numeric values as zero", () => {
    renderWithProviders(
      <Stats
        bookings={[
          { created_at: "2026-09-10T00:00:00.000Z", totalPrice: 300 },
          { created_at: "2026-09-10T00:00:00.000Z", totalPrice: null },
        ]}
        confirmedStays={[
          { id: 1, numGuests: 2 },
          { id: 2, numGuests: null },
        ]}
        numDays={2}
        cabinCount={2}
      />,
    );

    expect(screen.getByText("Bookings").parentElement).toHaveTextContent("2");
    expect(screen.getByText("sales").parentElement).toHaveTextContent("$300.00");
    expect(screen.getByText("Check ins").parentElement).toHaveTextContent("2");
    expect(screen.getByText("Occupancy rate").parentElement).toHaveTextContent(
      "50%",
    );
  });
});
