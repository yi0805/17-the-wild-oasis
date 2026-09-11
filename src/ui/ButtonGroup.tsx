import styled from "styled-components";

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: flex-end;

  @media (max-width: 700px) {
    justify-content: flex-start;
  }
`;

export default ButtonGroup;
