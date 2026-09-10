import styled from "styled-components";

const EmptyState = styled.p`
  padding: 4.8rem 2.4rem;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 500;
  text-align: center;
`;

type EmptyProps = { resourceName: string };

function Empty({ resourceName }: EmptyProps) {
  return <EmptyState>No {resourceName} could be found.</EmptyState>;
}

export default Empty;
