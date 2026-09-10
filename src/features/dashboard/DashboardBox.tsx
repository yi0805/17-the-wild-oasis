import styled from "styled-components";

const DashboardBox = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  padding: 2.8rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default DashboardBox;
