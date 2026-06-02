import { Footer as LibFooter } from "@pathscale/ui";
import type { Component } from "solid-js";

export const Footer: Component = () => (
  <LibFooter center class="text-base-content/60 text-sm">
    © {new Date().getFullYear()} PathScale Starter. Built with Solid.js + @pathscale/ui.
  </LibFooter>
);

export default Footer;
