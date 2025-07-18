import { Component, JSX } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Toaster } from "solid-sonner";
import ToastContainer from "./components/ToastContainer";
import AppFooter from "./components/Footer";
import { routes } from "./routes";
import ThemeToggle from "./ThemeToggle";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple layout component
interface LayoutProps {
  children?: JSX.Element;
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div class="min-h-screen flex flex-col">
      <div class="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div class="flex-1">{props.children}</div>
      <AppFooter />
      <ToastContainer />
    </div>
  );
};

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div class="h-screen">
        <Router root={Layout}>
          {routes.map(({ path, component: Component }) => (
            <Route path={path} component={Component} />
          ))}
        </Router>
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
};

export default App;
