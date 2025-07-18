import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Flex, Button, Card } from "@pathscale/ui";
import PublicLayout from "~/layouts/PublicLayout";

export const HomePage: Component = () => {
  return (
    <PublicLayout>
      <Flex
        direction="col"
        align="center"
        justify="center"
        class="min-h-screen bg-base-200 px-4"
      >
        <Card shadow="lg" class="max-w-lg">
          <Card.Body>
            <Flex direction="col" align="center" gap="lg" class="text-center">
              <h1 class="text-5xl font-bold text-primary">Solid Starter Kit</h1>
              <p class="text-lg">
                A starter kit for Solid.js applications with common structure
                and utilities from pays.online and honey.id.
              </p>
              <Flex gap="md">
                <Button<"a"> as="a" href="/login" color="primary" size="lg">
                  Get Started
                </Button>
                <Button<"a">
                  as="a"
                  href="https://github.com/pathscale/ui-starter-app"
                  variant="outline"
                  size="lg"
                >
                  GitHub
                </Button>
              </Flex>
            </Flex>
          </Card.Body>
        </Card>
      </Flex>
    </PublicLayout>
  );
};

export default HomePage;
