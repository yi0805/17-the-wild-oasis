import { useState, type FormEvent } from "react";
import styled from "styled-components";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";
import { useLogin } from "./useLogin";

const LargeButton = styled(Button)<{ size: "large" }>``;
const LoginFormShell = styled(Form)`
  padding: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) return;

    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      },
    );
  }

  return (
    <LoginFormShell onSubmit={handleSubmit}>
      <FormRowVertical label="Email address" error={undefined}>
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical label="Password" error={undefined}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical label={undefined} error={undefined}>
        <LargeButton size="large" disabled={isLoading}>
          {!isLoading ? "Log in" : <SpinnerMini />}
        </LargeButton>
      </FormRowVertical>
    </LoginFormShell>
  );
}

export default LoginForm;
