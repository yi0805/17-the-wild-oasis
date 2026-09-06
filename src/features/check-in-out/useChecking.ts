import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

type BookingId = Parameters<typeof updateBooking>[0];
type BookingUpdate = Parameters<typeof updateBooking>[1];
type BreakfastUpdate = Pick<
  BookingUpdate,
  "hasBreakfast" | "extrasPrice" | "totalPrice"
>;
type CheckinVariables = {
  bookingId: BookingId;
  breakfast: BreakfastUpdate;
};

export function useChecking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckingIn } = useMutation<
    Awaited<ReturnType<typeof updateBooking>>,
    Error,
    CheckinVariables
  >({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),

    onSuccess: (data) => {
      toast.success(`Successfully checked in booking #${data.id}`);
      queryClient.invalidateQueries();
      navigate("/");
    },

    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckingIn };
}
