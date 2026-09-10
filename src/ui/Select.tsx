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
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
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
