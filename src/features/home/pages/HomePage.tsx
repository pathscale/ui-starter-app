import { Button, Flex } from "@pathscale/ui";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import Footer from "~/components/Footer";
import { ROUTES } from "~/config/routes";

const HomePage: Component = () => (
  <Flex direction="col" class="flex-1">
    <Flex
      direction="col"
      align="center"
      justify="center"
      gap="md"
      class="flex-1 px-4 py-16 text-center"
    >
      <h1 class="font-bold text-4xl tracking-tight">PathScale Solid.js Starter</h1>
      <p class="max-w-xl text-base-content/70">
        A modern foundation built on Solid.js and @pathscale/ui — themeable, with a shared navbar
        shell and auth screens ready to wire to your backend.
      </p>
      <Flex gap="sm" class="mt-2">
        <A href={ROUTES.SIGNUP}>
          <Button variant="primary" type="button">
            Get started
          </Button>
        </A>
        <A href={ROUTES.LOGIN}>
          <Button variant="ghost" type="button">
            Log in
          </Button>
        </A>
      </Flex>
    </Flex>
    <Footer />
  </Flex>
);

export default HomePage;
