import { Button, Card, Flex } from "@pathscale/ui";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import PublicLayout from "~/layouts/PublicLayout";

export const HomePage: Component = () => {
  return (
    <PublicLayout>
      <Flex direction="col" align="center" justify="center" class="min-h-screen bg-base-200 px-4">
        <Card shadow="lg" class="max-w-lg">
          <Card.Body>
            <Flex direction="col" align="center" gap="lg" class="text-center">
              <h1 class="font-bold text-5xl text-primary">Solid Starter Kit</h1>
              <p class="text-lg">
                A starter kit for Solid.js applications with common structure and utilities from
                pays.online and honey.id.
              </p>
              <Flex gap="md">
                <A href="/login">
                  <Button color="primary" size="lg">
                    Get Started
                  </Button>
                </A>
                <a
                  href="https://github.com/pathscale/ui-starter-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    GitHub
                  </Button>
                </a>
              </Flex>
            </Flex>
          </Card.Body>
        </Card>
      </Flex>
    </PublicLayout>
  );
};

export default HomePage;
