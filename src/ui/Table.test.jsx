import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import Table from "./Table";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Table", () => {
  it("renders generic body data through its render callback", () => {
    renderWithProviders(
      <Table columns="1fr">
        <Table.Body
          data={[{ id: 1, name: "Sample cabin" }]}
          render={(item) => <Table.Row key={item.id}>{item.name}</Table.Row>}
        />
      </Table>,
    );

    expect(screen.getByText("Sample cabin")).toBeVisible();
  });

  it("renders the existing empty-state message for empty data", () => {
    renderWithProviders(
      <Table columns="1fr">
        <Table.Body data={[]} render={() => null} />
      </Table>,
    );

    expect(screen.getByText("No data to show at the moment")).toBeVisible();
  });
});
