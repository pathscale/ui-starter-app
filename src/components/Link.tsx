import { Link as UILink, type LinkProps as UILinkProps } from "@pathscale/ui";
import { useLinkState } from "@solidjs/router";
import type { JSX } from "@solidjs/web";

/**
 * An in-app link.
 *
 * \`@solidjs/router\` 2.x has no \`<A>\`: navigation is a plain anchor that the
 * router intercepts, and \`useLinkState\` is the programmatic counterpart of the
 * attributes it puts on one (\`aria-current\`, \`data-active\`, \`data-pending\`).
 *
 * Only the router wiring lives here. The anchor itself is @pathscale/ui's
 * \`Link\`, so an in-app link and a plain one are drawn by the same component
 * and every \`Link\` parameter passes straight through.
 */
export type LinkProps = Omit<UILinkProps, "href"> & {
  href: string;
  /** Match the whole path rather than treating it as a prefix. */
  end?: boolean;
};

export function Link(props: LinkProps): JSX.Element {
  const link = useLinkState(() => props.href, { end: props.end });
  return (
    <UILink
      {...props}
      data-active={link.active() || undefined}
      aria-current={link.active() ? "page" : undefined}
    />
  );
}
