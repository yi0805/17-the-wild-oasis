import { createContext, useContext, useState } from "react";
import type {
  MouseEvent,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

type MenuIdentifier = string | number;
type MenuPosition = { x: number; y: number };

const StyledList = styled.ul<{ $position: MenuPosition }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

type MenusContextValue = {
  openID: MenuIdentifier | null;
  open: (id: MenuIdentifier) => void;
  close: () => void;
  position: MenuPosition | null;
  setPosition: (position: MenuPosition) => void;
};

const MenusContext = createContext<MenusContextValue | undefined>(undefined);

function useMenusContext() {
  const context = useContext(MenusContext);
  if (context === undefined) {
    throw new Error("Menus components must be used within Menus");
  }
  return context;
}

type MenusProps = { children: ReactNode };
type MenuProps = { children: ReactNode };
type ToggleProps = { id: MenuIdentifier };
type ListProps = { id: MenuIdentifier; children: ReactNode };
type MenuButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
};
type MenusCompound = ((props: MenusProps) => JSX.Element) & {
  Menu: typeof Menu;
  Toggle: typeof Toggle;
  List: typeof List;
  Button: typeof Button;
};

const Menus: MenusCompound = ({ children }) => {
  const [openID, setOpenID] = useState<MenuIdentifier | null>(null);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const close = () => setOpenID(null);
  const open = setOpenID;

  return (
    <MenusContext.Provider
      value={{ openID, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
};

function Menu({ children }: MenuProps) {
  return <MenuContainer>{children}</MenuContainer>;
}

function Toggle({ id }: ToggleProps) {
  const { openID, open, close, setPosition } = useMenusContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    if (openID !== id) {
      open(id);
    } else {
      close();
    }
  };

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: ListProps) {
  const { openID, position, close } = useMenusContext();
  const ref = useOutsideClick<HTMLUListElement>(() => {
    close();
  }, false);

  if (openID !== id || position === null) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({ children, onClick, icon }: MenuButtonProps) {
  const { close } = useMenusContext();

  function handleClick() {
    if (onClick) onClick();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
