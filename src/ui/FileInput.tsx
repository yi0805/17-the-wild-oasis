import styled from "styled-components";

const FileInput = styled.input.attrs({ type: "file" })`
  font-size: 1.4rem;
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-md);

  &::file-selector-button {
    font: inherit;
    font-weight: 600;
    padding: 0.9rem 1.2rem;
    margin-right: 1.2rem;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-brand-600);
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    cursor: pointer;
    transition: background-color 0.18s ease;

    &:hover {
      background-color: var(--color-brand-700);
    }
  }
`;

export default FileInput;
