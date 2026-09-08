import styled from "styled-components";
import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";
import type { updateBooking } from "../../services/apiBookings";

type BookingId = Parameters<typeof updateBooking>[0];
type CheckoutButtonProps = { bookingId: BookingId; children: string };
const SmallPrimaryButton = styled(Button)<{
  variation: "primary";
  size: "small";
}>``;

function CheckoutButton({ bookingId, children }: CheckoutButtonProps) {
  const { checkout, isCheckingOut } = useCheckout();
  return <SmallPrimaryButton variation="primary" size="small" onClick={() => checkout(bookingId)} disabled={isCheckingOut}>{children}</SmallPrimaryButton>;
}

export default CheckoutButton;
