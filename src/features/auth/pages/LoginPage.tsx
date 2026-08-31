import {
  AuthCard,
  AuthFieldGroup,
  AuthMessage,
  AuthPoweredBy,
  AuthSubmitButton,
  createForm,
  Flex,
  Form,
  FormField,
  Icon,
  Link,
  PasswordField,
  Text,
  useField,
} from "@pathscale/ui";
import { type Component, createSignal } from "solid-js";
import { ROUTES } from "~/config/routes";

/**
 * `FormField` renders an `Input`, so a field drawn by any other component wires
 * itself to the same form through `useField`. It reads from context, which is
 * why this is a child component rather than a call in the page body.
 */
const PasswordFieldControl: Component = () => {
  const password = useField("password");
  return (
    <PasswordField
      name="password"
      label="Password"
      placeholder="Enter your password"
      showLabel="Show password"
      hideLabel="Hide password"
      autocomplete="current-password"
      value={String(password.value() ?? "")}
      onInput={(value) => password.handleChange(value)}
      onBlur={password.handleBlur}
      invalid={password.invalid()}
      startIcon={<Icon src="icon-[lucide--lock]" width={16} height={16} />}
    />
  );
};

const LoginPage: Component = () => {
  const [error, setError] = createSignal<string | null>(null);

  const form = createForm({
    defaultValues: { username: "", password: "" },
    onSubmit: (values) => {
      if (!values.username.trim() || !values.password) {
        setError("Enter your username and password.");
        return;
      }
      setError(null);
      // TODO: call your auth service here.
    },
  });

  return (
    <Flex direction="col" align="center" justify="center" class="flex-1">
      <div class="w-full max-w-md">
        <AuthCard title="Welcome back" description="Sign in to your account">
          <Form form={form} class="w-full">
            <AuthFieldGroup gap="md">
              <FormField
                name="username"
                label="Username"
                inputProps={{
                  id: "username",
                  placeholder: "Enter your username",
                  autocomplete: "username",
                  fullWidth: true,
                  startIcon: <Icon src="icon-[lucide--user]" width={16} height={16} />,
                }}
              />
              <PasswordFieldControl />
              <AuthMessage message={error()} />
              <AuthSubmitButton class="mt-2">Sign in</AuthSubmitButton>
            </AuthFieldGroup>
          </Form>

          <div class="mt-4">
            <AuthPoweredBy
              href="https://honey.id/"
              align="center"
              variant="subtle"
              label="Secure Auth by Honey"
              logo={<Icon src="icon-[lucide--shield-check]" width={14} height={14} />}
            />
          </div>
        </AuthCard>

        <Text size="sm" variant="muted" class="mt-6 block text-center">
          Don't have an account? <Link href={ROUTES.SIGNUP}>Sign up</Link>
        </Text>
      </div>
    </Flex>
  );
};

export default LoginPage;
