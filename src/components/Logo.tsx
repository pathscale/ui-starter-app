import type { Component } from "solid-js";

import logo from "src/assets/logo.svg";

export const Logo: Component = () => (
  <img src={logo} alt="Logo" class="h-32 w-32 animate-spin hover:animate-none" />
);

export default Logo;
