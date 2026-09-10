import styled from "styled-components";

const ErrorState = styled.p`
  padding: 4.8rem 2.4rem;
  border: 1px dashed var(--color-red-700);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-surface);
  color: var(--color-red-700);
  font-weight: 500;
  text-align: center;
`;

type QueryErrorProps = { resourceName: string };

function QueryError({ resourceName }: QueryErrorProps) {
  return (
    <ErrorState role="alert">
      {resourceName} could not be loaded. Please try again.
    </ErrorState>
  );
}

export default QueryError;
