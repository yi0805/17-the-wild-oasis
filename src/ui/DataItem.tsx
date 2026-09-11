import styled from "styled-components";
import type { ReactNode } from "react";

const StyledDataItem = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 0.8rem 0;

  & > * {
    min-width: 0;
  }

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-wrap: wrap;
    column-gap: 1.2rem;
    row-gap: 0.6rem;
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
    flex: 0 0 auto;
  }
`;

type DataItemProps = {
  icon: ReactNode;
  label: ReactNode;
  children: ReactNode;
};

function DataItem({ icon, label, children }: DataItemProps) {
  return (
    <StyledDataItem>
      <Label>
        {icon}
        <span>{label}</span>
      </Label>
      {children}
    </StyledDataItem>
  );
}

export default DataItem;
