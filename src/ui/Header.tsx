import styled from "styled-components";

import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";

const StyledHeader = styled.header`
  min-width: 0;
  background-color: var(--color-surface);
  padding: 1.2rem 4rem;
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 1100px) {
    padding-inline: 3.2rem;
  }
`;

function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
