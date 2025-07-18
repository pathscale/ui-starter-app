import { Component, JSX } from "solid-js";

interface PublicLayoutProps {
  children?: JSX.Element;
}

export const PublicLayout: Component<PublicLayoutProps> = (props) => {
  return (
    <div class="min-h-screen flex flex-col bg-base-100">
      <main class="flex-1">{props.children}</main>
    </div>
  );
};

export default PublicLayout;
