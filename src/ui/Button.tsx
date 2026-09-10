import styled, { css } from "styled-components";
import type { ButtonHTMLAttributes } from "react";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariation = "primary" | "secondary" | "danger";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variation?: ButtonVariation;
};

const sizes: Record<ButtonSize, ReturnType<typeof css>> = {
  small: css`
    font-size: 1.2rem;
    min-height: 3.2rem;
    padding: 0.6rem 1rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    min-height: 4rem;
    padding: 0.9rem 1.6rem;
    font-weight: 600;
  `,
  large: css`
    font-size: 1.6rem;
    min-height: 4.8rem;
    padding: 1.1rem 2.4rem;
    font-weight: 600;
  `,
};

const variations: Record<ButtonVariation, ReturnType<typeof css>> = {
  primary: css`
    color: var(--color-on-brand);
    background-color: var(--color-brand-600);
    border: 1px solid var(--color-brand-600);

    &:hover:not(:disabled) {
      background-color: var(--color-brand-700);
      border-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-border-strong);

    &:hover:not(:disabled) {
      background-color: var(--color-surface-secondary);
      color: var(--color-grey-800);
    }
  `,
  danger: css`
    color: var(--color-on-danger);
    background-color: var(--color-danger-surface);
    border: 1px solid var(--color-danger-surface);

    &:hover:not(:disabled) {
      background-color: var(--color-danger-hover);
      border-color: var(--color-danger-hover);
    }
  `,
};

const Button = styled.button<ButtonProps>`
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: none;
  }

  ${(props) => sizes[props.size ?? "medium"]};
  ${(props) => variations[props.variation ?? "primary"]};
`;

export default Button;
