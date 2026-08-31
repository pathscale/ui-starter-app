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

/** See `LoginPage` — `PasswordField` joins the form through `useField`. */
const PasswordFieldControl: Component = () => {
  const password = useField("password");
  return (
    <PasswordField
      name="password"
      label="Password"
      placeholder="Create a password"
      showLabel="Show password"
      hideLabel="Hide password"
      autocomplete="new-password"
      value={String(password.value() ?? "")}
      onInput={(value) => password.handleChange(value)}
      onBlur={password.handleBlur}
      invalid={password.invalid()}
      startIcon={<Icon src="icon-[lucide--lock]" width={16} height={16} />}
    />
  );
};

const SignupPage: Component = () => {
  const [error, setError] = createSignal<string | null>(null);

  const form = createForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: (values) => {
      if (!values.name.trim() || !values.email.trim() || !values.password) {
        setError("Fill in all fields to continue.");
        return;
      }
      setError(null);
      // TODO: call your auth service here.
    },
  });

  return (
    <Flex direction="col" align="center" justify="center" class="flex-1">
      <div class="w-full max-w-md">
        <AuthCard title="Create an account" description="Get started in seconds">
          <Form form={form} class="w-full">
            <AuthFieldGroup gap="md">
              <FormField
                name="name"
                label="Display name"
                inputProps={{
                  id: "name",
                  placeholder: "Your name",
                  autocomplete: "name",
                  fullWidth: true,
                  startIcon: <Icon src="icon-[lucide--user]" width={16} height={16} />,
                }}
              />
              <FormField
                name="email"
                label="Email"
                inputProps={{
                  id: "email",
                  type: "email",
                  placeholder: "you@example.com",
                  autocomplete: "email",
                  fullWidth: true,
                  startIcon: <Icon src="icon-[lucide--mail]" width={16} height={16} />,
                }}
              />
              <PasswordFieldControl />
              <AuthMessage message={error()} />
              <AuthSubmitButton class="mt-2">Create account</AuthSubmitButton>
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
          Already have an account? <Link href={ROUTES.LOGIN}>Log in</Link>
        </Text>
      </div>
    </Flex>
  );
};

export default SignupPage;
