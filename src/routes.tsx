import { Component } from "solid-js";

// Import page components
import HomePage from "./features/auth/pages/HomePage";
import LoginPage from "./features/auth/pages/LoginPage";
import NotFoundPage from "./features/auth/pages/NotFoundPage";

export interface RouteConfig {
  name: string;
  path: string;
  component: Component;
  protected?: boolean;
  requiredRole?: string;
}

export const routes: RouteConfig[] = [
  {
    name: "Home",
    path: "/",
    component: HomePage,
  },
  {
    name: "Login",
    path: "/login",
    component: LoginPage,
  },
  {
    name: "Not Found",
    path: "*",
    component: NotFoundPage,
  },
];
