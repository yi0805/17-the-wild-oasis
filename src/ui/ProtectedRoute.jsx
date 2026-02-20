import styled from "styled-components";

import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-grey-50);
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthneticated } = useUser();

  useEffect(
    function () {
      if (!isLoading && !isAuthneticated) {
        navigate("/login");
      }
    },
    [isLoading, isAuthneticated, navigate],
  );

  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  if (isAuthneticated) return children;
}

export default ProtectedRoute;
