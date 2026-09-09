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
        {/*
          A heading in the accessibility tree, not only in the type scale.
          `Text` renders a span, so `family="heading"` styles the title and
          leaves the page with no heading structure at all: a screen reader
          finds nothing to navigate by, and neither does anything else that
          reads the page.
        */}
        <Text
          family="heading"
          size="xl"
          weight="bold"
          tracking="wide"
          class="text-3xl"
          role="heading"
          aria-level="1"
        >
          Dashboard
        </Text>
        <Text variant="muted" class="block">
          The signed-in surface of the starter. Replace this with your product.
        </Text>
      </Flex>

      {/*
        A named region, so the card is announced as the section its title says
        it is rather than as an unlabelled group of text. `aria-labelledby`
        would be the idiomatic form and does not work here: the engine's name
        computation does not follow it, so the region comes back unnamed.

        It is also the only thing on this page that is not text. Every other
        node the dashboard owns is a heading or a paragraph, and text has no
        box on a host with no font catalogue -- which is what CI runs -- so
        without this the page has nothing that says "you are on the dashboard"
        to anything measuring boxes. `tests/ps-qa/ps-qa.ron` names it as this
        surface's marker for that reason.
      */}
      <Card elevation="md" role="region" aria-label="Next steps">
        <Card.Body class="gap-2">
          {/* A section title, and therefore a heading. */}
          <Text weight="semibold" role="heading" aria-level="2">
            Next steps
          </Text>
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
