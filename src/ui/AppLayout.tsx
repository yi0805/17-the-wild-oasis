import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 24.8rem minmax(0, 1fr);
  grid-template-rows: 7.2rem minmax(0, 1fr);
  height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-app-background);
  padding: 3.6rem 4rem 5.6rem;
  overflow: auto;

  @media (max-width: 1100px) {
    padding-inline: 3.2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 132rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />

      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
