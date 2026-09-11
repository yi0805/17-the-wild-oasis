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
  min-width: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-700);
  padding: 2.2rem 3.2rem;
  color: var(--color-on-brand);
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  & > * {
    min-width: 0;
  }

  svg {
    height: 3.2rem;
    width: 3.2rem;
    flex: 0 0 auto;
  }

  & div:first-child {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & div:first-child > p,
  & > p {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  & span {
    font-variant-numeric: tabular-nums;
    font-size: 2rem;
    margin-left: 4px;
  }

  @media (max-width: 700px) {
    padding: 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    & div:first-child {
      align-items: flex-start;
      gap: 1rem;
    }
  }
`;

const Section = styled.section`
  min-width: 0;
  padding: 3.2rem 3.2rem 1.2rem;

  @media (max-width: 700px) {
    padding: 2rem 2rem 1rem;
  }
`;

const Guest = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-wrap: wrap;
    column-gap: 0.8rem;
    row-gap: 0.6rem;
  }
`;

const Price = styled.div<{ $paymentState: PaymentState }>`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 1.6rem 2rem;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: var(--border-radius-md);
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

  & > * {
    min-width: 0;
  }

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

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1.4rem;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 3.2rem;
  border-top: 1px solid var(--color-border-subtle);
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;

  @media (max-width: 700px) {
    padding: 1.4rem 2rem;
    text-align: left;
  }
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
