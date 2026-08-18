import { createRouter } from "@solidjs/router";
import type { Component } from "solid-js";
import { ROUTES } from "~/config/routes";
import LoginPage from "~/features/auth/pages/LoginPage";
import SignupPage from "~/features/auth/pages/SignupPage";
import HomePage from "~/features/home/pages/HomePage";
import AppShell from "~/layouts/AppShell";
import AuthLayout from "~/layouts/AuthLayout";

/*
 * Routes are configuration, not JSX children.
 *
 * `@solidjs/router` 2.x replaced `<Router>`/`<Route>` with a factory: the tree
 * is declared once as plain objects and `createRouter` hands back a component
 * that is the provider. A layout is a route with no `path` and `children`,
 * which is the same nesting the JSX form expressed, and the root shell moves
 * from a `root` prop to the outermost route's `component`.
 *
 * Declared inline rather than as an extracted `const`, which the factory's own
 * documentation asks for: an extracted array widens literal paths to `string`
 * and silently degrades the typed `paths` proxy.
 */
const Routes = createRouter({
  routes: [
    {
      component: AppShell,
      children: [
        { path: ROUTES.HOME, component: HomePage },
        {
          component: AuthLayout,
          children: [
            { path: ROUTES.LOGIN, component: LoginPage },
            { path: ROUTES.SIGNUP, component: SignupPage },
          ],
        },
      ],
    },
  ],
});

const App: Component = () => <Routes />;

export default App;
