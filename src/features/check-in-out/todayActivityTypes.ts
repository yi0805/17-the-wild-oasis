import type { getStaysTodayActivity } from "../../services/apiBookings";

type TodayActivityResult = Awaited<ReturnType<typeof getStaysTodayActivity>>;

export type TodayActivityItem = NonNullable<TodayActivityResult>[number];
export type TodayActivityStatus = "unconfirmed" | "checked-in";

export function isTodayActivityStatus(
  value: TodayActivityItem["status"],
): value is TodayActivityStatus {
  return value === "unconfirmed" || value === "checked-in";
}
