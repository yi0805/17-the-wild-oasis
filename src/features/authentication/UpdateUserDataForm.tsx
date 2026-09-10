import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUpdateUser } from "./useUpdateUser";
import { useUser } from "./useUser";

const SecondaryButton = styled(Button)<{ variation: "secondary" }>``;

function getStringMetadataValue(metadata: unknown, key: string) {
  if (typeof metadata !== "object" || metadata === null) return "";

  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function UpdateUserDataForm() {
  const { user } = useUser();
  const { updateUser, isUpdating } = useUpdateUser();
  const currentFullName = getStringMetadataValue(user?.user_metadata, "fullName");
  const email = typeof user?.email === "string" ? user.email : "";
  const isUserAvailable = Boolean(user);

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(currentFullName);
  }, [currentFullName]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim()) return;

    const form = event.currentTarget;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          form.reset();
          if (avatarInputRef.current) avatarInputRef.current.value = "";
        },
      },
    );
  }

  function handleFullNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFullName(event.target.value);
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    setAvatar(event.target.files?.[0] ?? null);
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  const isDisabled = isUpdating || !isUserAvailable;

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address" error={undefined}>
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name" error={undefined}>
        <Input
          type="text"
          value={fullName}
          onChange={handleFullNameChange}
          id="fullName"
          disabled={isDisabled}
        />
      </FormRow>
      <FormRow label="Avatar image" error={undefined}>
        <FileInput
          id="avatar"
          ref={avatarInputRef}
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={isDisabled}
        />
      </FormRow>
      <FormRow label={undefined} error={undefined}>
        <SecondaryButton
          type="reset"
          variation="secondary"
          onClick={handleCancel}
          disabled={isDisabled}
        >
          Cancel
        </SecondaryButton>
        <Button disabled={isDisabled}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
