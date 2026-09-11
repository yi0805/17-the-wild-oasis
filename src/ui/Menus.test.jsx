import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Menus from "./Menus";
import Modal from "./Modal";
import { renderWithProviders } from "../test/renderWithProviders";

function renderActionsMenu({ onAction = vi.fn(), withOutsideControl = false } = {}) {
  renderWithProviders(
    <>
      <Menus>
        <Menus.Menu>
          <Menus.Toggle ariaLabel="Record actions" id={42} />
          <Menus.List id={42}>
            <Menus.Button onClick={onAction}>Archive record</Menus.Button>
            <Menus.Button>Duplicate record</Menus.Button>
            <Menus.Button>Delete record</Menus.Button>
          </Menus.List>
        </Menus.Menu>
      </Menus>
      {withOutsideControl && <button>Outside control</button>}
    </>,
  );

  return screen.getByRole("button", { name: "Record actions" });
}

function ModalDialogContent() {
  return <div>Delete this record?</div>;
}

describe("Menus", () => {
  it("exposes an accessible toggle and menu semantics", async () => {
    const user = userEvent.setup();
    const toggle = renderActionsMenu();

    expect(toggle).toHaveAttribute("aria-haspopup", "menu");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: "Archive record" }),
    ).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: "Duplicate record" }),
    ).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: "Delete record" }),
    ).toBeVisible();
  });

  it("opens with native activation and arrow keys, with Escape restoring focus", async () => {
    const user = userEvent.setup();
    const toggle = renderActionsMenu();
    toggle.focus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();

    await user.keyboard(" ");
    expect(screen.getByRole("menu")).toBeVisible();
    await user.keyboard("{Escape}");

    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("menuitem", { name: "Archive record" }),
    ).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(
      screen.getByRole("menuitem", { name: "Delete record" }),
    ).toHaveFocus();
  });

  it("moves focus through menu items with Arrow, Home, and End keys", async () => {
    const user = userEvent.setup();
    const toggle = renderActionsMenu();
    toggle.focus();

    await user.keyboard("{ArrowDown}");
    const first = screen.getByRole("menuitem", { name: "Archive record" });
    const second = screen.getByRole("menuitem", { name: "Duplicate record" });
    const last = screen.getByRole("menuitem", { name: "Delete record" });

    await user.keyboard("{ArrowDown}");
    expect(second).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(last).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(first).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(last).toHaveFocus();

    await user.keyboard("{Home}");
    expect(first).toHaveFocus();

    await user.keyboard("{End}");
    expect(last).toHaveFocus();
  });

  it("closes on Tab without trapping focus", async () => {
    const user = userEvent.setup();
    const toggle = renderActionsMenu({ withOutsideControl: true });
    const outsideControl = screen.getByRole("button", {
      name: "Outside control",
    });
    toggle.focus();

    await user.keyboard("{ArrowDown}");
    await user.tab();

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.body).toHaveFocus();

    await user.tab();
    expect(toggle).toHaveFocus();
    await user.tab();
    expect(outsideControl).toHaveFocus();
  });

  it("preserves mouse action and outside-click behaviour", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const toggle = renderActionsMenu({ onAction, withOutsideControl: true });
    const outsideControl = screen.getByRole("button", {
      name: "Outside control",
    });

    await user.click(toggle);
    await user.click(screen.getByRole("menuitem", { name: "Archive record" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(toggle);
    await user.click(outsideControl);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(outsideControl).toHaveFocus();
    expect(toggle).not.toHaveFocus();
  });

  it("returns modal focus to the persistent menu toggle after a menu action", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Menus>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle ariaLabel="Record actions" id={42} />
            <Menus.List id={42}>
              <Modal.Open opens="delete">
                <Menus.Button>Delete record</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window ariaLabel="Delete record confirmation" name="delete">
            <ModalDialogContent />
          </Modal.Window>
        </Modal>
      </Menus>,
    );

    const toggle = screen.getByRole("button", { name: "Record actions" });
    await user.click(toggle);
    await user.click(screen.getByRole("menuitem", { name: "Delete record" }));

    const dialog = screen.getByRole("dialog", {
      name: "Delete record confirmation",
    });
    expect(dialog).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});
