# ui-starter-app + worktables.dev Review: Full

**Date:** 2026-07-27
**Scope:** two repos, both read end to end.
- `/Users/revenge/code/ui-starter-app` — all of `src/`, `docs/`, `public/`, `.github/`, `.claude/`, `package.json`, `bun.lock`, `package-lock.json`, `rsbuild.config.ts`, `tsconfig.json`, `biome.json`, `AGENTS.md`, `CLAUDE.md`, `README.md`
- `/Users/revenge/code/worktables.dev` — all of `src/`, `public/`, `dist/`, `.github/`, config files, plus live HTTP header verification against `https://worktables.dev`
- Read-only cross-references: `/Users/revenge/code/WorkTable` (crate, for content accuracy), `/Users/revenge/code/UI`, `/Users/revenge/code/support.cafe`, `/Users/revenge/code/kard.vip` (dependency currency)

**Commit:** `ui-starter-app` f00cf31 (branch `docs/git-workflow-rules`, `AGENTS.md` dirty in the working tree) · `worktables.dev` a9057a5
**Reviewer slice:** full review of both repos. This document is the single review covering **both** `ui-starter-app` and `worktables.dev`; there is no separate worktables.dev doc.

---

## Summary

- **The starter template is not the origin of any of the five cross-repo defects.** `encodePassword`, a localStorage role guard, a no-op `ProtectedRoute`, the squatted `biome` package, and a hardcoded deploy token are all **absent**. It uses `@biomejs/biome` correctly, keeps BunnyCDN keys in GitHub secrets, and puts nothing but the theme in `localStorage`. The downstream apps invented those defects independently.
- **But the template's silence is itself the problem.** It ships two auth *screens* whose submit handlers are `// TODO: call your auth service here.` and **no** route guard, **no** API client, **no** password handling, **no** error boundary. Four downstream apps each had to invent auth wiring from nothing, and two of them got the guard wrong. The template's biggest defect is a hole, not a bug.
- **The starter does not install cleanly.** `bun.lock` pins `@pathscale/ui@0.0.94` while `package.json` asks for `^1.2.6` and `package-lock.json` pins `1.2.10`. `LoginPage.tsx` imports `AuthCard`/`PasswordField`, which first shipped in `@pathscale/ui@1.1.72`. Three lockfiles-of-record disagree; the committed bun lock cannot build the committed source.
- **It has the Tailwind v4 `@source` directive** (`src/index.css:3`), so a fresh project does render styled `@pathscale/ui` components. Same in `worktables.dev`. That sibling finding does not bite here.
- **worktables.dev is a genuinely good small site**: 22 KB of JS and 13 KB of CSS on the wire, zero third-party scripts, zero web fonts, zero images, one route. Its content is accurate: I verified every load-bearing capability claim against the WorkTable crate at v0.9.2 and found nothing overstated or stale.
- **worktables.dev's real risk is that its deploy lives outside git.** The brotli-renamed `.mjs`/`.mcss` assets, the CSP, the security headers and a **296-day** `max-age` on `index.html` all come from BunnyCDN pull-zone settings that exist in no file. And the live CSP is copy-pasted from another product: it whitelists `honey.id`, `restream.io`, `castr.io`, `hyperdx.io` and `usefathom.com` for a site that makes no network calls at all.
- **Top three:** (1) fix the starter's lockfile trichotomy so a clone builds; (2) give the starter a real auth/API/guard reference implementation, since its absence is what the downstream bugs grew into; (3) pull worktables.dev's CDN configuration into the repo and trim the inherited CSP.

---

# Part 1 — `ui-starter-app`

## Cross-repo pattern check (explicit presence/absence)

Reported either way, per the brief. All greps run over the whole repo excluding lockfiles.

| Pattern | Verdict | Evidence |
|---|---|---|
| `encodePassword` / `src/utils/encoders.ts` | **ABSENT** | No `src/utils/` directory exists. `rg 'encodePassword\|encoders\|base32'` over the repo: zero hits. Neither `LoginPage.tsx` nor `SignupPage.tsx` transforms the password at all; both stop at a TODO. |
| Role read from `localStorage`, used to authorize | **ABSENT** | The only `localStorage` access in the repo is `src/lib/theme.ts:8,29`, reading and writing the `"theme"` key. No role, no permission, no session. |
| `ProtectedRoute` that renders children unconditionally | **ABSENT** — and so is any guard | `rg 'ProtectedRoute'`: zero hits. `src/App.tsx:13-23` declares four routes with no guard component of any kind. See finding `starter-full-04`: this hole is the real issue. |
| Squatted dependency name (`biome` vs `@biomejs/biome`) | **ABSENT** | `package.json:61` declares `"@biomejs/biome": "^2.4.15"`, the correct scoped package. For contrast, `kard.vip/package.json:64` has `"biome": "^0.3.3"`, the abandoned squat. The starter is **not** the origin; kard.vip diverged on its own. |
| Deploy token hardcoded in `.github/workflows/**` | **ABSENT** | `.github/workflows/pipeline.yml:42-45,66-67` reads all four BunnyCDN values from `${{ secrets.* }}`. `git log --all -p` scanned for `AccessKey:` literals, `ghp_`, `sk-`, `xox[bp]-`: nothing. |
| Secrets or `location.href` reaching a logging sink | **ABSENT** | No HyperDX, no logger, no analytics. One `console.log` total, in the build script (`src/scripts/cleanup.js:46`), printing a version number. |
| Encryption key stored beside the ciphertext | **ABSENT** | No `@pathscale/secure-local-storage-aes-siv` dependency, no `sessionStorage` use. |
| CI installs without a frozen lockfile | **PRESENT** | `.github/workflows/pipeline.yml:23` runs bare `bun install`. Confirms cross-repo pattern 6. Compounded here by finding `starter-full-01`. |
| Tailwind v4 `@source` for `@pathscale/ui` | **PRESENT and correct** | `src/index.css:3`: `@source "../node_modules/@pathscale/ui/";`, identical to `support.cafe/src/index.css:3` and `kard.vip/src/index.css:3`. A project started from this template will not silently render unstyled components. |
| Committed `.env` / placeholder secrets | **ABSENT** | `find . -name '.env*'`: nothing, in the tree or in history. `.gitignore:19-23` covers the usual set. |
| XSS sinks (`innerHTML`, `dangerouslySetInnerHTML`, `html\`\``) | **ABSENT** | Zero hits across `src/`. |

**Bottom line for the spread question: the template is not the vector.** None of the five defects the sibling reviews found downstream can be traced to this repo. They were each written independently in the consuming apps.

## Findings

### [SEV-1] Three lockfiles-of-record disagree, and the committed bun lock cannot build the committed source
- **ID:** `starter-full-01`
- **Severity:** Critical
- **Category:** Correctness
- **Confidence:** High (file contents are unambiguous; the exact `bun install` self-heal behaviour is Medium, see below)
- **Location:** `bun.lock:11,233`; `package-lock.json:1642-1645`; `package.json:38`; `AGENTS.md:8,17`; `.github/workflows/pipeline.yml:23`
- **What:** Four sources claim authority over the dependency tree and none agree.
  - `package.json:38` — `"@pathscale/ui": "^1.2.6"`
  - `bun.lock:11` — workspace spec recorded as `"@pathscale/ui": "^0.0.94"`, resolving at `bun.lock:233` to `@pathscale/ui@0.0.94`
  - `package-lock.json:1643` — `"version": "1.2.10"`
  - `AGENTS.md:17` — "**`npm` is the package manager** — its lockfile is authoritative. Don't introduce a second one" — while `README.md:18` says `bun install`, `package.json:16` shells out to `bun run`, `.husky/commit-msg` runs `bunx`, `docs/frontend-conventions.md:6` lists **Bun** in the stack, and CI runs `bun install`.

  The drift is traceable: commit `857facf` moved the app to `@pathscale/ui@0.0.94`; commit `ee11c99` ("modernize starter foundation… @pathscale/ui 1.2") rewrote `package.json` and **added** a 9160-line `package-lock.json`, but `git show --stat ee11c99` shows it never touched `bun.lock`. So `bun.lock` is still the 0.0.94-era file.

  This is not academic. `src/features/auth/pages/LoginPage.tsx:1-11` imports `AuthCard`, `AuthErrorMessage`, `AuthFieldGroup`, `AuthPoweredBy`, `AuthSubmitButton` and `PasswordField`. Those primitives were added to the UI library in commit `d23cfdd` (2026-05-21), whose `package.json` reads `"version": "1.1.72"`. **`@pathscale/ui@0.0.94` does not export any of them.** With the committed bun lock installed, `bun run typecheck` — which `package.json:13` makes a hard gate on `build` — fails on six missing exports before anything else runs.
