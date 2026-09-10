import styled from "styled-components";

const Input = styled.input`
  min-height: 4.2rem;
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: 0.9rem 1.2rem;
  box-shadow: var(--shadow-sm);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }

  &:focus-visible {
    border-color: var(--color-brand-500);
  }
`;

export default Input;
