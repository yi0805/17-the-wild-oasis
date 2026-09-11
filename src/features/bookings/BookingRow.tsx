import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";
import {
  isBookingStatus,
  type BookingListItem,
  type BookingStatus,
} from "./bookingTableOptions";

const MenuButton = styled(Menus.Button)<{
  disabled?: boolean;
  onClick?: () => void;
}>``;
const DeleteConfirmation = styled(ConfirmDelete)<{
  onCloseModal?: () => void;
}>``;
const StatusTag = styled(Tag)<{ type: "blue" | "green" | "silver" }>``;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-700);
  font-variant-numeric: tabular-nums;
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.25rem;
  }
`;

const Amount = styled.div`
  font-weight: 650;
  font-variant-numeric: tabular-nums;
`;

const statusToTagName: Record<BookingStatus, "blue" | "green" | "silver"> = {
  unconfirmed: "blue",
  "checked-in": "green",
  "checked-out": "silver",
};

function hasValidDate(value: string | null): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

type BookingRowProps = {
  booking: BookingListItem;
};

function BookingRow({ booking }: BookingRowProps) {
  const {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
  } = booking;
  const cabinName = booking.cabins?.name ?? "—";
  const guestName = booking.guests?.fullName ?? "—";
  const guestEmail = booking.guests?.email ?? "—";
  const validStartDate = hasValidDate(startDate);
  const validEndDate = hasValidDate(endDate);

  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{guestEmail}</span>
      </Stacked>

      <Stacked>
        <span>
          {validStartDate && typeof numNights === "number"
            ? `${
                isToday(new Date(startDate))
                  ? "Today"
                  : formatDistanceFromNow(startDate)
              } → ${numNights} night stay`
            : "—"}
        </span>
        <span>
          {validStartDate ? format(new Date(startDate), "MMM dd yyyy") : "—"}{" "}
          &mdash; {validEndDate ? format(new Date(endDate), "MMM dd yyyy") : "—"}
        </span>
      </Stacked>

      {isBookingStatus(status) ? (
        <StatusTag type={statusToTagName[status]}>
          {status.replace("-", " ")}
        </StatusTag>
      ) : (
        <span>—</span>
      )}

      <Amount>
        {typeof totalPrice === "number" && Number.isFinite(totalPrice)
          ? formatCurrency(totalPrice)
          : "—"}
      </Amount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <MenuButton
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              See the detail
            </MenuButton>

            {status === "unconfirmed" && (
              <MenuButton
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                Check in
              </MenuButton>
            )}

            {status === "checked-in" && (
              <MenuButton
                icon={<HiArrowUpOnSquare />}
                onClick={() => checkout(bookingId)}
                disabled={isCheckingOut}
              >
                Check out
              </MenuButton>
            )}
            <Modal.Open opens="delete">
              <MenuButton icon={<HiTrash />}>Delete booking</MenuButton>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>
        <Modal.Window ariaLabel="Delete booking confirmation" name="delete">
          <DeleteConfirmation
            resourceName="booking"
            onConfirm={() => deleteBooking(bookingId)}
            disabled={isDeleting}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
