export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ADMIN: "/admin",
} as const;

// Type definitions
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];

export type AllRouteValues = (typeof ROUTES)[keyof typeof ROUTES];

// Utility functions
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key];

export const isValidRoute = (path: string): boolean => {
  const allRoutes: AllRouteValues[] = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.ADMIN,
  ];

  return allRoutes.includes(path as AllRouteValues);
};

export const isAuthRoute = (path: string): boolean => {
  const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP];
  return authRoutes.includes(path as any);
};
