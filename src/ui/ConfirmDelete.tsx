import styled from "styled-components";
import type { MouseEventHandler } from "react";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const SecondaryButton = styled(Button)<{ variation: "secondary" }>``;
const DangerButton = styled(Button)<{ variation: "danger" }>``;

type ConfirmDeleteProps = {
  resourceName: string;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  onCloseModal?: MouseEventHandler<HTMLButtonElement>;
};

function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
}: ConfirmDeleteProps) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        <SecondaryButton
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </SecondaryButton>
        <DangerButton variation="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </DangerButton>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
