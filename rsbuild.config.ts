import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid } from "@rsbuild/plugin-solid";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx|ts)$/,
    }),
    pluginSolid(),
  ],
  source: {
    alias: {
      "~": "./src",
    },
    define: {
      "import.meta.env.VERSION": JSON.stringify(
        process.env.GITHUB_RUN_NUMBER || "0.0.1"
      ),
    },
  },
  html: {
    meta: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      "theme-color": "#000000",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      description: "Solid.js Starter Kit",
    },
    title: "Solid Starter Kit",
    mountId: "root",
  },
  dev: {
    hmr: true,
    liveReload: true,
  },
  server: {
    port: 3000,
  },
  tools: {
    rspack: {
      plugins: [
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            configFile: "./tsconfig.json",
          },
        }),
      ],
    },
  },
  output: {
    inlineStyles: false,
    legalComments: "none",
  },
});
