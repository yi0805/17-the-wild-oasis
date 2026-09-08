import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { PAGE_SIZE } from "../../utils/constatns";
import { getBookings } from "../../services/apiBookings";
import {
  parseBookingFilter,
  parseBookingSort,
  type BookingFilter,
} from "./bookingTableOptions";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const filterValue = parseBookingFilter(searchParams.get("status"));
  const filter =
    filterValue === "all"
      ? null
      : ({ field: "status", value: filterValue } satisfies BookingFilter);

  const sortBy = parseBookingSort(searchParams.get("sortBy"));

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  const pageCount = Math.ceil((count ?? 0) / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { bookings, count, isLoading, error };
}
