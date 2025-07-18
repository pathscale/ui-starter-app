import { Button } from "@pathscale/ui";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import PublicLayout from "~/layouts/PublicLayout";

export const NotFoundPage: Component = () => {
  return (
    <PublicLayout>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="font-bold text-5xl">404</h1>
            <p class="py-6">Page not found</p>
            <A href="/">
              <Button color="primary">Go Home</Button>
            </A>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFoundPage;
