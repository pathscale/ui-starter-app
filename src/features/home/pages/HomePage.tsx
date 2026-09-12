import { Button, Flex, Text } from "@pathscale/ui";
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
      {/*
        A heading in the accessibility tree, not only in the type scale.
        `Text` renders a span, so `family="heading"` styled this title and left
        the landing page with no heading at all: the semantic tree carried
        thirty-nine nodes and not one of them was a heading, so a screen
        reader had nothing to navigate by and neither did anything else that
        reads the page. `DashboardPage` already says this about its own title;
        the page a visitor arrives on had been missed.
      */}
      <Text
        family="heading"
        size="xl"
        weight="bold"
        tracking="wide"
        class="text-4xl"
        role="heading"
        aria-level="1"
      >
        PathScale Solid.js Starter
      </Text>
      <Text variant="muted" class="block max-w-xl">
        A modern foundation built on Solid.js and @pathscale/ui — themeable, with a shared navbar
        shell and auth screens ready to wire to your backend.
      </Text>
      <Flex gap="sm" class="mt-2">
        <Button id="home-get-started" href={ROUTES.SIGNUP} variant="solid" flavor="primary">
          Get started
        </Button>
        <Button id="home-login" href={ROUTES.LOGIN} variant="ghost">
          Log in
        </Button>
      </Flex>
    </Flex>
    <Footer />
  </Flex>
);

export default HomePage;
