import { cloneElement, createContext, useContext, useState } from "react";
import type { MouseEventHandler, ReactElement, ReactNode } from "react";
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
  open: (name: string) => void;
  openName: string;
};
type ModalProps = { children: ReactNode };
type ModalOpenProps = {
  children: ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
  opens: string;
};
type ModalWindowProps = {
  children: ReactElement<{ onCloseModal?: () => void }>;
  name: string;
};
type ModalCompound = ((props: ModalProps) => JSX.Element) & {
  Open: typeof Open;
  Window: typeof Window;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("Modal components must be used within Modal");
  }
  return context;
}

const Modal: ModalCompound = ({ children }) => {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ close, open, openName }}>
      {children}
    </ModalContext.Provider>
  );
};

function Open({ children, opens: opensWindowName }: ModalOpenProps) {
  const { open } = useModalContext();

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }: ModalWindowProps) {
  const { openName, close } = useModalContext();
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
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
