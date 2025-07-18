import { Button } from "@pathscale/ui";
import type { Component } from "solid-js";
import AuthLayout from "~/layouts/AuthLayout";

export const LoginPage: Component = () => {
  return (
    <AuthLayout title="Login">
      <div class="flex flex-col gap-4">
        <p>Login form goes here</p>
        <Button color="primary" fullWidth>
          Login
        </Button>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
