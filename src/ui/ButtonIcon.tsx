import styled from "styled-components";

const ButtonIcon = styled.button`
  display: grid;
  place-items: center;
  width: 3.8rem;
  height: 3.8rem;
  background: transparent;
  border: 1px solid transparent;
  padding: 0.7rem;
  border-radius: var(--border-radius-md);
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-50);
    border-color: var(--color-brand-100);
  }

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-brand-500);
  }
`;

export default ButtonIcon;
