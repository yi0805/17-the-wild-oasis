import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";

import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";
import type {
  getBookingsAfterDate,
  getStaysAfterDate,
} from "../../services/apiBookings";

type RecentBookings = Awaited<ReturnType<typeof getBookingsAfterDate>>;
type RecentStays = Awaited<ReturnType<typeof getStaysAfterDate>>;
type StatsProps = {
  bookings: RecentBookings;
  confirmedStays: RecentStays;
  numDays: number;
  cabinCount: number;
};

function Stats({
  bookings,
  confirmedStays,
  numDays,
  cabinCount,
}: StatsProps) {
  const numBookings = bookings.length;
  const sales = bookings.reduce(
    (total, booking) => total + (booking.totalPrice ?? 0),
    0,
  );
  const checkins = confirmedStays.length;

  const occupation =
    confirmedStays.reduce((total, stay) => total + (stay.numGuests ?? 0), 0) /
    (cabinCount * numDays);

  return (
    <>
      <Stat
        title="Bookings"
        value={numBookings}
        color="blue"
        icon={<HiOutlineBriefcase />}
      />
      <Stat
        title="sales"
        value={formatCurrency(sales)}
        color="green"
        icon={<HiOutlineBanknotes />}
      />
      <Stat
        title="Check ins"
        value={checkins}
        color="indigo"
        icon={<HiOutlineCalendarDays />}
      />
      <Stat
        title="Occupancy rate"
        value={Math.round(occupation * 100) + "%"}
        color="yellow"
        icon={<HiOutlineChartBar />}
      />
    </>
  );
}

export default Stats;
