import { useLinkState } from "@solidjs/router";
import type { JSX } from "@solidjs/web";

/**
 * An in-app link.
 *
 * `@solidjs/router` 2.x has no `<A>`: navigation is a plain anchor that the
 * router intercepts, and `useLinkState` is the programmatic counterpart of the
 * attributes it puts on one (`aria-current`, `data-active`, `data-pending`).
 *
 * Kept as a component rather than spelling out an `<a>` at every call site so
 * the active-state convention lives in one place, which is what a starter is
 * for.
 */
export type LinkProps = {
  href: string;
  class?: string;
  /** Match the whole path rather than treating it as a prefix. */
  end?: boolean;
  children?: JSX.Element;
};

export function Link(props: LinkProps): JSX.Element {
  const link = useLinkState(() => props.href, { end: props.end });
  return (
    <a
      href={props.href}
      class={props.class}
      data-active={link.active() || undefined}
      aria-current={link.active() ? "page" : undefined}
    >
      {props.children}
    </a>
  );
}
