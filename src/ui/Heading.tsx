import styled, { css } from "styled-components";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

const Heading = styled.h1<{ as?: HeadingLevel }>`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 700;
      letter-spacing: -0.04em;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 650;
      letter-spacing: -0.02em;
    `}

    ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 650;
      letter-spacing: -0.02em;
    `}

     ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 2.8rem;
      font-weight: 700;
      letter-spacing: -0.035em;
      text-align: center;
    `}


  color: var(--color-text-primary);
  line-height: 1.2;
`;

export default Heading;
