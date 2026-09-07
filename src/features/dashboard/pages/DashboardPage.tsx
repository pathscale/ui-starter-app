import { Card, Flex, Text } from "@pathscale/ui";
import type { Component } from "solid-js";
import Footer from "~/components/Footer";

/*
 * The page the navbar's "Dashboard" link has always pointed at.
 *
 * `ROUTES.DASHBOARD` and the navbar entry both existed; the route was never
 * declared in `App.tsx`, and there is no catch-all, so the link rendered an
 * empty `#root` with nothing in the console. In a starter that is worse than
 * in an application: every project copied from here inherits a navigation
 * item that goes nowhere.
 *
 * Deliberately empty of product: this is where a real dashboard goes, and a
 * starter should say so rather than ship invented widgets to delete.
 */
const DashboardPage: Component = () => (
  <Flex direction="col" class="flex-1">
    <Flex direction="col" gap="lg" class="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
      <Flex direction="col" gap="sm">
        <Text family="heading" size="xl" weight="bold" tracking="wide" class="text-3xl">
          Dashboard
        </Text>
        <Text variant="muted" class="block">
          The signed-in surface of the starter. Replace this with your product.
        </Text>
      </Flex>

      <Card elevation="md">
        <Card.Body class="gap-2">
          <Text weight="semibold">Next steps</Text>
          <Text variant="muted" size="sm" class="block">
            Wire the auth screens to your backend, then guard this route so it is reachable only
            once a session exists.
          </Text>
        </Card.Body>
      </Card>
    </Flex>
    <Footer />
  </Flex>
);

export default DashboardPage;
