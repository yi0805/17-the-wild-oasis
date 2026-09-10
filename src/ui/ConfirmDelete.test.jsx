import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConfirmDelete from "./ConfirmDelete";
import { renderWithProviders } from "../test/renderWithProviders";

describe("ConfirmDelete", () => {
  it("keeps Cancel and Delete callbacks distinct", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    const onConfirm = vi.fn();

    renderWithProviders(
      <ConfirmDelete
        resourceName="record"
        onCloseModal={onCloseModal}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCloseModal).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
