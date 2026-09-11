import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  KeyboardEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";

import useOutsideClick from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-lg);
  padding: 3.6rem 4rem;
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);
  overflow: auto;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(6px);
  z-index: 1000;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-brand-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

type ModalContextValue = {
  close: () => void;
  open: (name: string, opener: HTMLElement | null) => void;
  openName: string;
};
type ModalProps = { children: ReactNode };
type ModalOpenProps = {
  children: ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
  opens: string;
};
type ModalWindowProps = {
  ariaLabel: string;
  children: ReactElement<{ onCloseModal?: () => void }>;
  name: string;
};
type ModalCompound = ((props: ModalProps) => JSX.Element) & {
  Open: typeof Open;
  Window: typeof Window;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("Modal components must be used within Modal");
  }
  return context;
}

const Modal: ModalCompound = ({ children }) => {
  const [openName, setOpenName] = useState("");
  const openerRef = useRef<HTMLElement | null>(null);
  const previousOpenNameRef = useRef("");

  const close = useCallback(() => setOpenName(""), []);
  const open = useCallback((name: string, opener: HTMLElement | null) => {
    openerRef.current = opener;
    setOpenName(name);
  }, []);

  useEffect(() => {
    if (previousOpenNameRef.current && !openName) {
      const opener = openerRef.current;
      if (opener?.isConnected && !opener.matches(":disabled")) {
        opener.focus();
      }
    }

    previousOpenNameRef.current = openName;
  }, [openName]);

  return (
    <ModalContext.Provider value={{ close, open, openName }}>
      {children}
    </ModalContext.Provider>
  );
};

function Open({ children, opens: opensWindowName }: ModalOpenProps) {
  const { open } = useModalContext();

  const handleOpen: MouseEventHandler<HTMLElement> = (event) => {
    const opener =
      event?.currentTarget instanceof HTMLElement
        ? event.currentTarget
        : document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

    open(opensWindowName, opener);
  };

  return cloneElement(children, { onClick: handleOpen });
}

function Window({ ariaLabel, children, name }: ModalWindowProps) {
  const { openName, close } = useModalContext();
  const isOpen = name === openName;
  const ref = useOutsideClick<HTMLDivElement>(close, true, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close, isOpen]);

  useEffect(() => {
    if (isOpen) ref.current?.focus();
  }, [isOpen, ref]);

  function handleTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !ref.current) return;

    const focusableElements = Array.from(
      ref.current.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter(
      (element) =>
        element.getAttribute("aria-hidden") !== "true" && element.tabIndex >= 0,
    );

    if (!focusableElements.length) {
      event.preventDefault();
      ref.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (
      event.shiftKey &&
      (activeElement === firstElement || activeElement === ref.current)
    ) {
      event.preventDefault();
      lastElement.focus();
    }

    if (
      !event.shiftKey &&
      (activeElement === lastElement || activeElement === ref.current)
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <Overlay>
      <StyledModal
        aria-label={ariaLabel}
        aria-modal="true"
        onKeyDown={handleTab}
        ref={ref}
        role="dialog"
        tabIndex={-1}
      >
        <Button aria-label="Close dialog" onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
