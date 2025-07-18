import { Component } from "solid-js";
import { Footer } from "@pathscale/ui";

const AppFooter: Component = () => {
  return (
    <Footer center class="bg-base-300 text-base-content p-4">
      <div>
        <p>Pathscale © {new Date().getFullYear()} - Solid Starter Kit</p>
      </div>
    </Footer>
  );
};

export default AppFooter;
