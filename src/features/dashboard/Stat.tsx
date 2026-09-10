import styled from "styled-components";
import type { ReactNode } from "react";

type StatColor = "blue" | "green" | "indigo" | "yellow";

const StyledStat = styled.div`
  position: relative;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  padding: 1.8rem;
  display: grid;
  grid-template-columns: 5.6rem minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 1.4rem;
  row-gap: 0.5rem;

  &::after {
    position: absolute;
    right: -2rem;
    bottom: -3rem;
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    background-color: var(--color-brand-100);
    content: "";
    opacity: 0.7;
  }
`;

const Icon = styled.div<{ $color: StatColor }>`
  grid-row: 1 / -1;
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;

  /* Make these dynamic, based on the received prop */
  background-color: var(--color-${(props) => props.$color}-100);

  & svg {
    width: 3.2rem;
    height: 3.2rem;
    color: var(--color-${(props) => props.$color}-700);
  }
`;

const Title = styled.h5`
  align-self: end;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-weight: 700;
  color: var(--color-grey-500);
`;

const Value = styled.p`
  position: relative;
  z-index: 1;
  font-size: 2.5rem;
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: var(--color-text-primary);
`;

type StatProps = {
  icon: ReactNode;
  title: string;
  value: ReactNode;
  color: StatColor;
};

function Stat({ icon, title, value, color }: StatProps) {
  return (
    <StyledStat>
      <Icon $color={color}>{icon}</Icon>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </StyledStat>
  );
}

export default Stat;
