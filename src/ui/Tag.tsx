import styled from "styled-components";

type TagType = "blue" | "green" | "yellow" | "silver" | "indigo";

const Tag = styled.span<{ type: TagType }>`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.07em;
  padding: 0.55rem 1rem;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 999px;

  /* Make these dynamic, based on the received prop */
  color: var(--color-${(props) => props.type}-700);
  background-color: var(--color-${(props) => props.type}-100);
`;

export default Tag;
