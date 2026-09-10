import styled from "styled-components";

const ButtonText = styled.button`
  color: var(--color-brand-500);
  font-weight: 600;
  text-align: center;
  padding: 0.4rem;
  transition: color 0.18s ease;
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);

  &:hover,
  &:active {
    color: var(--color-brand-800);
  }
`;

export default ButtonText;
