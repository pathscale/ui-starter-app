import { Flex } from "@pathscale/ui";
import type { RouteSectionProps } from "@solidjs/router";
import type { Component } from "solid-js";
import Footer from "~/components/Footer";

const AppLayout: Component<RouteSectionProps> = (props) => (
  <Flex direction="col" class="flex-1">
    <main class="flex flex-1 flex-col">{props.children}</main>
    <Footer />
  </Flex>
);

export default AppLayout;
