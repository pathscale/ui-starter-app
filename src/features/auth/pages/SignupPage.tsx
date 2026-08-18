import {
  AuthCard,
  AuthFieldGroup,
  AuthMessage,
  AuthPoweredBy,
  AuthSubmitButton,
  Flex,
  Icon,
  Input,
  PasswordField,
} from "@pathscale/ui";
import { type Component, createSignal } from "solid-js";
import { Link } from "~/components/Link";
import { ROUTES } from "~/config/routes";

const SignupPage: Component = () => {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!name().trim() || !email().trim() || !password()) {
      setError("Fill in all fields to continue.");
      return;
    }
    setError(null);
    // TODO: call your auth service here.
  };

  return (
    <Flex direction="col" align="center" justify="center" class="flex-1">
      <div class="w-full max-w-md">
        <AuthCard title="Create an account" description="Get started in seconds">
          <form onSubmit={handleSubmit} class="w-full">
            <AuthFieldGroup gap="md">
              <Input
                id="name"
                name="name"
                label="Display name"
                placeholder="Your name"
                value={name()}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                autocomplete="name"
                startIcon={<Icon src="icon-[lucide--user]" width={16} height={16} />}
                class="w-full"
              />
              <Input
                id="email"
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={email()}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                autocomplete="email"
                startIcon={<Icon src="icon-[lucide--mail]" width={16} height={16} />}
                class="w-full"
              />
              <PasswordField
                name="password"
                label="Password"
                placeholder="Create a password"
                showLabel="Show password"
                hideLabel="Hide password"
                value={password()}
                onInput={(v) => setPassword(v)}
                autocomplete="new-password"
                startIcon={<Icon src="icon-[lucide--lock]" width={16} height={16} />}
              />
              <AuthMessage message={error()} />
              <AuthSubmitButton class="mt-2">Create account</AuthSubmitButton>
            </AuthFieldGroup>
          </form>

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

        <div class="mt-6 text-center text-base-content/70 text-sm">
          <span>Already have an account? </span>
          <Link
            href={ROUTES.LOGIN}
            class="text-primary underline-offset-4 hover:text-accent hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </Flex>
  );
};

export default SignupPage;
