import { Component } from "solid-js";
import AuthLayout from "~/layouts/AuthLayout";

export const LoginPage: Component = () => {
  return (
    <AuthLayout title="Login">
      <div class="flex flex-col gap-4">
        <p>Login form goes here</p>
        <button class="btn btn-primary w-full">Login</button>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
