import { Flex } from "@pathscale/ui";
import type { RouteSectionProps } from "@solidjs/router";
import type { Component } from "solid-js";

const AuthLayout: Component<RouteSectionProps> = (props) => (
  <Flex direction="col" class="w-full flex-1 px-4 py-12">
    {props.children}
  </Flex>
);

export default AuthLayout;
