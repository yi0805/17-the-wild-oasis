import styled from "styled-components";

import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-surface);
  padding: 2.4rem 2rem;
  border-right: 1px solid var(--color-border-subtle);
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.6rem;
  box-shadow: 1px 0 0 rgba(25, 48, 38, 0.02);
  z-index: 1;

  & > div:first-child {
    padding-bottom: 2.4rem;
    border-bottom: 1px solid var(--color-border-subtle);
  }
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}

export default Sidebar;
