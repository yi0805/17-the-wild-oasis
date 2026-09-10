import styled from "styled-components";
import { isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1rem 0;
`;

const Label = styled.label`
  color: var(--color-grey-700);
  font-weight: 600;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

type FormControlChild = ReactElement<{ id?: string }>;
type FormRowVerticalProps = {
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

function FormRowVertical({ label, error, children }: FormRowVerticalProps) {
  const controlId = getControlId(children);

  return (
    <StyledFormRow>
      {label && <Label htmlFor={controlId}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRowVertical;
