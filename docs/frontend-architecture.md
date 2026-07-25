# Frontend architecture — the `src/` skeleton

How a `@pathscale/ui` application is laid out, so a new app doesn't start from a blank
directory and an existing one stays recognisable to anyone who has worked on another.

This starter ships the working core, plus the rest of the skeleton as **empty directories
with a README each** — so the shape is there from the first commit and you are never
guessing where something goes. Each section below marks whether the directory has code in
it yet, so nothing here is a claim about code that isn't present.

Neighbours: [`frontend-conventions.md`](frontend-conventions.md) for the working
agreement, [`frontend-services-contract.md`](frontend-services-contract.md) for backend
wiring, and the [`@pathscale/ui` usage
reference](https://github.com/pathscale/ui/blob/master/docs/ui-usage.md) for components,
theming and forms.

## The skeleton

**With code in this starter:**

```
src/
  App.tsx  index.tsx  index.css  env.d.ts
  assets/  components/  config/  features/  layouts/  lib/  scripts/  styles/
```

**Present as empty directories, each with a README describing what belongs there** — a
data-backed app fills all of them:

```
  api/  constants/  hooks/  models/  services/  stores/  utils/
```

**Not here at all; add when the app needs them:** `pages/`, `routes.ts`, `types/`,
`schemas/`, `contexts/`, `test/`.

Keep the names. A directory called `helpers/` or `store/` costs every future reader — and
every agent — the moment they have to work out whether it means `utils/` or `stores/`.

## What belongs where

### `components/` vs `features/` — the split that matters most

Both are in this starter, and getting this wrong is the most common structural mistake.

- **`components/`** — reusable and domain-agnostic. Would it still make sense in a
  different app? Then it goes here. The starter's `src/components/Logo.tsx` and
  `Footer.tsx` are the shape: no product knowledge in them.
- **`features/`** — one directory per product area, owning its slice end to end. The
  starter has `src/features/auth/` and `src/features/home/`. Inside a feature the
  convention is `components/`, `hooks/`, `pages/`, plus whatever that feature alone needs.

The test: **would this make sense outside this product area?** Yes → `components/`.
No → that feature's folder.

A feature may import from `components/`. **`components/` must never import from
`features/`** — that edge is what keeps the shared layer shared, and it is worth enforcing
in review.

### `layouts/` — page shells

In this starter: `AppShell.tsx`, `AppLayout.tsx`, `AuthLayout.tsx`. Layouts are composed
by the router and hold structural chrome — navigation, footers, auth framing. No data
fetching, no product logic.

### `config/` and the `config.ts` file

`src/config/` holds configuration modules; this starter has `src/config/routes.ts`. Apps
commonly add `featureFlags.ts` and `i18n.ts` beside it.

A full app also has a **`src/config.ts` file** next to the `config/` directory, for
environment and runtime config. The two coexist and are not duplicates — worth knowing
before you "tidy up" one into the other.

### `lib/` vs `utils/`

- **`lib/`** — self-contained utilities with real internal complexity, often their own
  subdirectory. The starter has `src/lib/theme.ts`.
- **`utils/`** *(empty here)* — small stateless helpers, one concern per file.

Rule of thumb: if it grows a subdirectory and internal state, it belongs in `lib/`.

### `styles/`, `assets/`, `scripts/`

- **`styles/`** — global CSS and themes (`src/styles/themes/` here). Component styling is
  Tailwind utilities plus `@pathscale/ui` tokens.
- **`assets/`** — static files.
- **`scripts/`** — build and codegen scripts run through `package.json`. Never imported by
  `src/`.

### The data layer *(directories present, empty)*

A backend-connected app fills these; each has a README repeating the rule in place. Full
detail in [`frontend-services-contract.md`](frontend-services-contract.md):

- **`api/`** — transport wiring only: adapter configuration and the exported session
  objects. No business logic, and nothing importing from `features/`.
- **`models/`** — generated DTOs describing backend payloads. **Never hand-edited.**
- **`services/`** — business logic and error normalisation. Entered when there is logic to
  own, not as a mandatory relay between hooks and `api/`.
- **`hooks/`** — one hook per endpoint or interaction, wrapping `@tanstack/solid-query`.
  This is what components consume; they should never call the API directly.
- **`constants/`** — fixed values with no logic, notably centralised query keys.
- **`stores/`** — global state as module-level `createSignal` singletons, imported
  directly, no provider.
- **`contexts/`** — only for values that genuinely cannot be global because they belong to
  one subtree. Reach for a store first; a context is the exception, not the default.

## Routing

Up to three layers. They stack — a later one never replaces an earlier one.

**1. Path constants — `src/config/routes.ts`.** Present here, and it should exist in every
app from day one. Every path string comes from this module; never hard-code a route string
in a component.

**2. The route table — `src/routes.ts`** *(not in this starter)*. Exports
`routes: RouteConfig[]` mapping paths to components, layouts and guards. Worth adding once
the route list outgrows readability inline.

Below that threshold — and this starter is below it — routes are declared as `<Route>`
elements directly in `src/App.tsx`, with guards as wrapper components. That is a
legitimate end state for a small app, not a deficiency to fix.

**3. Derived groupings — `src/routing/`** *(not in this starter)*. Filters the route table
into the groups a shell renders, and can carry access policy. This layer **imports** the
route table; it is a consumer of layer 2, never an alternative to it.

So "`routes.ts` or `routing/`?" is a false choice: an app with `routing/` has `routes.ts`
too, and both sit on `config/routes.ts`.

## Adding something new — where does it go?

| you are adding | it goes in |
|---|---|
| a screen | that feature's `pages/`, registered in `App.tsx` or `routes.ts` |
| a widget used by one feature | that feature's `components/` |
| a widget used by three features | `components/` |
| page chrome | `layouts/` |
| a path | `config/routes.ts`, always |
| a backend call | `hooks/` — see the services contract |
| global state | `stores/` |
| a value scoped to one subtree | `contexts/` |
| a pure helper | `utils/`, or `lib/` if it needs its own directory |
| a type describing backend data | nowhere by hand — regenerate `models/` |
