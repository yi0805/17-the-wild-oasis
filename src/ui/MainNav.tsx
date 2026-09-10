import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
} from "react-icons/hi2";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const StyleNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.4rem;

    color: var(--color-grey-600);
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1.15rem 1.4rem;
    border: 1px solid transparent;
    border-radius: var(--border-radius-md);
    transition:
      color 0.18s ease,
      background-color 0.18s ease,
      border-color 0.18s ease,
      transform 0.18s ease;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-brand-100);
    border-color: var(--color-brand-200);
  }

  &:hover {
    transform: translateX(2px);
  }

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-grey-400);
    transition: color 0.18s ease;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-500);
  }
`;

function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyleNavLink to="/dashboard">
            <HiOutlineHome />
            <span>Home</span>
          </StyleNavLink>
        </li>
        <li>
          <StyleNavLink to="/bookings">
            <HiOutlineCalendarDays />
            <span>Bookings</span>
          </StyleNavLink>
        </li>
        <li>
          <StyleNavLink to="/cabins">
            <HiOutlineHomeModern />
            <span>Cabins</span>
          </StyleNavLink>
        </li>
        <li>
          <StyleNavLink to="/settings">
            <HiOutlineCog6Tooth />
            <span>Settings</span>
          </StyleNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
