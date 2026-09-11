import styled, { css } from "styled-components";
import type { FormHTMLAttributes } from "react";

type FormType = "regular" | "modal";
type FormProps = FormHTMLAttributes<HTMLFormElement> & { type?: FormType };

const Form = styled.form<FormProps>`
  ${(props) =>
    (props.type ?? "regular") === "regular" &&
    css`
      padding: 2.8rem 3.2rem;

      background-color: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);

      @media (max-width: 700px) {
        padding: 2rem;
      }
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: min(80rem, calc(100vw - 8rem));
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

export default Form;
