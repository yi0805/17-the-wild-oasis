import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import MainNav from "./MainNav";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 24.8rem minmax(0, 1fr);
  grid-template-rows: 7.2rem minmax(0, 1fr);
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
  height: 100dvh;
  width: 100%;
  min-width: 0;
  overflow-x: hidden;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr);
    grid-template-areas:
      "header"
      "navigation"
      "main";
  }
`;

const Main = styled.main`
  grid-area: main;
  min-width: 0;
  background-color: var(--color-app-background);
  padding: 3.6rem 4rem 5.6rem;
  overflow: auto;

  @media (max-width: 1100px) {
    padding-inline: 3.2rem;
  }

  @media (max-width: 900px) {
    padding: 2.8rem 2rem 4rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 132rem;
  min-width: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
`;

const MobileNavigation = styled.div`
  grid-area: navigation;
  min-width: 0;
  padding: 1.6rem 2rem 2rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-sm);
`;

function AppLayout() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const navigationToggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsNavigationOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isNavigationOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setIsNavigationOpen(false);
      navigationToggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isNavigationOpen]);

  return (
    <StyledAppLayout>
      <Header
        isNavigationOpen={isNavigationOpen}
        navigationToggleRef={navigationToggleRef}
        onNavigationToggle={() => setIsNavigationOpen((isOpen) => !isOpen)}
      />
      <Sidebar />
      {isNavigationOpen && (
        <MobileNavigation>
          <MainNav ariaLabel="Mobile primary navigation" id="primary-navigation" />
        </MobileNavigation>
      )}

      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
