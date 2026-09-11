import styled from "styled-components";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import Heading from "../../ui/Heading";
import { useDarkMode } from "../../context/DarkModeContext";
import type { getStaysAfterDate } from "../../services/apiBookings";

type RecentStays = Awaited<ReturnType<typeof getStaysAfterDate>>;
type Duration =
  | "1 night"
  | "2 nights"
  | "3 nights"
  | "4-5 nights"
  | "6-7 nights"
  | "8-14 nights"
  | "15-21 nights"
  | "21+ nights";
type DurationDataPoint = {
  duration: Duration;
  value: number;
  color: string;
};

const ChartBox = styled.div`
  min-width: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  padding: 2.8rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }

  & .recharts-default-tooltip {
    border: 1px solid var(--color-border-subtle) !important;
    border-radius: var(--border-radius-md);
    background-color: var(--color-surface-elevated) !important;
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 1150px) {
    grid-column: 1 / -1;
  }

  @media (max-width: 700px) {
    padding: 2rem;
  }
`;

const ChartContent = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.2rem;
  }
`;

const ChartCanvas = styled.div`
  min-width: 0;
  height: 24rem;

  @media (max-width: 700px) {
    height: 22rem;
  }
`;

const LegendList = styled.ul`
  min-width: 12rem;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.8rem;
  color: var(--color-grey-600);

  @media (max-width: 700px) {
    min-width: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 1.2rem;
  }
`;

const LegendItem = styled.li`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  font-weight: 500;

  & span:last-child {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 1.2rem;
  height: 1.2rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

const startDataLight: DurationDataPoint[] = [
  {
    duration: "1 night",
    value: 0,
    color: "#b85c56",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#c47a4c",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#c39a4c",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#8e9e55",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#5b936f",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#4d9188",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#527f9b",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#776b96",
  },
];

const startDataDark: DurationDataPoint[] = [
  {
    duration: "1 night",
    value: 0,
    color: "#9b5350",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#a96542",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#aa8747",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#7d8a4e",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#4e8061",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#477d76",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#466e88",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#655b80",
  },
];

function prepareData(
  startData: DurationDataPoint[],
  stays: RecentStays,
): DurationDataPoint[] {
  // A bit ugly code, but sometimes this is what it takes when working with real data 😅

  function incArrayValue(arr: DurationDataPoint[], field: Duration) {
    return arr.map((obj) =>
      obj.duration === field ? { ...obj, value: obj.value + 1 } : obj,
    );
  }

  const data = stays
    .reduce((arr, cur) => {
      const num = cur.numNights;
      if (num === null) return arr;
      if (num === 1) return incArrayValue(arr, "1 night");
      if (num === 2) return incArrayValue(arr, "2 nights");
      if (num === 3) return incArrayValue(arr, "3 nights");
      if (num === 4 || num === 5) return incArrayValue(arr, "4-5 nights");
      if (num === 6 || num === 7) return incArrayValue(arr, "6-7 nights");
      if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
      if (num >= 15 && num <= 21) return incArrayValue(arr, "15-21 nights");
      if (num >= 21) return incArrayValue(arr, "21+ nights");
      return arr;
    }, startData)
    .filter((obj) => obj.value > 0);

  return data;
}

type DurationChartProps = {
  confirmedStays: RecentStays;
};

function DurationChart({ confirmedStays }: DurationChartProps) {
  const { isDarkMode } = useDarkMode();
  const startDate = isDarkMode ? startDataDark : startDataLight;
  const data = prepareData(startDate, confirmedStays);

  return (
    <ChartBox>
      <Heading as="h2">Stay duration summary</Heading>

      <ChartContent>
        <ChartCanvas>
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                data={data}
                nameKey="duration"
                valueKey="value"
                innerRadius="58%"
                outerRadius="84%"
                cx="50%"
                cy="50%"
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    fill={entry.color}
                    stroke={entry.color}
                    key={entry.duration}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCanvas>

        <LegendList aria-label="Stay duration legend">
          {data.map((entry) => (
            <LegendItem key={entry.duration}>
              <LegendDot $color={entry.color} aria-hidden="true" />
              <span>
                {entry.duration}: {entry.value}
              </span>
            </LegendItem>
          ))}
        </LegendList>
      </ChartContent>
    </ChartBox>
  );
}

export default DurationChart;
