import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import type { ReactNode } from "react";

import BookingDataBox from "./BookingDataBox";
import { isBookingStatus } from "./bookingTableOptions";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";
import Empty from "../../ui/Empty";

const statusToTagName = {
  unconfirmed: "blue",
  "checked-in": "green",
  "checked-out": "silver",
} as const;

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

const HorizontalRow = styled(Row)<{ type: "horizontal" }>``;
const StatusTag = styled(Tag)<{
  type: (typeof statusToTagName)[keyof typeof statusToTagName];
}>``;
const ActionButton = styled(Button)<{
  icon?: ReactNode;
  variation?: "danger" | "secondary";
}>``;
const DeleteConfirmation = styled(ConfirmDelete)<{
  onCloseModal?: () => void;
}>``;

const StatusFallback = styled.span`
  color: var(--color-grey-500);
  font-size: 1.4rem;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  if (isLoading) {
    return <Spinner />;
  }

  if (!booking) {
    return <Empty resourceName="booking" />;
  }

  const { status, id: bookingId } = booking;
  const hasKnownStatus = isBookingStatus(status);

  return (
    <>
      <HorizontalRow type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          {hasKnownStatus ? (
            <StatusTag type={statusToTagName[status]}>
              {status.replace("-", " ")}
            </StatusTag>
          ) : (
            <StatusFallback>Status unavailable</StatusFallback>
          )}
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </HorizontalRow>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}

        {status === "checked-in" && (
          <ActionButton
            icon={<HiArrowUpOnSquare />}
            onClick={() => checkout(bookingId)}
            disabled={isCheckingOut}
          >
            Check out
          </ActionButton>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <ActionButton variation="danger">Delete booking</ActionButton>
          </Modal.Open>

          <Modal.Window name="delete">
            <DeleteConfirmation
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(bookingId, {
                  onSettled: () => navigate(-1),
                })
              }
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>

        <ActionButton variation="secondary" onClick={moveBack}>
          Back
        </ActionButton>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
