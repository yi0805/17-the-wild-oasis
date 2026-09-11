import type { RefObject } from "react";
import styled from "styled-components";
import { HiOutlineBars3 } from "react-icons/hi2";

import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";
import ButtonIcon from "./ButtonIcon";

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

  @media (max-width: 900px) {
    padding-inline: 2rem;
    justify-content: space-between;
  }
`;

const NavigationToggle = styled(ButtonIcon)`
  display: none;

  @media (max-width: 900px) {
    display: grid;
    flex: none;
  }
`;

const HeaderActions = styled.div`
  display: contents;

  @media (max-width: 900px) {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 1.2rem;

    & > :first-child {
      min-width: 0;
    }

    & > :first-child span {
      display: block;
      max-width: min(18vw, 12rem);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

type HeaderProps = {
  isNavigationOpen: boolean;
  onNavigationToggle: () => void;
  navigationToggleRef: RefObject<HTMLButtonElement>;
};

function Header({
  isNavigationOpen,
  onNavigationToggle,
  navigationToggleRef,
}: HeaderProps) {
  return (
    <StyledHeader>
      <NavigationToggle
        aria-controls="primary-navigation"
        aria-expanded={isNavigationOpen}
        aria-label="Toggle navigation"
        onClick={onNavigationToggle}
        ref={navigationToggleRef}
      >
        <HiOutlineBars3 />
      </NavigationToggle>
      <HeaderActions>
        <UserAvatar />
        <HeaderMenu />
      </HeaderActions>
    </StyledHeader>
  );
}

export default Header;
