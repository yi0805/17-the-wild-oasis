import styled from "styled-components";
import { Link } from "react-router-dom";

import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import CheckoutButton from "./CheckoutButton";
import { isTodayActivityStatus, type TodayActivityItem } from "./todayActivityTypes";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem minmax(8rem, 1fr) 7rem 9rem;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.4rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border-subtle);
  &:first-child { border-top: 1px solid var(--color-border-subtle); }
`;
const Guest = styled.div`font-weight: 500;`;
const FlagSlot = styled.div``;
const StatusTag = styled(Tag)<{ type: "green" | "blue" }>``;
const CheckinButton = styled(Button)<{ size: "small"; variation: "primary"; to: string }>``;
const StatusFallback = styled.span`color: var(--color-grey-500);`;

type TodayItemProps = { activity: TodayActivityItem };

function isFiniteNumber(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function getFlagUrl(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function formatNights(value: number | null) {
  return isFiniteNumber(value) ? `${value} ${value === 1 ? "night" : "nights"}` : "—";
}

function TodayItem({ activity }: TodayItemProps) {
  const { id, status, guests, numNights } = activity;
  const knownStatus = isTodayActivityStatus(status);
  const flagUrl = getFlagUrl(guests?.countryFlag);

  return (
    <StyledTodayItem>
      {status === "unconfirmed" ? <StatusTag type="green">Arriving</StatusTag> : status === "checked-in" ? <StatusTag type="blue">Departing</StatusTag> : <StatusFallback>Status unavailable</StatusFallback>}
      <FlagSlot>
        {flagUrl && <Flag src={flagUrl} alt={guests?.nationality ? `Flag of ${guests.nationality}` : "Guest flag"} />}
      </FlagSlot>
      <Guest>{guests?.fullName ?? "Guest"}</Guest>
      <div>{formatNights(numNights)}</div>
      {knownStatus && status === "unconfirmed" && <CheckinButton size="small" variation="primary" as={Link} to={`/checkin/${id}`}>Check in</CheckinButton>}
      {knownStatus && status === "checked-in" && <CheckoutButton bookingId={id}>Check out</CheckoutButton>}
    </StyledTodayItem>
  );
}

export default TodayItem;
