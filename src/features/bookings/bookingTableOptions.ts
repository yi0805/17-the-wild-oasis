import type { getBookings } from "../../services/apiBookings";

type BookingListOptions = Parameters<typeof getBookings>[0];
type BookingListResult = Awaited<ReturnType<typeof getBookings>>;

export type BookingListItem = NonNullable<BookingListResult["data"]>[number];
export type BookingFilter = NonNullable<BookingListOptions["filter"]>;
export type BookingSort = NonNullable<BookingListOptions["sortBy"]>;

export const bookingFilterOptions = [
  { value: "all", label: "All" },
  { value: "checked-out", label: "Checked out" },
  { value: "checked-in", label: "Checked in" },
  { value: "unconfirmed", label: "Unconfirmed" },
] as const;

export type BookingFilterValue =
  (typeof bookingFilterOptions)[number]["value"];
export type BookingStatus = Exclude<BookingFilterValue, "all">;

export const bookingSortOptions = [
  {
    value: "startDate-desc",
    label: "Sort by date (recent first)",
    sort: { field: "startDate", direction: "desc" },
  },
  {
    value: "startDate-asc",
    label: "Sort by date (earlier first)",
    sort: { field: "startDate", direction: "asc" },
  },
  {
    value: "totalPrice-desc",
    label: "Sort by amount (high first)",
    sort: { field: "totalPrice", direction: "desc" },
  },
  {
    value: "totalPrice-asc",
    label: "Sort by amount (low first)",
    sort: { field: "totalPrice", direction: "asc" },
  },
] as const;

export type BookingSortValue = (typeof bookingSortOptions)[number]["value"];

export function isBookingStatus(
  value: BookingListItem["status"],
): value is BookingStatus {
  return (
    typeof value === "string" &&
    bookingFilterOptions.some(
      (option) => option.value !== "all" && option.value === value,
    )
  );
}

export function parseBookingFilter(value: string | null): BookingFilterValue {
  return isBookingStatus(value) ? value : "all";
}

function isBookingSortValue(value: string): value is BookingSortValue {
  return bookingSortOptions.some((option) => option.value === value);
}

export function parseBookingSort(value: string | null): BookingSort {
  if (!value || !isBookingSortValue(value)) {
    return { field: "startDate", direction: "desc" };
  }

  const sortOption = bookingSortOptions.find((option) => option.value === value);
  if (sortOption) return sortOption.sort;

  return { field: "startDate", direction: "desc" };
}
