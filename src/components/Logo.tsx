import clsx from "clsx";
import type { Component } from "solid-js";

interface LogoProps {
  /** Wrapper class. */
  class?: string;
  /** Class for the mark SVG (size/color). Defaults to a navbar-sized square. */
  markClass?: string;
  /** Brand text shown next to the mark. Replace with your app name. */
  label?: string;
}

export const Logo: Component<LogoProps> = (props) => (
  <span class={clsx("inline-flex items-center gap-2 text-base-content", props.class)}>
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      class={props.markClass ?? "h-7 w-7 shrink-0"}
    >
      <path d="M12 2 2 7v10l10 5 10-5V7L12 2Zm0 2.2 7.5 3.75L12 11.7 4.5 7.95 12 4.2ZM4 9.6l7 3.5v6.9l-7-3.5V9.6Zm16 0v6.9l-7 3.5v-6.9l7-3.5Z" />
    </svg>
    <span class="font-semibold text-xl tracking-tight">{props.label ?? "PathScale"}</span>
  </span>
);

export default Logo;
