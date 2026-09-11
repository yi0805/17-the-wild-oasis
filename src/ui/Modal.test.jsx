import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Modal from "./Modal";
import { renderWithProviders } from "../test/renderWithProviders";

function ModalContent({ onCloseModal, onKeepOpen }) {
  return (
    <div>
      <p>Modal content</p>
      <button onClick={onKeepOpen}>Keep open</button>
      <button onClick={onCloseModal}>Close content</button>
    </div>
  );
}

function FocusTrapContent() {
  return (
    <div>
      <button>First action</button>
      <input aria-label="Modal note" />
    </div>
  );
}

function renderModal(children = <ModalContent />) {
  return renderWithProviders(
    <Modal>
      <Modal.Open opens="example">
        <button>Open example</button>
      </Modal.Open>
      <Modal.Window ariaLabel="Example dialog" name="example">
        {children}
      </Modal.Window>
    </Modal>,
  );
}

describe("Modal", () => {
  it("exposes named modal dialog semantics and moves focus into the dialog", async () => {
    const user = userEvent.setup();
    renderModal();

    const trigger = screen.getByRole("button", { name: "Open example" });
    trigger.focus();

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Example dialog" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeVisible();
    expect(dialog).toHaveFocus();
    expect(trigger).not.toHaveFocus();
  });

  it("closes with Escape and restores focus to its opener", async () => {
    const user = userEvent.setup();
    renderModal();

    const trigger = screen.getByRole("button", { name: "Open example" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Example dialog" })).toBeVisible();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Example dialog" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("traps Tab and Shift+Tab navigation within the dialog", async () => {
    const user = userEvent.setup();
    renderModal(<FocusTrapContent />);

    await user.click(screen.getByRole("button", { name: "Open example" }));

    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    const firstAction = screen.getByRole("button", { name: "First action" });
    const note = screen.getByRole("textbox", { name: "Modal note" });

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(firstAction).toHaveFocus();

    await user.tab();
    expect(note).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(note).toHaveFocus();
  });

  it("injects a working close callback and preserves outside-click closing", async () => {
    const user = userEvent.setup();
    const onKeepOpen = vi.fn();

    renderModal(<ModalContent onKeepOpen={onKeepOpen} />);

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: "Open example" });
    await user.click(trigger);
    expect(screen.getByText("Modal content")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Keep open" }));
    expect(onKeepOpen).toHaveBeenCalledOnce();
    expect(screen.getByText("Modal content")).toBeVisible();

    await user.click(document.body);
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Close content" }));
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
