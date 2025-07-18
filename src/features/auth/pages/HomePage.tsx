import { Component } from "solid-js";
import PublicLayout from "~/layouts/PublicLayout";

export const HomePage: Component = () => {
  return (
    <PublicLayout>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">Solid Starter Kit</h1>
            <p class="py-6">
              A starter kit for Solid.js applications with common structure and
              utilities from pays.online and honey.id.
            </p>
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
