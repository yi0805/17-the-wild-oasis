import styled from "styled-components";

import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import { useTodayActivity } from "./useTodayActivity";
import Spinner from "../../ui/Spinner";
import QueryError from "../../ui/QueryError";
import TodayItem from "./TodayItem";

const StyledToday = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-lg);
  padding: 2.8rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  grid-column: 1 / span 2;
`;
const TodayList = styled.ul`
  overflow: auto;
  overflow-x: hidden;
  padding-right: 0.4rem;
`;
const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-top: 0.8rem;
`;
const HorizontalRow = styled(Row)<{ type: "horizontal" }>``;

function TodayActivity() {
  const { activities, isLoading, error } = useTodayActivity();

  return (
    <StyledToday>
      <HorizontalRow type="horizontal">
        <Heading as="h2">Today</Heading>
      </HorizontalRow>

      {isLoading ? (
        <Spinner role="status" aria-label="Loading today's activities" />
      ) : error ? (
        <QueryError resourceName="Today's activities" />
      ) : activities && activities.length > 0 ? (
        <TodayList>
          {activities.map((activity) => (
            <TodayItem key={activity.id} activity={activity} />
          ))}
        </TodayList>
      ) : (
        <NoActivity>No activities today</NoActivity>
      )}
    </StyledToday>
  );
}

export default TodayActivity;
