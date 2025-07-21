import type { Component } from "solid-js";
import { Footer as LibFooter } from "@pathscale/ui";

export const Footer: Component = () => (
  <LibFooter center class="text-sm text-base-content">
    © 2025 Your App. Powered by Solid.js + @pathscale/ui
  </LibFooter>
);

export default Footer;
