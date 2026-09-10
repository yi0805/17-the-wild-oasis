import styled from "styled-components";

const Textarea = styled.textarea`
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 8rem;
  resize: vertical;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }

  &:focus-visible {
    border-color: var(--color-brand-500);
  }
`;

export default Textarea;
