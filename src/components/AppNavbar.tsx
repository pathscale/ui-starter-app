import { Button, Flex, Navbar } from "@pathscale/ui";
import { useLocation } from "@solidjs/router";
import clsx from "clsx";
import type { Component } from "solid-js";
import { Link } from "~/components/Link";
import Logo from "~/components/Logo";
import { ROUTES } from "~/config/routes";
import ThemeToggle from "~/ThemeToggle";

const NAV_LINKS = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
] as const;

const AppNavbar: Component = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    path === ROUTES.HOME
      ? location.pathname === ROUTES.HOME
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navLinkClass = (path: string) =>
    clsx("rounded px-3 py-1.5 font-medium text-sm transition-colors", {
      "bg-base-200 text-base-content": isActive(path),
      "text-base-content/70 hover:bg-base-200/60 hover:text-base-content": !isActive(path),
    });

  return (
    <Navbar.Stack sticky class="top-0 z-10">
      <Navbar.Row bordered class="bg-base-100/80 backdrop-blur-md">
        <Navbar.Start>
          <Link href={ROUTES.HOME} class="mr-4 no-underline">
            <Logo />
          </Link>
          <nav class="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link href={link.href} class={navLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </Navbar.Start>
        <Navbar.End>
          <Flex align="center" gap="sm">
            <ThemeToggle />
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm" type="button">
                Log in
              </Button>
            </Link>
            <Link href={ROUTES.SIGNUP}>
              <Button variant="solid" flavor="primary" size="sm" type="button">
                Sign up
              </Button>
            </Link>
          </Flex>
        </Navbar.End>
      </Navbar.Row>
    </Navbar.Stack>
  );
};

export default AppNavbar;
