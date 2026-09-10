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

describe("Modal", () => {
  it("opens its named window, injects a working close callback, and closes only for outside clicks", async () => {
    const user = userEvent.setup();
    const onKeepOpen = vi.fn();

    renderWithProviders(
      <Modal>
        <Modal.Open opens="example">
          <button>Open example</button>
        </Modal.Open>
        <Modal.Window name="example">
          <ModalContent onKeepOpen={onKeepOpen} />
        </Modal.Window>
      </Modal>,
    );

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open example" }));
    expect(screen.getByText("Modal content")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Keep open" }));
    expect(onKeepOpen).toHaveBeenCalledOnce();
    expect(screen.getByText("Modal content")).toBeVisible();

    await user.click(document.body);
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open example" }));
    await user.click(screen.getByRole("button", { name: "Close content" }));
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });
});
