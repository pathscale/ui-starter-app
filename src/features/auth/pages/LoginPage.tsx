import {
  AuthCard,
  AuthErrorMessage,
  AuthFieldGroup,
  AuthPoweredBy,
  AuthSubmitButton,
  Flex,
  Icon,
  Input,
  PasswordField,
} from "@pathscale/ui";
import { A } from "@solidjs/router";
import { type Component, createSignal } from "solid-js";
import { ROUTES } from "~/config/routes";

const LoginPage: Component = () => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!username().trim() || !password()) {
      setError("Enter your username and password.");
      return;
    }
    setError(null);
    // TODO: call your auth service here.
  };

  return (
    <Flex direction="col" align="center" justify="center" class="flex-1">
      <div class="w-full max-w-md">
        <AuthCard title="Welcome back" description="Sign in to your account">
          <form onSubmit={handleSubmit} class="w-full">
            <AuthFieldGroup gap="md">
              <Input
                id="username"
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={username()}
                onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
                autocomplete="username"
                startIcon={<Icon name="icon-[lucide--user]" width={16} height={16} />}
                class="w-full"
              />
              <PasswordField
                name="password"
                label="Password"
                placeholder="Enter your password"
                showLabel="Show password"
                hideLabel="Hide password"
                value={password()}
                onInput={(v) => setPassword(v)}
                autocomplete="current-password"
                startIcon={<Icon name="icon-[lucide--lock]" width={16} height={16} />}
              />
              <AuthErrorMessage message={error()} />
              <AuthSubmitButton class="mt-2">Sign in</AuthSubmitButton>
            </AuthFieldGroup>
          </form>

          <div class="mt-4">
            <AuthPoweredBy
              href="https://honey.id/"
              align="center"
              variant="subtle"
              label="Secure Auth by Honey"
              logo={<Icon name="icon-[lucide--shield-check]" width={14} height={14} />}
            />
          </div>
        </AuthCard>

        <div class="mt-6 text-center text-base-content/70 text-sm">
          <span>Don't have an account? </span>
          <A
            href={ROUTES.SIGNUP}
            class="text-primary underline-offset-4 hover:text-accent hover:underline"
          >
            Sign up
          </A>
        </div>
      </div>
    </Flex>
  );
};

export default LoginPage;
