import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { Flag } from "../../ui/Flag";

import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";
import type { getBooking } from "../../services/apiBookings";

const EMPTY_VALUE = "—";

type Booking = Awaited<ReturnType<typeof getBooking>>;
type PaymentState = "paid" | "unpaid" | "unknown";

type BookingDataBoxProps = {
  booking: Booking;
};

const StyledBookingDataBox = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Price = styled.div<{ $paymentState: PaymentState }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  background-color: ${({ $paymentState }) =>
    $paymentState === "paid"
      ? "var(--color-green-100)"
      : $paymentState === "unpaid"
        ? "var(--color-yellow-100)"
        : "var(--color-grey-100)"};
  color: ${({ $paymentState }) =>
    $paymentState === "paid"
      ? "var(--color-green-700)"
      : $paymentState === "unpaid"
        ? "var(--color-yellow-700)"
        : "var(--color-grey-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

function isValidDate(value: string | null): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    Number.isFinite(new Date(value).getTime())
  );
}

function isFiniteNumber(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatBookingDate(value: string | null, dateFormat: string) {
  return isValidDate(value) ? format(new Date(value), dateFormat) : EMPTY_VALUE;
}

function getDateDistance(value: string | null) {
  if (!isValidDate(value)) return EMPTY_VALUE;

  return isToday(new Date(value)) ? "Today" : formatDistanceFromNow(value);
}

function getPaymentState(isPaid: boolean | null): PaymentState {
  if (isPaid === true) return "paid";
  if (isPaid === false) return "unpaid";
  return "unknown";
}

function getPaymentLabel(paymentState: PaymentState) {
  if (paymentState === "paid") return "Paid";
  if (paymentState === "unpaid") return "Will pay at property";
  return "Payment status unavailable";
}

function getFlagUrl(countryFlag: string | null) {
  if (typeof countryFlag !== "string") return null;

  const trimmedFlagUrl = countryFlag.trim();
  return trimmedFlagUrl.length > 0 ? trimmedFlagUrl : null;
}

function getGuestCountLabel(numGuests: number | null) {
  if (!isFiniteNumber(numGuests) || numGuests <= 1) return "";
  return `+ ${numGuests - 1} guests`;
}

function BookingDataBox({ booking }: BookingDataBoxProps) {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    guests,
    cabins,
  } = booking;

  const paymentState = getPaymentState(isPaid);
  const flagUrl = getFlagUrl(guests?.countryFlag ?? null);
  const showBreakfastPriceBreakdown =
    hasBreakfast === true &&
    isFiniteNumber(totalPrice) &&
    isFiniteNumber(cabinPrice) &&
    isFiniteNumber(extrasPrice);

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineHomeModern />
          <p>
            {isFiniteNumber(numNights) ? numNights : EMPTY_VALUE} nights in
            Cabin <span>{cabins?.name ?? EMPTY_VALUE}</span>
          </p>
        </div>

        <p>
          {formatBookingDate(startDate, "EEE, MMM dd yyyy")} (
          {getDateDistance(startDate)}) &mdash;{" "}
          {formatBookingDate(endDate, "EEE, MMM dd yyyy")}
        </p>
      </Header>

      <Section>
        <Guest>
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
          <p>
            {guests?.fullName ?? EMPTY_VALUE} {getGuestCountLabel(numGuests)}
          </p>
          <span>&bull;</span>
          <p>{guests?.email ?? EMPTY_VALUE}</p>
          <span>&bull;</span>
          <p>National ID {guests?.nationalID ?? EMPTY_VALUE}</p>
        </Guest>

        {observations && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Observations"
          >
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast === true
            ? "Yes"
            : hasBreakfast === false
              ? "No"
              : "Unknown"}
        </DataItem>

        <Price $paymentState={paymentState}>
          <DataItem icon={<HiOutlineCurrencyDollar />} label="Total price">
            {isFiniteNumber(totalPrice) ? formatCurrency(totalPrice) : EMPTY_VALUE}

            {showBreakfastPriceBreakdown &&
              ` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                extrasPrice,
              )} breakfast)`}
          </DataItem>

          <p>{getPaymentLabel(paymentState)}</p>
        </Price>
      </Section>

      <Footer>
        <p>Booked {formatBookingDate(created_at, "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
