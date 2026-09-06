import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

const { createEditCabin } = vi.hoisted(() => ({
  createEditCabin: vi.fn(),
}));

vi.mock("../../services/apiCabins", () => ({
  createEditCabin,
}));

import CreateCabinForm from "./CreateCabinForm";
import { renderWithProviders } from "../../test/renderWithProviders";

function getCabinFields() {
  return {
    name: screen.getByLabelText("Cabin name"),
    maxCapacity: screen.getByLabelText("Maximum capacity"),
    regularPrice: screen.getByLabelText("Regular price"),
    discount: screen.getByLabelText("Discount"),
    description: screen.getByLabelText("Description for website"),
    image: screen.getByLabelText("Cabin photo"),
  };
}

async function fillValidCabinForm(user, { includeImage = true } = {}) {
  const fields = getCabinFields();
  const image = new File(["cabin image"], "forest-cabin.png", {
    type: "image/png",
  });

  await user.type(fields.name, "Forest Cabin");
  await user.type(fields.maxCapacity, "4");
  await user.type(fields.regularPrice, "200");
  await user.clear(fields.discount);
  await user.type(fields.discount, "20");
  await user.type(fields.description, "Quiet cabin among the trees.");

  if (includeImage) await user.upload(fields.image, image);

  return image;
}

function renderCreateCabinForm(props = {}) {
  return renderWithProviders(<CreateCabinForm {...props} />);
}

describe("CreateCabinForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("blocks an empty create form and shows required validation", async () => {
    const user = userEvent.setup();
    renderCreateCabinForm();

    await user.click(
      screen.getByRole("button", { name: "Create new cabin" }),
    );

    expect(
      (await screen.findAllByText("This field is required")).length,
    ).toBeGreaterThan(0);
    expect(createEditCabin).not.toHaveBeenCalled();
  });

  it("blocks capacity and regular price values below one", async () => {
    const user = userEvent.setup();
    renderCreateCabinForm();
    const fields = getCabinFields();

    await user.type(fields.name, "Forest Cabin");
    await user.type(fields.maxCapacity, "0");
    await user.type(fields.regularPrice, "0");
    await user.clear(fields.discount);
    await user.type(fields.discount, "0");
    await user.type(fields.description, "Quiet cabin among the trees.");
    await user.upload(
      fields.image,
      new File(["cabin image"], "forest-cabin.png", { type: "image/png" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Create new cabin" }),
    );

    expect(
      await screen.findByText("Capacity must be at least 1"),
    ).toBeVisible();
    expect(
      await screen.findByText("Regular price must be at least 1"),
    ).toBeVisible();
    expect(createEditCabin).not.toHaveBeenCalled();
  });

  it("blocks a discount greater than the regular price", async () => {
    const user = userEvent.setup();
    renderCreateCabinForm();
    const fields = getCabinFields();

    await user.type(fields.name, "Forest Cabin");
    await user.type(fields.maxCapacity, "4");
    await user.type(fields.regularPrice, "200");
    await user.clear(fields.discount);
    await user.type(fields.discount, "250");
    await user.type(fields.description, "Quiet cabin among the trees.");
    await user.upload(
      fields.image,
      new File(["cabin image"], "forest-cabin.png", { type: "image/png" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Create new cabin" }),
    );

    expect(
      await screen.findByText("Discount must be less than regular price"),
    ).toBeVisible();
    expect(createEditCabin).not.toHaveBeenCalled();
  });

  it("blocks an otherwise valid create form without an image", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    renderCreateCabinForm({ onCloseModal });

    await fillValidCabinForm(user, { includeImage: false });
    await user.click(
      screen.getByRole("button", { name: "Create new cabin" }),
    );

    expect(createEditCabin).not.toHaveBeenCalled();
    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it("blocks an edit with a nullable database image", async () => {
    const user = userEvent.setup();
    const cabinToEdit = {
      created_at: "2026-09-06T00:00:00.000Z",
      id: 7,
      name: "Pine Cabin",
      maxCapacity: 4,
      regularPrice: 200,
      discount: 20,
      description: "Quiet cabin among the trees.",
      image: null,
    };
    renderCreateCabinForm({ cabinToEdit });

    await user.click(screen.getByRole("button", { name: "Edit cabin" }));

    expect(createEditCabin).not.toHaveBeenCalled();
  });

  it("creates a valid cabin through the real mutation hook and closes on success", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    const createdCabin = { id: 8, name: "Forest Cabin" };
    createEditCabin.mockResolvedValue(createdCabin);
    renderCreateCabinForm({ onCloseModal });

    const image = await fillValidCabinForm(user);
    await user.click(
      screen.getByRole("button", { name: "Create new cabin" }),
    );

    await waitFor(() =>
      expect(createEditCabin).toHaveBeenCalledWith({
        name: "Forest Cabin",
        maxCapacity: 4,
        regularPrice: 200,
        discount: 20,
        description: "Quiet cabin among the trees.",
        image,
      }),
    );
    await waitFor(() => expect(onCloseModal).toHaveBeenCalledOnce());
  });

  it("keeps a valid create form open when the mutation fails", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    createEditCabin.mockRejectedValue(new Error("Cabin could not be saved"));
    renderWithProviders(
      <>
        <CreateCabinForm onCloseModal={onCloseModal} />
        <Toaster />
      </>,
    );

    await fillValidCabinForm(user);
    await user.click(
      screen.getByRole("button", { name: "Create new cabin" }),
    );

    await waitFor(() => expect(createEditCabin).toHaveBeenCalledOnce());
    expect(
      await screen.findByText("Cabin could not be saved"),
    ).toBeInTheDocument();
    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it("edits existing values without requiring a replacement image", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    const existingImage =
      "https://project.supabase.co/storage/v1/object/public/cabin-images/existing.png";
    const cabinToEdit = {
      id: 7,
      name: "Pine Cabin",
      maxCapacity: 4,
      regularPrice: 200,
      discount: 20,
      description: "Quiet cabin among the trees.",
      image: existingImage,
    };
    createEditCabin.mockResolvedValue({ ...cabinToEdit, name: "Updated Pine Cabin" });
    renderCreateCabinForm({ cabinToEdit, onCloseModal });

    const fields = getCabinFields();
    expect(fields.name).toHaveValue("Pine Cabin");
    expect(fields.maxCapacity).toHaveValue(4);
    expect(fields.regularPrice).toHaveValue(200);
    expect(fields.discount).toHaveValue(20);
    expect(fields.description).toHaveValue("Quiet cabin among the trees.");

    await user.clear(fields.name);
    await user.type(fields.name, "Updated Pine Cabin");
    await user.click(screen.getByRole("button", { name: "Edit cabin" }));

    await waitFor(() =>
      expect(createEditCabin).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Pine Cabin",
          image: existingImage,
        }),
        7,
      ),
    );
    await waitFor(() => expect(onCloseModal).toHaveBeenCalledOnce());
  });
});
