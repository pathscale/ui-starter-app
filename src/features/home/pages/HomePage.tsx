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
      <Text family="heading" size="xl" weight="bold" tracking="wide" class="text-4xl">
        PathScale Solid.js Starter
      </Text>
      <Text variant="muted" class="block max-w-xl">
        A modern foundation built on Solid.js and @pathscale/ui — themeable, with a shared navbar
        shell and auth screens ready to wire to your backend.
      </Text>
      <Flex gap="sm" class="mt-2">
        <Button href={ROUTES.SIGNUP} variant="solid" flavor="primary">
          Get started
        </Button>
        <Button href={ROUTES.LOGIN} variant="ghost">
          Log in
        </Button>
      </Flex>
    </Flex>
    <Footer />
  </Flex>
);

export default HomePage;
