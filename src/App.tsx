import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { ROUTES } from "~/config/routes";
import LoginPage from "~/features/auth/pages/LoginPage";
import SignupPage from "~/features/auth/pages/SignupPage";
import HomePage from "~/features/home/pages/HomePage";
import AppShell from "~/layouts/AppShell";
import AuthLayout from "~/layouts/AuthLayout";

const queryClient = new QueryClient();

const App: Component = () => (
  <QueryClientProvider client={queryClient}>
    <Router root={AppShell}>
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route component={AuthLayout}>
        <Route path={ROUTES.LOGIN} component={LoginPage} />
        <Route path={ROUTES.SIGNUP} component={SignupPage} />
      </Route>
    </Router>
  </QueryClientProvider>
);

export default App;
