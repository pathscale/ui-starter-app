export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
