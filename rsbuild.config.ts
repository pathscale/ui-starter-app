import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid2LayoutsApplication } from "rsbuild-plugin-solid-layouts";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export default defineConfig({
  plugins: [
    /*
     * Before Babel and Solid, deliberately.
     *
     * `@pathscale/ui` components are Layouts, and this resolves them against
     * the Layout manifest. Once the Solid transform has run there is no
     * `<Button>` left to resolve - only `_$createComponent` calls.
     */
    pluginSolid2LayoutsApplication({
      layouts: ["@pathscale/ui"],
    }),
    /*
     * `@rsbuild/plugin-solid` is deliberately not used. It injects
     * `solid-refresh` whenever `dev.hmr` is on, and solid-refresh 0.6.3 halts
     * Solid 2's reactive system at module-eval time, so the dev server renders
     * an empty root while the production build is fine. Driving the Solid 2
     * preset through Babel gives the same compile without it.
     */
    pluginBabel({
      include: /\.(?:jsx|tsx|ts)$/,
      babelLoaderOptions: (config) => {
        config.presets ??= [];
        config.presets.push(["babel-preset-solid", { moduleName: "@solidjs/web" }]);
      },
    }),
  ],
  resolve: {
    alias: {
      "~": "./src",
    },
  },
  source: {
    define: {
      "import.meta.env.VERSION": JSON.stringify(
        process.env.GITHUB_RUN_NUMBER || "0.0.1",
      ),
    },
  },
  html: {
    meta: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      "theme-color": "#000000",
      description: "PathScale Solid.js + @pathscale/ui starter",
    },
    title: "PathScale Starter",
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
    // rsbuild's own SWC pass also transforms JSX and defaults to Solid 1's
    // `solid-js/web`. Babel has already produced the Solid 2 output by then,
    // so point SWC at the same runtime rather than letting it re-emit the old.
    swc: {
      jsc: {
        transform: {
          react: { runtime: "automatic", importSource: "@solidjs/web" },
        },
      },
    },
    rspack: {
      optimization: {
        splitChunks: false,
        runtimeChunk: false,
      },
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
