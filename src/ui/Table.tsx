import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  width: 100%;
  border: 1px solid var(--color-border-subtle);
  font-size: 1.4rem;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
`;

const CommonRow = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
  min-width: 90rem;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.4rem 2.4rem;

  background-color: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-grey-500);
`;

const StyledRow = styled(CommonRow)`
  min-height: 6.4rem;
  padding: 1.15rem 2.4rem;
  transition: background-color 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-subtle);
  }

  &:hover {
    background-color: var(--color-surface-secondary);
  }
`;

const StyledBody = styled.section`
  min-width: 90rem;
`;

const Footer = styled.footer`
  min-width: 90rem;
  background-color: var(--color-surface-secondary);
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  justify-content: center;
  padding: 1.2rem 1.6rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
  color: var(--color-text-secondary);
`;

type TableContextValue = { columns: string };
type TableProps = { columns: string; children: ReactNode };
type TableSectionProps = { children: ReactNode };
type TableBodyProps<T> = {
  data: readonly T[];
  render: (item: T) => ReactNode;
};
type TableCompound = ((props: TableProps) => JSX.Element) & {
  Header: typeof Header;
  Row: typeof Row;
  Body: typeof Body;
  Footer: typeof Footer;
};

const TableContext = createContext<TableContextValue | undefined>(undefined);

function useTableContext() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("Table sections must be used within Table");
  }
  return context;
}

const Table: TableCompound = ({ columns, children }) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
};

function Header({ children }: TableSectionProps) {
  const { columns } = useTableContext();
  return (
    <StyledHeader as="header" $columns={columns}>
      {children}
    </StyledHeader>
  );
}

function Row({ children }: TableSectionProps) {
  const { columns } = useTableContext();
  return (
    <StyledRow role="row" $columns={columns}>
      {children}
    </StyledRow>
  );
}

function Body<T>({ data, render }: TableBodyProps<T>) {
  if (!data.length) {
    return <Empty>No data to show at the moment</Empty>;
  }

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
