import { Flex, Link } from "@pathscale/ui";
import type { Component } from "solid-js";
import Counter from "~/components/Counter";
import Footer from "~/components/Footer";
import Logo from "~/components/Logo";
import ThemeToggle from "./ThemeToggle";

const App: Component = () => {
  return (
    <Flex direction="col" align="center" justify="center" class="min-h-screen gap-4 p-4">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Logo />
      <h1 class="font-bold text-4xl">Welcome to your Solid.js + @pathscale/ui App</h1>
      <p>This app is up and running. Here are some useful links:</p>

      <Flex gap="md" justify="center" wrap="wrap">
        <Link href="https://solidjs.com/docs" target="_blank" rel="noopener noreferrer">
          Solid Documentation
        </Link>
        <Link
          href="https://js--software.b-cdn.net/showcases"
          target="_blank"
          rel="noopener noreferrer"
        >
          @pathscale/ui Components
        </Link>
        <Link
          href="https://github.com/solidjs/solid-router"
          target="_blank"
          rel="noopener noreferrer"
        >
          Solid Router
        </Link>
        <Link
          href="https://tanstack.com/query/latest/docs/solid/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tanstack Query
        </Link>
        <Link href="https://zod.dev/" target="_blank" rel="noopener noreferrer">
          Zod Validation
        </Link>
      </Flex>

      <Counter />
      <Footer />
    </Flex>
  );
};

export default App;
