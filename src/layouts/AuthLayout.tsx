import { Component, JSX } from "solid-js";

interface AuthLayoutProps {
  title: string;
  children: JSX.Element;
}

export const AuthLayout: Component<AuthLayoutProps> = (props) => {
  return (
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-base-100 to-base-200">
      <main class="flex-1 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-base-content mb-2">
              {props.title}
            </h1>
            <p class="text-base-content/70">Welcome to Solid Starter Kit</p>
          </div>
          <div class="bg-base-100 border border-base-300 rounded-xl shadow-lg p-6 md:p-8 card-modern">
            {props.children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
