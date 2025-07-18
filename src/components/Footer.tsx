import { Component } from "solid-js";

export const Footer: Component = () => {
  return (
    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>Copyright © {new Date().getFullYear()} - Solid Starter Kit</p>
      </div>
    </footer>
  );
};

export default Footer;
