import styled, { css } from "styled-components";

type RowType = "horizontal" | "vertical";

const Row = styled.div<{ type?: RowType }>`
  display: flex;

  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    `}

  ${(props) =>
    (props.type ?? "vertical") === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

export default Row;
