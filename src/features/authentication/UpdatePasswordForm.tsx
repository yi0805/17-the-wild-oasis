import { type SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdateUser } from "./useUpdateUser";

const SecondaryButton = styled(Button)<{ variation: "secondary" }>``;

type PasswordFormValues = {
  password: string;
  passwordConfirm: string;
};

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } =
    useForm<PasswordFormValues>();
  const { errors } = formState;
  const { updateUser, isUpdating } = useUpdateUser();

  const onSubmit: SubmitHandler<PasswordFormValues> = ({ password }) => {
    updateUser({ password }, { onSuccess: () => reset() });
  };

  function handleCancel() {
    reset();
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New Password (min 8 chars)"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Confirm password" error={errors.passwordConfirm?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues("password") === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow label={undefined} error={undefined}>
        <SecondaryButton onClick={handleCancel} type="reset" variation="secondary">
          Cancel
        </SecondaryButton>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
