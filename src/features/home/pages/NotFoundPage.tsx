import { Component } from "solid-js";
import PublicLayout from "~/layouts/PublicLayout";

export const NotFoundPage: Component = () => {
  return (
    <PublicLayout>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">404</h1>
            <p class="py-6">Page not found</p>
            <a href="/" class="btn btn-primary">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFoundPage;
