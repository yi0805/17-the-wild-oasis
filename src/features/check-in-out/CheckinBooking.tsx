import styled from "styled-components";
import { useEffect, useState } from "react";

import BookingDataBox from "../../features/bookings/BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Empty from "../../ui/Empty";
import { useBooking } from "../bookings/useBooking";
import { useMoveBack } from "../../hooks/useMoveBack";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useChecking } from "./useChecking";
import { useSettings } from "../settings/useSettings";
import type { getBooking, updateBooking } from "../../services/apiBookings";
import type { getSettings } from "../../services/apiSettings";

const EMPTY_VALUE = "—";

type Booking = Awaited<ReturnType<typeof getBooking>>;
type Settings = Awaited<ReturnType<typeof getSettings>>;
type BreakfastUpdate = Pick<
  Parameters<typeof updateBooking>[1],
  "hasBreakfast" | "extrasPrice" | "totalPrice"
>;
type BreakfastCalculation = {
  price: number;
  originalTotalPrice: number;
  totalPrice: number;
};

const Box = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem 3.2rem;
  box-shadow: var(--shadow-sm);
`;

const HorizontalRow = styled(Row)<{ type: "horizontal" }>``;
const SecondaryButton = styled(Button)<{ variation: "secondary" }>``;

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function getBreakfastCalculation(
  breakfastPrice: Settings["breakfastPrice"] | undefined,
  numNights: Booking["numNights"],
  numGuests: Booking["numGuests"],
  totalPrice: Booking["totalPrice"],
): BreakfastCalculation | null {
  if (
    !isFiniteNumber(breakfastPrice) ||
    !isFiniteNumber(numNights) ||
    !isFiniteNumber(numGuests) ||
    !isFiniteNumber(totalPrice)
  ) {
    return null;
  }

  const price = breakfastPrice * numNights * numGuests;
  const recalculatedTotalPrice = totalPrice + price;

  if (!Number.isFinite(price) || !Number.isFinite(recalculatedTotalPrice)) {
    return null;
  }

  return {
    price,
    originalTotalPrice: totalPrice,
    totalPrice: recalculatedTotalPrice,
  };
}

function formatOptionalCurrency(value: number | null | undefined) {
  return isFiniteNumber(value) ? formatCurrency(value) : EMPTY_VALUE;
}

function getGuestName(fullName: string | null | undefined) {
  return typeof fullName === "string" && fullName.length > 0
    ? fullName
    : "the guest";
}

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const { booking, isLoading } = useBooking();
  const { checkin, isCheckingIn } = useChecking();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  useEffect(
    function () {
      setConfirmPaid(booking?.isPaid ?? false);
    },
    [booking?.isPaid],
  );

  const moveBack = useMoveBack();

  if (isLoading || isLoadingSettings) {
    return <Spinner />;
  }

  if (!booking) {
    return <Empty resourceName="booking" />;
  }

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;
  const breakfastCalculation = getBreakfastCalculation(
    settings?.breakfastPrice,
    numNights,
    numGuests,
    totalPrice,
  );
  const canAddBreakfast =
    hasBreakfast === false && breakfastCalculation !== null;
  const selectedBreakfastCalculation =
    canAddBreakfast && addBreakfast ? breakfastCalculation : null;
  const displayedTotalPrice = selectedBreakfastCalculation
    ? selectedBreakfastCalculation.totalPrice
    : totalPrice;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (selectedBreakfastCalculation) {
      const breakfast: BreakfastUpdate = {
        hasBreakfast: true,
        extrasPrice: selectedBreakfastCalculation.price,
        totalPrice: selectedBreakfastCalculation.totalPrice,
      };

      checkin({ bookingId, breakfast });
      return;
    }

    checkin({ bookingId, breakfast: {} });
  }

  return (
    <>
      <HorizontalRow type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </HorizontalRow>

      <BookingDataBox booking={booking} />

      {canAddBreakfast && breakfastCalculation && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(breakfastCalculation.price)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {getGuestName(guests?.fullName)} has paid the total
          amount of {formatOptionalCurrency(displayedTotalPrice)}
          {selectedBreakfastCalculation &&
            ` (${formatCurrency(
              selectedBreakfastCalculation.originalTotalPrice,
            )} + ${formatCurrency(
              selectedBreakfastCalculation.price,
            )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <SecondaryButton variation="secondary" onClick={moveBack}>
          Back
        </SecondaryButton>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
