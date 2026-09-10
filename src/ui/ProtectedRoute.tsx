import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-grey-50);
`;

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, isFetching } = useUser();

  useEffect(
    function () {
      if (!isLoading && !isAuthenticated && !isFetching) {
        navigate("/login");
      }
    },
    [isLoading, isAuthenticated, isFetching, navigate],
  );

  if (isLoading) {
    return (
      <FullPage role="status" aria-label="Loading user">
        <Spinner />
      </FullPage>
    );
  }

  if (isAuthenticated) return children;

  return null;
}

export default ProtectedRoute;
