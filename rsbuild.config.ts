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
      /*
       * solid-layouts ships one build arm per Solid major and its bare entry is
       * the 1.9 one, whose renderer calls `splitProps`. Solid 2 replaced that
       * with `omit`, and a bundler links both arms of the package's runtime
       * check, so the default entry fails at link time with "export
       * 'createComponent' was not found in './renderer.js'". `./solid-2` is the
       * arm built against this major; these aliases are how a consumer picks it.
       */
      "solid-layouts/recipe": "solid-layouts/solid-2/recipe",
      "solid-layouts/cx": "solid-layouts/solid-2/cx",
      "solid-layouts/application-boundary": "solid-layouts/solid-2/application-boundary",
      "solid-layouts$": "solid-layouts/solid-2",
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
      // solid-layouts feature-detects on a namespace import to support both
      // Solid majors from one file. Only one branch can resolve on a given
      // major and the dead one is never evaluated, but the bundler still checks
      // both and hard-errors on the missing export.
      ignoreWarnings: [/export '(splitProps|omit)' .* was not found in 'solid-js'/],
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
