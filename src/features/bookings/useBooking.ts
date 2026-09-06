import { useQuery } from "@tanstack/react-query";

import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
  const { bookingId } = useParams();
  const numericBookingId = Number(bookingId);

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(numericBookingId),
    retry: false,
  });

  return { booking, isLoading, error };
}
