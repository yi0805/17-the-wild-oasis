import styled from "styled-components";
import { Link } from "react-router-dom";

import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import CheckoutButton from "./CheckoutButton";
import {
  isTodayActivityStatus,
  type TodayActivityItem,
} from "./todayActivityTypes";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem minmax(8rem, 1fr) 7rem 9rem;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.4rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border-subtle);

  &:first-child {
    border-top: 1px solid var(--color-border-subtle);
  }

  @media (max-width: 700px) {
    grid-template-columns: 2rem minmax(0, 1fr);
    grid-template-areas:
      "status status"
      "flag guest"
      ". nights"
      "action action";
    column-gap: 1rem;
    row-gap: 0.7rem;
    align-items: center;
    padding: 1.2rem 0;
  }
`;
const Guest = styled.div`
  min-width: 0;
  font-weight: 500;

  @media (max-width: 700px) {
    grid-area: guest;
    overflow-wrap: anywhere;
  }
`;
const FlagSlot = styled.div`
  @media (max-width: 700px) {
    grid-area: flag;
  }
`;
const StatusTag = styled(Tag)<{ type: "green" | "blue" }>`
  @media (max-width: 700px) {
    grid-area: status;
    justify-self: start;
  }
`;
const CheckinButton = styled(Button)<{
  size: "small";
  variation: "primary";
  to: string;
}>``;
const StatusFallback = styled.span`
  color: var(--color-grey-500);

  @media (max-width: 700px) {
    grid-area: status;
  }
`;
const Nights = styled.div`
  @media (max-width: 700px) {
    grid-area: nights;
    color: var(--color-text-secondary);
  }
`;
const ActionSlot = styled.div`
  @media (max-width: 700px) {
    grid-area: action;
    display: flex;
    justify-content: flex-start;
    padding-top: 0.3rem;
  }
`;

type TodayItemProps = { activity: TodayActivityItem };

function isFiniteNumber(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function getFlagUrl(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}
function formatNights(value: number | null) {
  return isFiniteNumber(value)
    ? `${value} ${value === 1 ? "night" : "nights"}`
    : "—";
}

function TodayItem({ activity }: TodayItemProps) {
  const { id, status, guests, numNights } = activity;
  const knownStatus = isTodayActivityStatus(status);
  const flagUrl = getFlagUrl(guests?.countryFlag);

  return (
    <StyledTodayItem>
      {status === "unconfirmed" ? (
        <StatusTag type="green">Arriving</StatusTag>
      ) : status === "checked-in" ? (
        <StatusTag type="blue">Departing</StatusTag>
      ) : (
        <StatusFallback>Status unavailable</StatusFallback>
      )}
      <FlagSlot>
        {flagUrl && (
          <Flag
            src={flagUrl}
            alt={
              guests?.nationality
                ? `Flag of ${guests.nationality}`
                : "Guest flag"
            }
          />
        )}
      </FlagSlot>
      <Guest>{guests?.fullName ?? "Guest"}</Guest>
      <Nights>{formatNights(numNights)}</Nights>
      {knownStatus && status === "unconfirmed" && (
        <ActionSlot>
          <CheckinButton
            size="small"
            variation="primary"
            as={Link}
            to={`/checkin/${id}`}
          >
            Check in
          </CheckinButton>
        </ActionSlot>
      )}
      {knownStatus && status === "checked-in" && (
        <ActionSlot>
          <CheckoutButton bookingId={id}>Check out</CheckoutButton>
        </ActionSlot>
      )}
    </StyledTodayItem>
  );
}

export default TodayItem;
