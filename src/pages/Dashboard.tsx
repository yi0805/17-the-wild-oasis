import styled from "styled-components";

import DashboardLayout from "../features/dashboard/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DashboardFilter from "../features/dashboard/DashboardFilter";

const HorizontalRow = styled(Row)<{ type: "horizontal" }>``;

function Dashboard() {
  return (
    <>
      <HorizontalRow type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </HorizontalRow>

      <DashboardLayout />
    </>
  );
}

export default Dashboard;
