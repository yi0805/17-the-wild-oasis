import styled from "styled-components";
import { isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: minmax(18rem, 24rem) minmax(18rem, 1fr) minmax(12rem, 1.1fr);
  gap: 2rem;

  padding: 1.5rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-subtle);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  color: var(--color-grey-700);
  font-weight: 600;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
  line-height: 1.35;
`;

type FormControlChild = ReactElement<{ id?: string }>;
type FormRowProps = {
  label?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

function getControlId(children: ReactNode) {
  if (
    isValidElement<FormControlChild["props"]>(children) &&
    typeof children.props.id === "string"
  ) {
    return children.props.id;
  }
  return undefined;
}

function FormRow({ label, error, children }: FormRowProps) {
  const controlId = getControlId(children);

  return (
    <StyledFormRow>
      {label && <Label htmlFor={controlId}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
