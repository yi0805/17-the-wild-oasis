import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import FormRow from "./FormRow";
import { renderWithProviders } from "../test/renderWithProviders";

describe("FormRow", () => {
  it("associates its label with an element child id and displays errors", () => {
    renderWithProviders(
      <FormRow label="Cabin name" error="A name is required">
        <input id="cabin-name" />
      </FormRow>,
    );

    expect(screen.getByLabelText("Cabin name")).toHaveAttribute(
      "id",
      "cabin-name",
    );
    expect(screen.getByText("A name is required")).toBeVisible();
  });
});
