import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { isDuplicableCabin, type Cabin } from "./cabinTableOptions";

const MenuButton = styled(Menus.Button)<{
  disabled?: boolean;
  onClick?: () => void;
}>``;
const DeleteConfirmation = styled(ConfirmDelete)<{
  onCloseModal?: () => void;
}>``;

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const ImagePlaceholder = styled.div`
  display: grid;
  place-items: center;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  color: var(--color-grey-500);
  font-size: 1.2rem;
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

type CabinRowProps = {
  cabin: Cabin;
};

function CabinRow({ cabin }: CabinRowProps) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();

  const {
    name,
    image,
    maxCapacity,
    regularPrice,
    discount,
    id: cabinID,
  } = cabin;

  const canDuplicate = isDuplicableCabin(cabin);

  function handleDuplicate() {
    if (!isDuplicableCabin(cabin)) return;

    createCabin({
      name: `Copy of ${cabin.name}`,
      image: cabin.image,
      maxCapacity: cabin.maxCapacity,
      regularPrice: cabin.regularPrice,
      discount: cabin.discount,
      description: cabin.description,
    });
  }

  return (
    <Table.Row>
      {typeof image === "string" && image.length > 0 ? (
        <Img src={image} alt={name ?? "Cabin"} />
      ) : (
        <ImagePlaceholder>No image</ImagePlaceholder>
      )}
      <Cabin>{name ?? "—"}</Cabin>
      <div>
        {maxCapacity === null ? "—" : `Fits up to ${maxCapacity} guests`}
      </div>
      <Price>
        {typeof regularPrice === "number" && Number.isFinite(regularPrice)
          ? formatCurrency(regularPrice)
          : "—"}
      </Price>
      {typeof discount === "number" && discount > 0 ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinID} />

            <Menus.List id={cabinID}>
              {canDuplicate && (
                <MenuButton
                  icon={<HiSquare2Stack />}
                  onClick={handleDuplicate}
                  disabled={isCreating}
                >
                  Duplicate
                </MenuButton>
              )}

              <Modal.Open opens="edit">
                <MenuButton icon={<HiPencil />}>Edit</MenuButton>
              </Modal.Open>

              <Modal.Open opens="delete">
                <MenuButton icon={<HiTrash />}>Delete</MenuButton>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          <Modal.Window name="delete">
            <DeleteConfirmation
              resourceName="cabins"
              disabled={isDeleting}
              onConfirm={() => deleteCabin(cabinID)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
