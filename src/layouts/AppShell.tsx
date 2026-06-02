import { Flex } from "@pathscale/ui";
import type { RouteSectionProps } from "@solidjs/router";
import type { Component } from "solid-js";
import AppNavbar from "~/components/AppNavbar";

const AppShell: Component<RouteSectionProps> = (props) => (
  <Flex direction="col" class="min-h-screen">
    <AppNavbar />
    <div class="flex flex-1 flex-col">{props.children}</div>
  </Flex>
);

export default AppShell;
