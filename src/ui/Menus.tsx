import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  KeyboardEvent,
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
  border: 1px solid transparent;
  padding: 0.4rem;
  border-radius: var(--border-radius-md);
  transform: translateX(0.8rem);
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background-color: var(--color-brand-100);
    border-color: var(--color-brand-200);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-600);
  }
`;

type MenuIdentifier = string | number;
type MenuPosition = { x: number; y: number };
type MenuFocusTarget = "first" | "last" | null;

const StyledList = styled.ul<{ $position: MenuPosition }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  min-width: 18rem;
  padding: 0.5rem;
  z-index: 1200;

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem 1.2rem;
  font-size: 1.4rem;
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  transition: background-color 0.16s ease;

  display: flex;
  align-items: center;
  gap: 1.2rem;

  &:hover {
    background-color: var(--color-brand-100);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-500);
  }
`;

type MenusContextValue = {
  openID: MenuIdentifier | null;
  open: (
    id: MenuIdentifier,
    toggle: HTMLButtonElement,
    focusTarget: MenuFocusTarget,
  ) => void;
  close: (restoreFocus?: boolean) => void;
  focusToggle: () => void;
  focusTarget: MenuFocusTarget;
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
type ToggleProps = { ariaLabel: string; id: MenuIdentifier };
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
  const [focusTarget, setFocusTarget] = useState<MenuFocusTarget>(null);
  const activeToggleRef = useRef<HTMLButtonElement | null>(null);

  const focusToggle = useCallback(() => {
    const toggle = activeToggleRef.current;
    if (toggle?.isConnected && !toggle.disabled) toggle.focus();
  }, []);

  const close = useCallback(
    (restoreFocus = false) => {
      setOpenID(null);
      setFocusTarget(null);
      if (restoreFocus) focusToggle();
    },
    [focusToggle],
  );

  const open = useCallback(
    (
      id: MenuIdentifier,
      toggle: HTMLButtonElement,
      requestedFocusTarget: MenuFocusTarget,
    ) => {
      activeToggleRef.current = toggle;
      setFocusTarget(requestedFocusTarget);
      setOpenID(id);
    },
    [],
  );

  return (
    <MenusContext.Provider
      value={{
        openID,
        open,
        close,
        focusToggle,
        focusTarget,
        position,
        setPosition,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
};

function Menu({ children }: MenuProps) {
  return <MenuContainer>{children}</MenuContainer>;
}

function Toggle({ ariaLabel, id }: ToggleProps) {
  const { openID, open, close, setPosition } = useMenusContext();

  function setMenuPosition(toggle: HTMLButtonElement) {
    const rect = toggle.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
  }

  function openMenu(
    toggle: HTMLButtonElement,
    focusTarget: MenuFocusTarget,
  ) {
    setMenuPosition(toggle);
    open(id, toggle, focusTarget);
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (openID !== id) {
      openMenu(event.currentTarget, null);
    } else {
      close();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(event.currentTarget, "first");
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(event.currentTarget, "last");
    }
  };

  return (
    <StyledToggle
      aria-expanded={openID === id}
      aria-haspopup="menu"
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: ListProps) {
  const { openID, position, close, focusTarget, focusToggle } = useMenusContext();
  const isOpen = openID === id && position !== null;
  const ref = useOutsideClick<HTMLUListElement>(() => {
    close();
  }, false, isOpen);

  const getMenuItems = useCallback(() => {
    if (!ref.current) return [];

    return Array.from(
      ref.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ).filter((item) => !item.disabled);
  }, [ref]);

  useEffect(() => {
    if (!isOpen || !focusTarget) return;

    const menuItems = getMenuItems();
    const item =
      focusTarget === "first" ? menuItems[0] : menuItems[menuItems.length - 1];
    item?.focus();
  }, [focusTarget, getMenuItems, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close, isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "Tab") {
      focusToggle();
      close();
      return;
    }

    const menuItems = getMenuItems();
    if (!menuItems.length) return;

    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLButtonElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      menuItems[
        currentIndex === -1 ? 0 : (currentIndex + 1) % menuItems.length
      ].focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      menuItems[
        currentIndex === -1
          ? menuItems.length - 1
          : (currentIndex - 1 + menuItems.length) % menuItems.length
      ].focus();
    }

    if (event.key === "Home") {
      event.preventDefault();
      menuItems[0].focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      menuItems[menuItems.length - 1].focus();
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <StyledList $position={position} onKeyDown={handleKeyDown} ref={ref} role="menu">
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({ children, onClick, icon }: MenuButtonProps) {
  const { close, focusToggle } = useMenusContext();

  function handleClick() {
    focusToggle();
    if (onClick) onClick();
    close();
  }

  return (
    <li role="none">
      <StyledButton onClick={handleClick} role="menuitem">
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
