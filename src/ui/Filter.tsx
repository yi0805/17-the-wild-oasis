import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import type { SelectOption } from "./Select";

const StyledFilter = styled.div`
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-md);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  min-height: 3rem;
  background-color: transparent;
  border: none;

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-on-brand);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.5rem 1rem;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-on-brand);
  }
`;

type FilterProps = {
  filterField: string;
  options: readonly SelectOption[];
};

function Filter({ filterField, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultFilter = options[0]?.value;

  if (defaultFilter === undefined) return null;

  const currentFilter = searchParams.get(filterField) || defaultFilter;

  function handleClick(value: string) {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) {
      searchParams.set("page", "1");
    }
    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          $active={currentFilter === option.value}
          disabled={currentFilter === option.value}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;
