import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Menus from "./Menus";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Menus", () => {
  it("opens the matching numeric menu and closes it after an action", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderWithProviders(
      <Menus>
        <Menus.Menu>
          <Menus.Toggle id={42} />
          <Menus.List id={42}>
            <Menus.Button onClick={onAction}>Archive record</Menus.Button>
          </Menus.List>
        </Menus.Menu>
      </Menus>,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: "Archive record" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Archive record" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("button", { name: "Archive record" }),
    ).not.toBeInTheDocument();
  });
});
