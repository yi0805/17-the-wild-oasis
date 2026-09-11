import styled from "styled-components";

import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import QueryError from "../../ui/QueryError";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: auto 36rem auto;
  gap: 2rem;

  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto auto 36rem auto;
  }
`;

function DashboardLayout() {
  const {
    bookings,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useRecentBookings();

  const {
    confirmedStays,
    isLoading: isLoadingStays,
    numDays,
    error: staysError,
  } = useRecentStays();

  const {
    cabins,
    isLoading: isLoadingCabins,
    error: cabinsError,
  } = useCabins();

  if (isLoadingBookings || isLoadingStays || isLoadingCabins) {
    return <Spinner role="status" aria-label="Loading dashboard" />;
  }

  if (bookingsError || staysError || cabinsError) {
    return <QueryError resourceName="Dashboard" />;
  }

  if (!bookings || !confirmedStays || !cabins) {
    throw new Error("Dashboard data could not be loaded");
  }

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />

      <TodayActivity />

      <DurationChart confirmedStays={confirmedStays} />

      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
