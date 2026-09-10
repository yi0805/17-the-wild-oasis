import styled from "styled-components";
import type {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectType = "white";

const StyledSelect = styled.select<{ $type?: SelectType }>`
  font-size: 1.4rem;
  min-height: 4rem;
  padding: 0.8rem 3.2rem 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === "white"
        ? "var(--color-border-subtle)"
        : "var(--color-border-strong)"};
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }
`;

type SelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
> & {
  options: readonly SelectOption[];
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  type?: SelectType;
};

function Select({ options, value, onChange, type, ...props }: SelectProps) {
  return (
    <StyledSelect $type={type} value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
