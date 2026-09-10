import styled from "styled-components";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { useDarkMode } from "../../context/DarkModeContext";
import type { getBookingsAfterDate } from "../../services/apiBookings";

type RecentBookings = Awaited<ReturnType<typeof getBookingsAfterDate>>;
type SalesDataPoint = {
  label: string;
  totalSales: number;
  extrasSales: number;
};
type SalesColors = {
  totalSales: { stroke: string; fill: string };
  extrasSales: { stroke: string; fill: string };
  text: string;
  background: string;
};

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-border-subtle);
  }

  & .recharts-default-tooltip {
    border: 1px solid var(--color-border-subtle) !important;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
  }
`;

type SalesChartProps = {
  bookings: RecentBookings;
  numDays: number;
};

function SalesChart({ bookings, numDays }: SalesChartProps) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data: SalesDataPoint[] = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + (cur.totalPrice ?? 0), 0),

      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + (cur.extrasPrice ?? 0), 0),
    };
  });

  const colors: SalesColors = isDarkMode
    ? {
        totalSales: { stroke: "#72b69a", fill: "#24483b" },
        extrasSales: { stroke: "#d0aa6d", fill: "#4b3d29" },
        text: "#bac6c0",
        background: "#202b27",
      }
    : {
        totalSales: { stroke: "#347b62", fill: "#d8ebe2" },
        extrasSales: { stroke: "#b68a4a", fill: "#f7eedf" },
        text: "#4b5852",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates[0], "MMM dd yyyy")} &mdash;{" "}
        {format(allDates[allDates.length - 1], "MMM dd yyyy")}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="3 6" vertical={false} />
          <Tooltip
            cursor={{ stroke: colors.text, strokeOpacity: 0.18 }}
            contentStyle={{ backgroundColor: colors.background }}
          />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total Sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras Sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