- **Why it matters:** This is a template. Its one job is that `git clone && bun install && bun run dev` works. Today the three plausible install paths give three different trees: `bun install --frozen-lockfile` installs a library that cannot compile the source; `npm ci` installs 1.2.10 and works but leaves the bun lock lying about it; bare `bun install` (CI's path, `pipeline.yml:23`) re-resolves `^1.2.6` to whatever is newest today — currently **1.3.1**, per `worktables.dev/bun.lock:189` — rewrites `bun.lock`, and leaves the developer with a dirty working tree after a fresh install. There is no reproducible build anywhere in this repo, and every project generated from it inherits both lockfiles and the same ambiguity.
- **Fix:** Mechanical, but pick one owner first.
  1. Decide the package manager. Every runtime signal says **bun**; only `AGENTS.md` says npm. Delete `package-lock.json`, add it to `.gitignore`, and correct `AGENTS.md:8,16,17` to bun (also fixing its `npm run typecheck` / `npm install` command block at lines 22-27).
  2. Regenerate `bun.lock` against the current `package.json` and commit it.
  3. Change `.github/workflows/pipeline.yml:23` to `bun install --frozen-lockfile` so a drifted lock fails CI loudly rather than being silently papered over.
  4. Pin `@pathscale/ui` to what you actually test against. `support.cafe` and `worktables.dev` are both on `^1.2.11`; the library repo is at `1.3.0` and npm serves `1.3.1`. `^1.2.6` is a floating range across a minor boundary in a template, which is how this drifted in the first place.
- **Effort:** S
- **Blast radius:** `package.json`, both lockfiles, `AGENTS.md`, `README.md`, the workflow. Not a source change. Every future clone benefits; existing clones need one reinstall.

### [SEV-2] `public/config/routes.ts` publishes drifted TypeScript source to the web on every downstream site
- **ID:** `starter-full-02`
- **Severity:** High
- **Category:** Design (with a security-hygiene edge)
- **Confidence:** High
- **Location:** `public/config/routes.ts:1-31` (all of it); contrast `src/config/routes.ts:1-8`
- **What:** There is a second copy of the route constants sitting in `public/`. rsbuild copies `public/` verbatim into `dist/`, so this file is uploaded by `pipeline.yml:48-50` and served at `https://<your-site>/config/routes.ts` for every app generated from the template. It is not imported by anything (`rg` over `src/` finds no reference), and it has already drifted from the real one:

  | | `src/config/routes.ts` | `public/config/routes.ts` |
  |---|---|---|
  | fourth route | `DASHBOARD: "/dashboard"` | `ADMIN: "/admin"` |
  | exports | `ROUTES`, `Route` type | `ROUTES`, three type aliases, `getRoute`, `isValidRoute`, `isAuthRoute` |
  | type safety | clean | `public/config/routes.ts:30` uses `authRoutes.includes(path as any)` |

  It also directly contradicts the template's own architecture doc, `docs/frontend-architecture.md:111-113`: "Path constants — `src/config/routes.ts`. Present here, and it should exist in every app from day one. Every path string comes from this module."
- **Why it matters:** Three separate costs, all inherited. (a) Every downstream production site serves an unminified TypeScript file at a guessable path, advertising internal routes including `/admin` — mild, but it is exactly the sort of thing a scanner picks up, and nobody put it there on purpose. (b) It is a live trap for the next reader: two files named `routes.ts` exporting a symbol called `ROUTES` with different contents, and the wrong one is the one that greps first alphabetically in some tools. (c) The three helper functions (`getRoute`, `isValidRoute`, `isAuthRoute`) are textbook invented abstractions with zero callers, and they will get cargo-culted forward.
- **Fix:** Delete `public/config/routes.ts`. If any downstream app imports from `~/../public/config/routes` (worth one grep across the family before deleting), move the needed helper into `src/config/routes.ts` first. Mechanical.
- **Effort:** S
- **Blast radius:** One file. Verify no downstream app resolves it; the alias in `rsbuild.config.ts:15` is `~` → `./src`, so a normal import cannot reach it.

### [SEV-3] The template teaches no auth, no API client, and no fetch/loading/error pattern — which is the hole the downstream defects grew into
- **ID:** `starter-full-03`
- **Severity:** High
- **Category:** Design
- **Confidence:** High
- **Location:** `src/features/auth/pages/LoginPage.tsx:21-29`, `src/features/auth/pages/SignupPage.tsx:22-30`, `src/App.tsx:13-23`, `src/env.d.ts:6`, absence of `src/api/`, `src/services/`, `src/hooks/`
- **What:** The starter ships polished login and signup *screens* and then stops:
  ```ts
  // LoginPage.tsx:21-29
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!username().trim() || !password()) { setError("Enter your username and password."); return; }
    setError(null);
    // TODO: call your auth service here.
  };
  ```
  There is no session store, no token handling, no route guard (`App.tsx` has four unguarded `<Route>`s), no API client, and no example of the fetch/loading/error triad. `@tanstack/solid-query` is installed and a `QueryClientProvider` is mounted at `App.tsx:14`, but **not one `createQuery` call exists in the repo** — the provider wraps nothing that uses it.

  `docs/frontend-architecture.md:89-105` and `docs/frontend-services-contract.md` describe the intended `api/` → `models/` → `services/` → `hooks/` layering in detail, and honestly mark it "*(not in this starter)*". The documentation is good. The reference implementation is missing.
- **Why it matters:** This is the finding that explains the family. Four apps each needed login, a session, and a guard; the template gave each of them a form with a TODO and a docs page describing a layering they then had to build from scratch. web3.trading and nofilter.io independently wrote a base32 `encodePassword`; web3.trading and pays.online independently wrote a `localStorage` role guard; pays.online wrote a `ProtectedRoute` that returns early and renders children unconditionally. Those are three separate teams solving the same unspecified problem badly. A template that shipped one correct `ProtectedRoute` and one correct `apiClient` would have pre-empted all six defects. The cost of the hole is measured in the sibling reviews.
- **Fix:** Needs a short design discussion, then a day of work. Add, minimally:
  - `src/api/client.ts` — one fetch wrapper: base URL from build-time env, `credentials: "include"`, a timeout via `AbortSignal.timeout`, one error normalisation point, and a loud comment that passwords go over TLS to the server **unhashed and untransformed** and that client-side "encoding" is not a security measure. Naming that explicitly in the template is the cheapest possible inoculation against `encodePassword` reappearing.
  - `src/stores/session.ts` — a module-level `createSignal` holding the session, per the pattern `docs/frontend-architecture.md:102-103` already prescribes.
  - `src/components/ProtectedRoute.tsx` — a guard with the correct shape:
    ```tsx
    const ProtectedRoute: ParentComponent = (props) => {
      const session = useSession();               // async-aware
      return (
        <Show when={!session.loading} fallback={<PageSpinner />}>
          <Show when={session.user} fallback={<Navigate href={ROUTES.LOGIN} />}>
            {props.children}
          </Show>
        </Show>
      );
    };
    ```
    with a comment stating the invariant the downstream apps broke: **the guard is a UX affordance; the server is the authority. Never authorize off a client-held role.**
  - One real `createQuery` hook wired to a placeholder endpoint, so the fetch/loading/error triad has exactly one canonical shape to copy.
- **Effort:** L
- **Blast radius:** Additive to this repo. Downstream apps would adopt it at their own pace; the value is for the *next* app started from the template.

### [SEV-4] `import.meta.env.API_URL` is typed but never injected — it is `undefined` at runtime, always
- **ID:** `starter-full-04`
- **Severity:** Medium
- **Category:** Correctness
- **Confidence:** High
- **Location:** `src/env.d.ts:6` vs `rsbuild.config.ts:18-24`
- **What:** `env.d.ts:6` declares `readonly API_URL?: string;` on `ImportMetaEnv`, so TypeScript happily accepts `import.meta.env.API_URL`. But `rsbuild.config.ts:19-23` defines exactly one key:
  ```ts
  source: { define: { "import.meta.env.VERSION": JSON.stringify(process.env.GITHUB_RUN_NUMBER || "0.0.1") } }
  ```
  Nothing injects `API_URL`, no `.env` is read, and rsbuild does not auto-expose `process.env` under `import.meta.env`. The declaration is a promise the build does not keep.
- **Why it matters:** The first thing anyone does with this template is point it at a backend. They will write `fetch(\`${import.meta.env.API_URL}/auth/login\`)`, get a green typecheck, and ship requests to `undefined/auth/login`. The optional `?` makes it worse: it suppresses the strict-mode error that would otherwise have caught it, and it reads as "configured, may be absent" rather than "never wired".
- **Fix:** Mechanical. Add to `rsbuild.config.ts:19`:
  ```ts
  "import.meta.env.API_URL": JSON.stringify(process.env.API_URL ?? "http://localhost:8080"),
  ```
  and document the variable in `README.md`. Then make it non-optional in `env.d.ts` so a missing value is a build error, not a runtime `undefined`. While there: `rsbuild.config.ts:21` sources the version from `GITHUB_RUN_NUMBER`, which is CI-only, so local builds silently report `0.0.1` — fine, but worth a comment.
- **Effort:** S
- **Blast radius:** Two files.

### [SEV-5] Code splitting is disabled in config and then any surviving chunk is deleted from `dist/`
- **ID:** `starter-full-05`
- **Severity:** Medium
- **Category:** Performance
- **Confidence:** High
- **Location:** `rsbuild.config.ts:42-47`, `src/scripts/cleanup.js:23-27`
- **What:** Two independent mechanisms guarantee a single bundle:
  ```ts
  // rsbuild.config.ts:44-47
  optimization: { splitChunks: false, runtimeChunk: false }
  ```
  ```js
  // cleanup.js:23-27
  rmSync(path.join(dist, "static/js/async"), { recursive: true, force: true });
  ```
  The build config disables splitting; the post-build script then deletes the async-chunk directory, belt and braces. `cleanup.js:9-14` also renames the single hashed `index.*.js` to a fixed `app.mjs`, which is only coherent *because* there is exactly one chunk.
- **Why it matters:** This is fine for the starter itself, which is 5 pages of static markup. It is not fine as the default every downstream app inherits. The moment someone writes `const Dashboard = lazy(() => import("./Dashboard"))` — the standard SolidJS route-splitting idiom — rsbuild emits the chunk into `static/js/async/`, `cleanup.js` deletes it, and the route 404s **only in production builds**, with a clean dev server. That is a genuinely nasty failure mode: it passes local dev, passes `bun run build` (exit 0, the `rmSync` is in a `try`), and breaks on the CDN. `worktables.dev` carries the identical pair (`rsbuild.config.ts:61-64` and `cleanup.js:47-53`), so the pattern is already spreading.
- **Fix:** Needs a decision. If the fixed `app.mjs` filename is load-bearing for the BunnyCDN setup (it appears to be — see `worktables.dev` finding `wtdev-full-01`), then keep the single main chunk but stop deleting `static/js/async`, and adjust the deploy to upload it. Note that `worktables.dev/.github/workflows/pipeline.yml:100` already excludes `./static/js/async/*` from upload, so async chunks would need that exclusion lifted too. At minimum, add a comment in both files saying "lazy routes will not work until this is changed", so the trap is visible.
- **Effort:** M
- **Blast radius:** Build config and deploy script in the starter and in every app copied from it.

### [SEV-6] The navbar's "Dashboard" link goes nowhere — the template's first-run UX is broken
- **ID:** `starter-full-06`
- **Severity:** Medium
- **Category:** Correctness
- **Confidence:** High
- **Location:** `src/components/AppNavbar.tsx:9-12`, `src/config/routes.ts:5`, `src/App.tsx:16-20`
- **What:** `AppNavbar.tsx:9-12` declares two nav links, `HOME` and `DASHBOARD`. `src/config/routes.ts:5` defines `DASHBOARD: "/dashboard"`. `App.tsx:16-20` registers routes for `HOME`, `LOGIN` and `SIGNUP` only, and there is no catch-all `<Route path="*">`. Clicking "Dashboard" in the shipped navbar navigates to `/dashboard`, which matches nothing, and `@solidjs/router` renders nothing inside the shell.
- **Why it matters:** It is the second link in the header. Whoever runs the template for the first time will click it within thirty seconds and get a blank page under a navbar, with no error and no 404. For a template, first-run impression is the whole product.
- **Fix:** Mechanical. Either add a placeholder `DashboardPage` route (which also gives finding `starter-full-03` its natural home for the `ProtectedRoute` demo), or drop `DASHBOARD` from `NAV_LINKS`. Add a `<Route path="*" component={NotFoundPage} />` regardless — the template currently teaches that a 404 route is optional.
- **Effort:** S
- **Blast radius:** Two files.

### [SEV-7] Dependency bloat: 8 unused packages, two form libraries, two animation libraries
- **ID:** `starter-full-07`
- **Severity:** Medium
- **Category:** Maintainability
- **Confidence:** High
- **Location:** `package.json:33-72`
- **What:** Grepped every declared dependency against `src/`, `rsbuild.config.ts`, `postcss.config.mjs` and `src/index.css`. Zero references:

  `@modular-forms/solid` · `@solid-primitives/refs` · `@tanstack/solid-query-devtools` · `solid-icons` · `solid-sonner` · `class-variance-authority` · `tailwindcss-animate` · `cssnano`

  (`@felte/solid`, `@felte/validator-zod`, `@tanstack/solid-table` and `zod` are also unreferenced but are legitimate — they are declared peer dependencies of `@pathscale/ui`, per `bun.lock:233`, so they belong here.)

  Two of these are outright duplicates of something else in the same file:
  - **Two form libraries**: `@modular-forms/solid` (`package.json:37`) alongside `@felte/solid` (`:34`). Neither is used; only felte is a UI peer.
  - **Two animation libraries**: `tailwindcss-animate` (`:69`) alongside `tw-animate-css` (`:70`). Only `tw-animate-css` is actually imported (`src/index.css:2`).
  - `cssnano` (`:64`) is declared but `postcss.config.mjs` loads only `@tailwindcss/postcss`, so it never runs.
  - `glob` (`:45`) is a **production** dependency but is used solely by the build script `src/scripts/cleanup.js:3`. Same mistake in `worktables.dev/package.json:25`.
- **Why it matters:** A starter's dependency list is a recommendation. Shipping two competing form libraries tells the next developer that the house style is "either", which is how a codebase ends up with both. It is also 8 packages of install time and audit surface on every project, forever.
- **Fix:** Mechanical. Remove the eight unused packages; keep the four UI peers and add a comment saying why they are there. Move `glob` to `devDependencies`. Pick one form library and one animation library and say so in `docs/frontend-conventions.md`. Note that `@pathscale/ui@1.3.x` has moved to a wider peer set (`@tanstack/solid-form`, the `@solid-primitives/*` family, optional `popmotion`) — `support.cafe/package.json:49` already carries `popmotion`; the starter does not. Reconcile the peer set at the same time as finding `starter-full-01`.
- **Effort:** S
- **Blast radius:** `package.json` and the lockfile. Verify nothing in a downstream app relies on the template having pulled these in transitively.

### [SEV-8] `AGENTS.md` and `README.md` describe a repo that no longer exists
- **ID:** `starter-full-08`
- **Severity:** Medium
- **Category:** Docs
- **Confidence:** High
- **Location:** `AGENTS.md:8,16,17,22-27`; `README.md:3,7,9`
- **What:** `AGENTS.md` is the declared "single source of truth for the rules" (`:3-6`) and `CLAUDE.md:1` imports it as binding. It is wrong in three places:
  - `:8` "built with **`npm`**" and `:17` "**`npm` is the package manager** — its lockfile is authoritative. Don't introduce a second one by running npm/yarn/pnpm here." Contradicted by `README.md:18` (`bun install`), `package.json:16` (`bun run cleanup`), `.husky/commit-msg` (`bunx`), `.github/workflows/pipeline.yml:17-23` (bun), `.claude/settings.json:8` (`Bash(bun install:*)` pre-allowed), and `docs/frontend-conventions.md:6,42-47` which lists Bun in the stack and gives `bun run` validation commands. Both lockfiles already exist, so the rule it states has already been violated by the repo itself.
  - `:16,22-27` prescribe `npm run typecheck` / `npm install` while the conventions doc prescribes `bun run typecheck`. An agent reading both gets contradictory instructions from two files that each claim precedence.

  `README.md` is stale in three more places:
  - `:9` "TailwindCSS + **DaisyUI** styling" — DaisyUI was deliberately removed in commit `ee11c99` ("modernize starter foundation (**drop DaisyUI**, @pathscale/ui 1.2, …)"). No DaisyUI dependency remains.
  - `:7` "Feature-based architecture (`auth`, **`admin`**, **`user`**)" — `src/features/` contains only `auth/` and `home/`.
  - `:3` links "@pathscale/ui" to `https://github.com/pathscale/ui-starter-app`, i.e. this repo, not the library.
- **Why it matters:** `AGENTS.md:18` says "Docs describe what is true now" and `:64-67` says to fix factual errors in the same change. The file breaks its own rule on line 17. More concretely, the npm-vs-bun contradiction is not cosmetic: it is the *cause* of finding `starter-full-01`. Somebody followed `AGENTS.md`, ran `npm install`, generated `package-lock.json`, and left `bun.lock` behind.
- **Fix:** Mechanical, but do it together with `starter-full-01` so the docs and the tooling land on the same package manager in one commit. Note `AGENTS.md` is currently **dirty in the working tree** (`git status`: ` M AGENTS.md`) — check what that uncommitted edit does before rewriting.
- **Effort:** S
- **Blast radius:** Two docs. High leverage: every agent session in every downstream repo loads a descendant of this file.

### [SEV-9] Deploy workflow is a copy of another product's, and gates nothing
- **ID:** `starter-full-09`
- **Severity:** Medium
- **Category:** Maintainability / Security
- **Confidence:** High
- **Location:** `.github/workflows/pipeline.yml:1,3-7,15,18,22-23`
- **What:** Several problems in 56 lines:
  - `:1` `name: web3.trading` — the workflow in the *starter template* is named after a different product. Every generated project inherits a CI job called "web3.trading".
  - `:22-23` bare `bun install`, no `--frozen-lockfile`. Confirms cross-repo pattern 6. Given `starter-full-01`, CI is building against a **different** `@pathscale/ui` than any lockfile records.
  - `:3-7` triggers only on `push` to `master`; there is no `pull_request` job at all. `bun run lint` and `bun run typecheck` never run on a PR — typecheck runs only as a side effect of `build` inside the deploy job, after which a failure means the deploy step is skipped but nothing was reviewed. `AGENTS.md:46-62` has a DORMANT block acknowledging exactly this ("CI here does not reliably attach checks to pull requests"), which is honest but leaves the gap.
  - `:15` `actions/checkout@v3` and `:18` `oven-sh/setup-bun@v1` are both a major version behind (v5 / v2 respectively) and are unpinned by SHA.
  - `:48-50` uploads every file in `dist` with `curl -X PUT` in a loop, with **no error checking**: `curl` failures do not fail the step, so a partial upload is reported as a green deploy. (`worktables.dev` fixed exactly this — its `pipeline.yml:70-105` has retries and a failure count. The improvement never came back to the template.)
  - The template as shipped deploys itself to a BunnyCDN zone on every push to `master`.
- **Why it matters:** This is the CI every downstream project starts from, which is why several of them have the same unfrozen install and the same absent PR gate. The silent-partial-upload bug at `:48-50` means a network blip during deploy leaves a half-updated site and a green check mark.
- **Fix:** Mechanical. Rename the workflow; add `--frozen-lockfile`; add a `pull_request`-triggered job running `bun run lint && bun run typecheck`; bump the two actions; and port `worktables.dev`'s retrying `upload_file` function back into the template so the improvement propagates the right direction for once.
- **Effort:** M
- **Blast radius:** One file, but it is the seed for every project's CI.

### [SEV-10] TypeScript strictness stops at `strict: true`
- **ID:** `starter-full-10`
- **Severity:** Low
- **Category:** Maintainability
- **Confidence:** High
- **Location:** `tsconfig.json:1-24`
- **What:** `strict: true` is on, which is the right start. Missing, in a config that is copied into every project: `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`. Also `biome.json:24` turns **off** `noNonNullAssertion`, and `src/index.tsx:15` immediately uses `root!` — the one non-null assertion in the repo is the one the lint rule was disabled for.

  `types: []` (`:11`) is deliberate and correct for the browser bundle, but it means `@types/node` is invisible to `src/scripts/cleanup.js`, which imports `node:fs` and `node:path` and reads `process.env` — that file is simply not typechecked (`include: ["src"]` covers it, but as JS with no Node types).
- **Why it matters:** `noUncheckedIndexedAccess` in particular is the single highest-value flag for a data-driven frontend, and it is far cheaper to enable on day one of a template than on day 400 of an app that grew from it. Every flag not enabled here is a flag no downstream project will ever enable.
- **Fix:** Mechanical. Add the flags, fix the handful of resulting errors (the codebase is ~18 files), and re-enable `noNonNullAssertion` after fixing `index.tsx:15` — see the next finding.
- **Effort:** S
- **Blast radius:** `tsconfig.json`, `biome.json`, a few source files.

### [SEV-11] The root-element guard only runs in dev, then asserts non-null in prod
- **ID:** `starter-full-11`
- **Severity:** Low
- **Category:** Correctness / AI-smell
- **Confidence:** High
- **Location:** `src/index.tsx:9-15` (identical in `worktables.dev/src/index.tsx:9-15`)
- **What:**
  ```ts
  if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error("Root element not found. Did you forget to add it to your index.html? ...");
  }
  render(() => <App />, root!);
  ```
  The check is gated on `DEV`, so in production a missing `#root` skips the helpful error and goes straight to `render(..., null)`. The `!` then silences the type system that was pointing at the real problem.
- **Why it matters:** Small, but it is the template's *only* example of error handling, and it demonstrates the wrong shape: a diagnostic that disappears exactly where diagnostics are hardest to get. `mountId: "root"` is set in `rsbuild.config.ts:33` so the element is generated, making the guard near-impossible to trip — which is the AI-smell tell: defensive scaffolding for a state that cannot occur, then weakened so it cannot fire anyway.
- **Fix:** Drop the `DEV` gate and the `!`:
  ```ts
  const root = document.getElementById("root");
  if (!(root instanceof HTMLElement)) throw new Error("Root element #root not found in index.html");
  render(() => <App />, root);
  ```
  Two lines, and it lets `noNonNullAssertion` go back on.
- **Effort:** S
- **Blast radius:** One file per repo, both repos.

### [SEV-12] No error boundary anywhere in the template
- **ID:** `starter-full-12`
- **Severity:** Low
- **Category:** Design
- **Confidence:** High
- **Location:** `src/App.tsx:13-23`, `src/layouts/AppShell.tsx:6-11`
- **What:** `rg 'ErrorBoundary'` over both repos: zero hits. SolidJS ships `<ErrorBoundary>` and it is the standard wrapper for a router root. Neither the app shell nor the router root has one, so any render-time throw in any route blanks the entire page with only a console trace.
- **Why it matters:** The brief asks whether the template teaches the right defaults. This is one it does not teach at all, and it is one line. Combined with `starter-full-03` (no fetch error pattern) and `starter-full-11` (the one error path is dev-only), the template's overall message on error handling is "don't".
- **Fix:** Wrap the router root in `src/layouts/AppShell.tsx`:
  ```tsx
  <ErrorBoundary fallback={(err, reset) => <AppErrorFallback error={err} onReset={reset} />}>
    <div class="flex flex-1 flex-col">{props.children}</div>
  </ErrorBoundary>
  ```
  and add the fallback component. Also mention it in `docs/frontend-architecture.md`'s layouts section (`:58-62`), which currently describes layouts as "structural chrome" with no error story.
- **Effort:** S
- **Blast radius:** Two files, additive.

### [SEV-13] Placeholder `example.com` SEO files ship to production
- **ID:** `starter-full-13`
- **Severity:** Low
- **Category:** Maintainability
- **Confidence:** High
- **Location:** `public/robots.txt:6`, `public/sitemap.xml:4,10,16`
- **What:** `robots.txt:6` points at `https://example.com/sitemap.xml`; `sitemap.xml` lists three `https://example.com/...` URLs with a hardcoded `lastmod` of `2025-01-01`. `robots.txt:5` also has `Disallow: /admin/`, a route that exists only in the dead `public/config/routes.ts`.
- **Why it matters:** Placeholders that look complete get shipped. A downstream site launches advertising `example.com` as its sitemap host, and nobody notices because the file superficially reads as configured. A template is better served by an obviously-blank file than a plausibly-wrong one.
- **Fix:** Replace the host with an unmissable token (`https://REPLACE-ME.example/`), drop the stale `lastmod`, and remove the `/admin/` line along with `public/config/routes.ts`. Better still, generate both from `src/config/routes.ts` plus one `SITE_URL` constant so they cannot drift.
- **Effort:** S
- **Blast radius:** Two files.

<details>
<summary><strong>Nits — ui-starter-app</strong></summary>

- `src/layouts/AppLayout.tsx` — dead. Not imported anywhere; `App.tsx` uses `AppShell` and `HomePage.tsx:34` renders `<Footer/>` itself. But `docs/frontend-architecture.md:60` lists it as shipped, so deleting it means updating that doc.
- `src/components/Counter.tsx` — dead. Zero importers; scaffold leftover.
- `src/assets/logo.svg` — dead. `Logo.tsx:15-23` has an inline SVG instead. `docs/frontend-architecture.md:23` lists `assets/` as part of the shipped skeleton on the strength of this one unused file.
- `src/components/AppNavbar.tsx:36-40` uses `NAV_LINKS.map(...)` inside JSX. Works (static array), but `docs/frontend-conventions.md:10-11` explicitly says to use `<For>`, and the template is the thing people copy from. `worktables.dev/src/pages/HomePage.tsx:151,222` gets this right.
- `src/lib/theme.ts:17-23` runs a module-level side effect that sets `data-theme` on import, so the initial paint is whatever `createSignal("light")` says until the module body runs. There is no inline pre-hydration script in `index.html`, so a dark-mode user gets a light flash on every cold load. Same in `worktables.dev/src/lib/theme.ts`, mirrored (dark default, light flash inverted).
- `package.json:13` — `"build": "npm run typecheck && rsbuild build && bun run cleanup"` mixes both package managers in a single script line. Works on CI (npm is preinstalled on `ubuntu-latest`) but requires both toolchains on a dev machine.
- `package.json:2` — `"name": "solid-starter-kit"` while the repo, the README and `AGENTS.md:43` all call it `ui-starter-app`. `:4` still describes it as coming "from pays.online and honey.id".
- `.claude/hooks/ask-before-risky-commands.sh:2` — header comment says "pathscale **backend service**"; `:62-63` gate `regenerate_endpoints`, which does not exist in this repo. Copied from a backend repo without trimming.
- `src/ThemeToggle.tsx:18-47` hand-rolls two inline SVGs while `@pathscale/ui` exports `Icon` (used correctly in `LoginPage.tsx:45` and in `worktables.dev/src/ThemeToggle.tsx:23-26`, which is the better version of this same component). The starter should carry the better one.
- `biome.json:21` sets `noConsole: "warn"` but `files.includes` (`:63`) excludes only `dist`, `node_modules`, config files and `.claude` — so `src/scripts/cleanup.js:46` warns on every lint run.
- `.gitignore:15-16` — `_.log` and `report.[0-9]_.[0-9]_...json` look like corrupted globs (`*` replaced by `_`) carried across several repos. `worktables.dev/.gitignore:15-16` is identical.

</details>

---

# Part 2 — `worktables.dev`

Clean, small, and fast. 11 source files, one route, no state management, no network calls. Findings concentrate almost entirely in deploy configuration rather than in code.

## Content accuracy against the WorkTable crate

Checked every capability claim on the page against `/Users/revenge/code/WorkTable` at version 0.9.2 (`Cargo.toml:6`), read-only. **No overstated or stale claims found.** Detail, since a clean result is worth as much as a dirty one:

| Site claim | Location | Verified against |
|---|---|---|
| `worktable!` generates table/row/primary-key types | `HomePage.tsx:9-11` | `codegen/src/lib.rs:16` (`#[proc_macro] pub fn worktable`) |
| Autoincrement or supplied PKs; unique and non-unique secondary indexes, each adding `select_by_<column>` | `HomePage.tsx:14-15` | `src/primary_key.rs` via prelude (`PrimaryKeyGenerator`, `TablePrimaryKey`), `codegen/src/generators/*/wrapper.rs` |
| `select`/`insert`/`upsert`/`update`/`delete` + `select_all` builder | `HomePage.tsx:19-20` | `SelectQueryBuilder`/`SelectQueryExecutor` in `src/lib.rs` prelude; `tests/worktable/upsert.rs` exists |
| Paged storage with a free list; `rkyv` zero-copy on archived rows | `HomePage.tsx:24-25` | `DataPages`/`ArchivedRowWrapper` in the prelude; `rkyv = "0.8.9"` (`Cargo.toml:47`) |
| Lock-free concurrent indexes with CDC, plus a row-level lock map | `HomePage.tsx:29-30` | `indexset` with `concurrent,cdc,multimap` features (`Cargo.toml:33`); `LockMap`/`RowLock` in the prelude |
| `PersistedWorkTable` to disk; `s3-support` feature syncs to S3; both opt-in | `HomePage.tsx:34-35`, `:181-194` | `src/lib.rs:18` exports `PersistedWorkTable`/`PersistenceConfig`; `Cargo.toml:19` defines `s3-support` |
| `worktable_version!` and `migration_engine!` version schemas and generate migrations | `HomePage.tsx:39-40` | `codegen/src/lib.rs:52` and `:58`, both real proc macros; `tests/worktable_version/basic.rs` |
| `MemStat` reports memory actually held | `HomePage.tsx:44-45` | `src/mem_stat/mod.rs`; `MemStat` in the prelude and as a derive macro |
| Built on `data_bucket`; take it through WorkTable's re-export or you get two incompatible copies | `HomePage.tsx:196-208` | `src/lib.rs:22` `pub use data_bucket;`, pinned `data_bucket = "=0.4.0"` (`Cargo.toml:26`) |
| Not-for list: no SQL/planner, no multi-process, no cross-table transactions | `HomePage.tsx:49-66` | Matches the crate README's own "When to use something else" |
| The `worktable!` code sample | `HomePage.tsx:114` | Syntax matches real usage. I specifically checked the comma between the `indexes` and `queries` blocks: both `},` (`tests/worktable/index/mod.rs:25-26`) and `}` (`tests/worktable/unsized_.rs:21-22`) appear in the crate's own tests, so the site's comma form compiles. `filled: u64 optional` with `FilledByExchange(filled) by exchange` mirrors the README's `another: u64 optional` example exactly. |

Two things the site does **right** by omission, worth recording so nobody "improves" them later:
- The crate's own `Cargo.toml:12` description says "**near-Vec performance**" and its README's feature table claims "Queries can return at **nanosecond scale**". The site repeats **neither**. `README.md:35-37` explains why: the `paper-bench` harness has not published results, so the site carries no figures the repo cannot back. That is exactly the right call and it should survive future copy edits.
- The site's "When to use something else" section (`HomePage.tsx:49-66`) is prominent and honest, including "There may be better options. Check your exact requirements first." Rare on a product site.

One version note, not a defect: the crate is at 0.9.2 and the site's install snippet is a bare `cargo add worktable` (`HomePage.tsx:95,247`) with no pinned version, so it cannot go stale.

## Findings

### [SEV-1] Every deploy-critical setting lives in the BunnyCDN dashboard and in no file
- **ID:** `wtdev-full-01`
- **Severity:** High
- **Category:** Maintainability / Security
- **Confidence:** High (verified against the live site)
- **Location:** `src/scripts/cleanup.js:10-45`, `.github/workflows/pipeline.yml:42-118`, `README.md:25-31`
- **What:** `cleanup.js:19-24` renames the **brotli-compressed** `index.*.js.br` to `app.mjs` and deletes the plain file; `:34-39` does the same for CSS, producing `app.mcss`. The uploaded artifacts are therefore raw brotli streams under non-standard extensions:
  ```
  $ file dist/static/js/app.mjs dist/static/css/app.mcss
  dist/static/js/app.mjs:   data
  dist/static/css/app.mcss: data
  ```
  The `curl -X PUT` in `pipeline.yml:77-81` sends no `Content-Encoding` and no `Content-Type`. So correct rendering depends entirely on pull-zone rules that exist nowhere in the repository. I confirmed the zone **is** configured correctly today:
  ```
  GET /static/js/app.mjs   -> content-type: application/javascript  content-encoding: br
  GET /static/css/app.mcss -> content-type: text/css                content-encoding: br
  ```
  Also configured only at the edge, and also absent from git: the full CSP, `strict-transport-security`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: no-referrer`, `permissions-policy`, `reporting-endpoints`, and `cache-control: max-age=25600000` on `index.html`.
- **Why it matters:** The site works, so this is not an outage; it is an unexploded one. Repoint the workflow at a new zone, recreate the zone, or have someone tidy a rule they do not recognise, and every visitor downloads binary garbage with a `text/css` label — and `x-content-type-options: nosniff` (correctly set) means the browser will not rescue it. Nothing in the repo would flag it: `bun run build` succeeds, CI goes green, all files upload. The only mention of deploy prerequisites is `README.md:27-29`, which lists two secrets and says nothing about content-encoding rules, MIME mappings, cache headers or the CSP. This is also the highest-risk thing to copy: the same `cleanup.js` brotli-rename now exists in the `ui-starter-app` lineage in weakened form, and any project that copies it onto a plain static host ships a broken site on day one.
- **Fix:** Needs a small design decision, then mechanical work.
  - **Preferred:** stop the brotli renaming. Serve `app.js`/`app.css` normally and let BunnyCDN compress on the fly, or upload both `app.js` and `app.js.br` and let the edge negotiate. Removes the whole class of problem.
  - **If the current scheme must stay:** commit the required pull-zone configuration to the repo as `deploy/bunnycdn.md` (exact rules, in copy-pasteable form) *and* add a post-deploy smoke check to `pipeline.yml` that fails the job when the contract is broken:
    ```bash
    ct=$(curl -sI "https://worktables.dev/static/css/app.mcss" | tr -d '\r' | awk -F': ' '/^content-type/{print $2}')
    ce=$(curl -sI "https://worktables.dev/static/css/app.mcss" | tr -d '\r' | awk -F': ' '/^content-encoding/{print $2}')
    [ "$ct" = "text/css" ] && [ "$ce" = "br" ] || { echo "::error::CDN content headers wrong"; exit 1; }
    ```
  Either way, record the CSP and security headers in the repo so they are reviewable.
- **Effort:** M
- **Blast radius:** `cleanup.js`, the workflow, the README. Touches the live deploy, so land it when someone can watch the site.

### [SEV-2] The live CSP is inherited from another product and whitelists nine hosts this site never contacts
- **ID:** `wtdev-full-02`
- **Severity:** Medium
- **Category:** Security
- **Confidence:** High (header read from the live site; the copy-paste origin is inferred, Medium)
- **Location:** Not in the repo — served by the BunnyCDN pull zone on `https://worktables.dev/`
- **What:** The live `content-security-policy` contains, in `connect-src`:
  `https://live.restream.io/`, `https://*.cloudflarestream.com/`, `https://*.castr.io/`, `https://*.honey.id`, `wss://*.honey.id/`, `https://in-otel.hyperdx.io`, `https://speed.cloudflare.com`, `https://cdn.usefathom.com`, `https://aim.cloudflare.com/`
  and in `default-src`: `'self' https://*.honey.id https://*.worktables.dev`.

  worktables.dev is a single static page. `rg 'https?://' src/` returns only `github.com`, `crates.io` and `docs.rs` link hrefs. It issues **no** `fetch`, no XHR, no WebSocket, and loads no third-party script. Restream and Castr are video-ingest hosts (nofilter.io's stack); `in-otel.hyperdx.io` is the logging sink flagged in cross-repo pattern 3; `honey.id` is the auth product. None have any business here.

  Two further weaknesses in the same policy:
  - `script-src 'self'` is immediately overridden for elements by `script-src-elem 'self' 'unsafe-inline' blob:`. Since `script-src-elem` takes precedence for `<script>` elements, **inline scripts execute**. That removes CSP's main XSS mitigation. Same shape for `style-src-elem`.
  - `reporting-endpoints` and `report-uri` both point at `https://report.centralcsp.com/69e64a5aef0c5f2a0a417ed6`, a third party that will receive a report containing the blocked URI and the document URL for every violation, from a policy loose enough that violations will be rare and uninformative.
- **Why it matters:** A CSP's value is the narrowness of what it permits. This one permits an inline-script bypass plus nine exfiltration destinations for a site whose legitimate `connect-src` is `'none'`. If an attacker ever gets script execution here (via a compromised dependency in the 22 KB bundle, or a CDN-storage compromise), the policy actively assists them. The header being invisible in git means nobody reviewing this repo will ever notice.
- **Fix:** Mechanical once someone has zone access. For this site the correct policy is close to:
  ```
  default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:;
  font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none';
  frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
  ```
  Drop `'unsafe-inline'` from `script-src-elem` (there are no inline scripts — `dist/index.html` has one external `<script defer src>` and one `<link rel=stylesheet>`). Keep `style-src-attr 'unsafe-inline'` only if a `@pathscale/ui` component sets inline styles; verify before removing. Then commit the final policy to the repo per `wtdev-full-01`.
- **Effort:** S
- **Blast radius:** CDN config only. Test on a staging zone first; a too-tight CSP blanks the page.

### [SEV-3] `index.html` is cached in browsers for 296 days
- **ID:** `wtdev-full-03`
- **Severity:** Medium
- **Category:** Performance / Correctness
- **Confidence:** High (header read from the live site)
- **Location:** CDN config (not in repo); interacts with `src/scripts/cleanup.js:64-78` and `.github/workflows/pipeline.yml:107-118`
- **What:** Live: `GET https://worktables.dev/` returns `cache-control: max-age=25600000` — 296 days — with no `must-revalidate` and no `ETag`-based revalidation path. The assets it references are `cache-control: public,max-age=600,immutable`.

  This makes the version query string decorative. `cleanup.js:69-74` rewrites the HTML to reference `app.mjs?v=1.0.1`, but since a returning visitor holds the old HTML for up to 296 days, they never learn a new `?v=`. The site only self-heals because the *asset path is fixed* (`app.mjs` always, no content hash) and its `max-age` is 600 s, so the old HTML pulls the new bundle within ten minutes. The cache-busting works by accident, through the mechanism the `?v=` was meant to replace.

  The workflow's `Remove stale assets` step (`pipeline.yml:42-62`) and `Purge BunnyCDN edge cache` step (`:107-118`) both address the *edge*, not browsers, so neither helps.
- **Why it matters:** Two concrete costs. (a) If a deploy ever ships a genuinely broken `index.html` — wrong asset path, malformed markup — every visitor who loaded it is stuck with it for up to ten months, and no purge, redeploy or rollback can reach them. (b) `dist/index.html` is 735 bytes; caching it for 296 days buys essentially nothing while removing all ability to change it.
- **Fix:** Set `cache-control: no-cache` (or `max-age=0, must-revalidate`) on `/`, `/index.html` and `/404.html` at the pull zone. Keep long `max-age` for `/static/*`, and once that is in place, switch back to content-hashed asset filenames so the `immutable` claim is actually true and the `?v=` string can be deleted. Note this depends on resolving `wtdev-full-01`, since the fixed `app.mjs` name exists to satisfy the same CDN setup.
- **Effort:** S (CDN change) / M (if paired with restoring hashed filenames)
- **Blast radius:** CDN config, plus `cleanup.js` if hashed names return.

### [SEV-4] Three inert `<meta>` cache directives, shipped and contradicted by the real headers
- **ID:** `wtdev-full-04`
- **Severity:** Low
- **Category:** AI-smell
- **Confidence:** High
- **Location:** `rsbuild.config.ts:35-37`, emitted into `dist/index.html`
- **What:**
  ```ts
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  ```
  rsbuild's object-vs-string `meta` handling is understood here — `:30-32` even carries a correct comment explaining that `charset` needs the object form. But these three go out as `name=`, not `http-equiv=`. Verified in the shipped output:
  ```html
  <meta name="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta name="Pragma" content="no-cache"><meta name="Expires" content="0">
  ```
  `<meta name="Cache-Control">` means nothing to any browser. Even the correct `http-equiv` form has been ignored for `Cache-Control` by every major browser for years. And they assert the exact opposite of the real header (`max-age=25600000`, finding `wtdev-full-03`).
- **Why it matters:** Small on its own, but it is the clearest AI-smell artifact in either repo: three lines of cargo-culted 2005-era markup, sitting directly beneath a comment demonstrating that the author understood the very API subtlety these lines get wrong. Anyone debugging the 296-day cache will find these, believe caching is handled in the repo, and look elsewhere. That is the actual cost.
- **Fix:** Delete `rsbuild.config.ts:35-37`. Set cache policy at the CDN (`wtdev-full-03`). One-line change.
- **Effort:** S
- **Blast radius:** One file.

### [SEV-5] Every nonexistent URL returns HTTP 200 with the homepage
- **ID:** `wtdev-full-05`
- **Severity:** Low
- **Category:** Correctness / Docs
- **Confidence:** High (verified live)
- **Location:** `src/App.tsx:20`, `src/config/routes.ts:3`, `.github/workflows/pipeline.yml:36-40`
- **What:** `App.tsx:20` is `<Route path="*" component={HomePage} />` — the catch-all renders the homepage rather than a 404 page. The workflow (`:36-40`) mirrors `index.html` to `bunnycdn_errors/404.html`, and the zone serves it with a 200 status. Verified:
  ```
  GET https://worktables.dev/does-not-exist  -> 200
  GET https://worktables.dev/docs            -> 200   (homepage)
  ```
  Separately, `src/config/routes.ts:3` declares `DOCS: "/docs"` but no `<Route>` uses it, and no component links to it (`SiteNavbar.tsx:16` links "Docs" to the external `DOCSRS_URL`). It is dead config that happens to name a path the catch-all now silently answers.
- **Why it matters:** For a marketing site, soft-404s are an SEO liability: search engines index arbitrary URLs as duplicate homepages, and Google explicitly flags soft-404s. Anyone typo-ing a URL or following a stale link gets the homepage with no signal that the page they wanted is gone. There is exactly one real route, so the catch-all serves no purpose but to manufacture this.
- **Fix:** Mechanical. Add a small `NotFoundPage` and point the catch-all at it; configure the zone to return a real 404 status for `bunnycdn_errors/404.html`. Delete `ROUTES.DOCS` or wire it to a real page.
- **Effort:** S
- **Blast radius:** Two source files plus one zone setting.

### [SEV-6] The deploy deletes live assets before uploading their replacements, with no rollback
- **ID:** `wtdev-full-06`
- **Severity:** Low
- **Category:** Correctness
- **Confidence:** High
- **Location:** `.github/workflows/pipeline.yml:42-62` then `:64-105`
- **What:** The `Remove stale assets` step issues seven `DELETE` calls against `index.html`, `404.html`, `app.mjs`, `app.js`, `app.js.br`, `app.mcss`, `app.css` and `app.css.br`, each with `|| true` so failures are ignored. Only afterwards does the upload loop run. The upload is careful — `upload_file()` (`:70-93`) retries four times with backoff and the step exits 1 on any failure (`:102-105`) — but by then the old files are already gone. There is no staging path, no atomic swap, and no restore.
- **Why it matters:** Sustained BunnyCDN storage trouble means the site is *down*, not stale, and the only recovery is re-running the workflow. Given the 296-day HTML cache (`wtdev-full-03`), a window exists where new visitors get nothing and returning visitors get a cached shell pointing at a deleted bundle. Low severity because the retry logic makes total failure unlikely and this is a marketing page, not a service.
- **Fix:** Upload first, then delete only the files that are genuinely stale and were not just written. The delete step exists to clear the `app.js` vs `app.mjs` and `.css` vs `.mcss` naming variants; a set difference computed after a successful upload does the same job without the gap. Also address the unfrozen `bun install` at `:23` (cross-repo pattern 6) while in the file, and consider a `pull_request` job running `bun run typecheck && bun run lint`, which today run only inside the deploy job.
- **Effort:** M
- **Blast radius:** One workflow file.

<details>
<summary><strong>Nits — worktables.dev</strong></summary>

- **Performance is excellent and needs nothing.** `dist/` totals 56 KB: `app.mjs` 22,636 bytes and `app.mcss` 12,831 bytes, both already brotli. Zero images, zero web fonts (`rg 'font-face|fonts.googleapis'`: no hits), zero third-party scripts, one route, no data fetching. There is no bundle, image, font or splitting finding to make.
- `dist/index.html` has no `lang` attribute on `<html>`. One-line accessibility fix; rsbuild's `html.lang` option sets it.
- No `og:` or `twitter:` meta tags and no `<link rel="canonical">` on a site whose purpose is to be linked. `rsbuild.config.ts:28-43` already builds the meta block; adding four tags there is trivial and materially improves link previews.
- `public/version.json` is committed as `{ "version": "0.0.1" }` and overwritten by `pipeline.yml:29`. Nothing in `src/` fetches it, so it is a write-only artifact. Either consume it (a build stamp in the footer) or drop it; the commit that added it (`a9057a5`) exists only so the deploy has a file to overwrite.
- `src/lib/theme.ts` is a near-duplicate of `ui-starter-app/src/lib/theme.ts`, differing only in the default (`dark` vs `light`) and the media query polarity (`prefers-color-scheme: light` vs `dark`). Two copies that will drift. Candidate for extraction into `@pathscale/ui` with the default as a parameter, which would also fix the flash-of-wrong-theme noted in the starter's nits.
- `src/scripts/cleanup.js:60` — `const buildNumber = process.env.GITHUB_RUN_NUMBER || "137";`. A magic `"137"` fallback, presumably one project's run number at the time it was written. The starter's equivalent (`cleanup.js:32`) uses `"0"`, which is at least obviously a placeholder.
- `src/components/Footer.tsx:11-22` repeats a four-line `<a target="_blank" rel="noopener noreferrer" class="hover:text-base-content">` block four times over `GITHUB_URL`/`CRATES_URL`/`DOCSRS_URL`/`DATABUCKET_URL`. `HomePage.tsx` already demonstrates the `<For>` pattern at `:151` and `:222`; a `LINKS` array plus one `<For>` would be shorter and consistent with the file next door.
- `package.json:25` — `glob` is a production dependency used only by `src/scripts/cleanup.js`. Same as the starter; belongs in `devDependencies`.
- `README.md:31` — "Note the trigger is `main` here, unlike 24x.ai and promptsyntax.org which are on `master`." Accurate today (`pipeline.yml:6`), and exactly the kind of cross-repo claim that silently rots. Worth a periodic recheck.
- `src/index.tsx:9-15` carries the same dev-only root guard as the starter; see `starter-full-11`.
- `.gitignore:15-16` has the same corrupted `_.log` globs as the starter.

</details>

---

## Cross-cutting recommendations

1. **Make the starter installable, in one commit.** Pick bun, delete `package-lock.json`, regenerate `bun.lock` against the real `package.json`, add `--frozen-lockfile` to CI, and correct `AGENTS.md:8,16,17` so the docs stop causing the drift they caused last time. Nothing else in the starter matters until `git clone && bun install && bun run dev` works. *Breaks:* anyone currently running `npm ci` here. *Effort:* S.

2. **Give the starter the auth/API/guard reference implementation it is missing.** `src/api/client.ts`, `src/stores/session.ts`, a correct `ProtectedRoute`, and one real `createQuery` hook — roughly 150 lines. The three defects the sibling reviews found downstream (`encodePassword`, the localStorage role guard, the no-op `ProtectedRoute`) were each written independently by teams the template left with a TODO and an architecture doc. The template is not the origin of those bugs; it is the reason they had to be invented. Write the correct version once, with the invariant stated in a comment: *the server is the authority; the client guard is a UX affordance.* *Breaks:* nothing, it is additive. *Effort:* L.

3. **Move worktables.dev's deploy contract into git.** The brotli-renamed asset extensions, their required `Content-Encoding`/`Content-Type` rules, the CSP, the security headers and the cache policy are all invisible to anyone reading the repo, and the CSP in particular is silently wrong (nine inherited third-party hosts, plus an `'unsafe-inline'` script bypass). Commit a `deploy/bunnycdn.md` that states the contract, add a post-deploy header assertion to the workflow, then trim the CSP to what a static page actually needs. *Breaks:* a too-tight CSP blanks the page; stage it. *Effort:* M.

4. **Decide the code-splitting story once, for the family.** `splitChunks: false` plus `rmSync(static/js/async)` plus the deploy's `! -path "./static/js/async/*"` exclusion means a `lazy()` route silently 404s in production while working perfectly in dev. Both repos carry it, so every downstream app does too. Either support async chunks end to end, or leave a comment at all three sites saying lazy routes are unsupported. Right now the trap is completely undocumented. *Breaks:* the fixed `app.mjs` filename convention, which is entangled with the CDN setup in recommendation 3. Do them together. *Effort:* M.

5. **Establish that improvements flow back to the template.** `worktables.dev/.github/workflows/pipeline.yml:70-105` has a retrying, failure-counting upload function; `ui-starter-app/.github/workflows/pipeline.yml:48-50` still has the naive loop that reports success on a partial upload. `worktables.dev/src/ThemeToggle.tsx` uses the library's `Icon` component; the starter hand-rolls two inline SVGs. `worktables.dev/src/pages/HomePage.tsx` uses `<For>`; the starter uses `.map()`. The better version of each already exists — it just never travels upstream. One pass porting these four takes an hour and makes the template the best copy rather than the oldest. *Effort:* S.

6. **Prune what the starter recommends by shipping it.** Eight unused dependencies, two form libraries, two animation libraries, two `routes.ts` files, three dead components, and placeholder `example.com` SEO files. Every one of those is a recommendation that a downstream project will act on. A template's dependency list and file tree *are* documentation, and this one currently documents indecision. *Effort:* S.

## What I did not cover

- **No install, no build, no run.** Per the brief's read-only rule I did not run `bun install`, `bun run build` or `bun run typecheck` in either repo, and `ui-starter-app` has no `node_modules`. Finding `starter-full-01`'s conclusion that the committed `bun.lock` cannot compile the committed source is derived from file contents (`bun.lock:233` resolves `0.0.94`; `LoginPage.tsx:1-11` imports primitives added at UI `1.1.72` per commit `d23cfdd`), not from an observed compile failure. **Confirm with `bun install --frozen-lockfile && bun run typecheck` before acting.** Likewise I did not verify exactly how bare `bun install` reconciles the manifest/lock mismatch; the finding holds either way, but the precise failure mode is unconfirmed.
- **No browser verification.** I did not load either site in a browser or run Lighthouse. worktables.dev's performance assessment is from `dist/` byte counts and live response headers; the theme flash-of-wrong-colour noted in the nits is inferred from `theme.ts`'s module-level side effect, not observed.
- **Live headers are a point-in-time read** taken 2026-07-27 from a Singapore edge (`cdn-requestcountrycode: SG`, pull zone 6221411). BunnyCDN rules can vary by zone configuration over time; re-verify before acting on `wtdev-full-01`/`02`/`03`.
- **I did not read the downstream apps.** All statements about web3.trading, nofilter.io, pays.online and kard.vip come from the brief plus a targeted `package.json` version comparison. I verified the *absence* of each pattern in the starter directly, and confirmed `kard.vip/package.json:64` carries the squatted `biome` while the starter does not; I did not audit the downstream code myself.
- **WorkTable crate: claims only.** I checked the site's assertions against `Cargo.toml`, `src/lib.rs`, `codegen/src/lib.rs`, the crate README and the test tree. I did not review the crate for correctness, did not run `cargo check`, and cannot speak to whether the *capabilities* are well implemented, only that they exist as described.
- **`ui-starter-app` is on branch `docs/git-workflow-rules` with `AGENTS.md` dirty.** I reviewed the working-tree version. There are four other unmerged branches (`chore/agent-docs-standard`, `feat/frontend-reference-docs`, `feat/skeleton-directories`); I did not read them, and some findings here may already be addressed there.
- **Not covered anywhere:** accessibility beyond spot observations, i18n, bundle analysis by module, and `docs/frontend-services-contract.md` (read for context, not audited against a real backend, since the starter has none).

## Quick-start for the follow-up agent

**Read in this order:**

*ui-starter-app*
1. `bun.lock:11,233` + `package-lock.json:1642-1645` + `package.json:38` — the three-way version disagreement; everything else waits on this.
2. `src/features/auth/pages/LoginPage.tsx:1-29` — the imports that the committed lock cannot satisfy, and the `// TODO` that is the whole auth story.
3. `AGENTS.md:8,16,17` vs `docs/frontend-conventions.md:6,42-47` — the npm/bun contradiction that caused item 1.
4. `public/config/routes.ts` — the drifted duplicate that ships to the web. Compare with `src/config/routes.ts`.
5. `rsbuild.config.ts:18-24,42-47` + `src/scripts/cleanup.js:23-27` — the missing `API_URL` injection and the code-splitting trap.
6. `docs/frontend-architecture.md` — genuinely good, and the spec for the reference implementation recommendation 2 asks for. Read before designing anything.

*worktables.dev*
1. `src/scripts/cleanup.js:10-45` — the brotli rename that makes the deploy depend on invisible CDN rules.
2. `.github/workflows/pipeline.yml:42-105` — delete-then-upload, and the careful upload function worth porting to the starter.
3. `rsbuild.config.ts:28-43` — the inert meta cache tags, and where `og:`/`lang` would go.
4. `src/pages/HomePage.tsx` — the entire site; also the content whose accuracy is verified in Part 2.

**Commands to reproduce:**
```bash
# The load-bearing verification for starter-full-01. Expect failure.
cd /Users/revenge/code/ui-starter-app && bun install --frozen-lockfile && bun run typecheck

# The three-way version disagreement, at a glance.
rg -n '"@pathscale/ui"' package.json bun.lock package-lock.json | head

# Live CDN contract for worktables.dev (wtdev-full-01/02/03).
curl -sI https://worktables.dev/static/css/app.mcss | rg -i 'content-type|content-encoding'
curl -s -D- -o/dev/null https://worktables.dev/ | rg -i 'content-security-policy|cache-control'
curl -s -o/dev/null -w '%{http_code}\n' https://worktables.dev/does-not-exist   # returns 200

# Both repos.
bun run lint && bun run typecheck && bun run build
```

**Surprises about the layout:**
- `ui-starter-app` has **two** `routes.ts` files exporting a symbol named `ROUTES`. `src/config/routes.ts` is the real one; `public/config/routes.ts` is dead, drifted, and served over HTTP.
- The `~` alias resolves to `./src` only (`rsbuild.config.ts:15`, `tsconfig.json:19`), so nothing under `public/` is importable — which is why the duplicate went unnoticed.
- `src/scripts/cleanup.js` runs *after* `rsbuild build` and rewrites `dist/index.html` in place. Asset filenames in the shipped HTML do not match what rsbuild emitted; do not debug the deploy without reading it. The two repos' copies differ meaningfully: only worktables.dev's does the brotli rename.
- `AGENTS.md` is loaded automatically into every Claude Code session via `CLAUDE.md:1`. It is currently wrong about the package manager, so agent sessions in this repo start from a false premise. Fix it early.
- `ui-starter-app` is checked out on `docs/git-workflow-rules`, not `master`, with an uncommitted `AGENTS.md` edit. Check `git stash list` and `git diff` before touching that file.
