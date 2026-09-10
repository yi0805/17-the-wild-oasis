import styled from "styled-components";

import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 4rem 2.4rem;
  background:
    radial-gradient(circle at 18% 18%, var(--color-accent-soft), transparent 28rem),
    radial-gradient(circle at 82% 82%, var(--color-brand-100), transparent 32rem),
    var(--color-app-background);
`;

const LoginPanel = styled.section`
  width: min(46rem, 100%);
  padding: 4rem;
  border: 1px solid var(--color-border-subtle);
  border-top: 3px solid var(--color-accent);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
`;

const Intro = styled.div`
  margin: 1.6rem 0 2.4rem;
  text-align: center;
`;

const Eyebrow = styled.p`
  margin-bottom: 0.6rem;
  color: var(--color-accent);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const SupportingText = styled.p`
  margin-top: 0.8rem;
  color: var(--color-text-secondary);
  font-size: 1.4rem;
`;

function Login() {
  return (
    <LoginLayout>
      <LoginPanel>
        <Logo />
        <Intro>
          <Eyebrow>Operations console</Eyebrow>
          <Heading as="h4">Log in to your account</Heading>
          <SupportingText>
            Manage bookings, cabins, and guest stays.
          </SupportingText>
        </Intro>
        <LoginForm />
      </LoginPanel>
    </LoginLayout>
  );
}

export default Login;
