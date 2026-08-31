import { Button, Flex, Navbar } from "@pathscale/ui";
import { useLocation } from "@solidjs/router";
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

  return (
    <Navbar.Stack sticky class="top-0 z-10">
      <Navbar.Row bordered class="bg-base-100/80 backdrop-blur-md">
        <Navbar.Start>
          <Link href={ROUTES.HOME} class="mr-4 no-underline">
            <Logo />
          </Link>
          <nav class="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Button href={link.href} size="sm" variant={isActive(link.href) ? "soft" : "ghost"}>
                {link.label}
              </Button>
            ))}
          </nav>
        </Navbar.Start>
        <Navbar.End>
          <Flex align="center" gap="sm">
            <ThemeToggle />
            <Button href={ROUTES.LOGIN} variant="ghost" size="sm">
              Log in
            </Button>
            <Button href={ROUTES.SIGNUP} variant="solid" flavor="primary" size="sm">
              Sign up
            </Button>
          </Flex>
        </Navbar.End>
      </Navbar.Row>
    </Navbar.Stack>
  );
};

export default AppNavbar;
