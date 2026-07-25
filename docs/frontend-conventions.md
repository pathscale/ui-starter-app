# Frontend conventions — ui-starter-app

Read this **before** opening implementation files, so context stays small and existing
conventions are followed. It covers implementing, debugging, reviewing and refactoring pages, hooks, stores, services, routing and `@pathscale/ui` usage.

Stack: **SolidJS**, **rsbuild**, **Bun**, **Biome**, **`@pathscale/ui`**.

## Non-negotiables

- **SolidJS, not React.** No `useState`/`useEffect` reflexes, no virtual-DOM
  assumptions. Use signals, `<Show>`, `<For>`, and `class=` (not `className=`).
- Follow the existing hooks, stores, routes, guards and feature structure **before**
  introducing a new pattern. Find one analogous implementation and mirror it.
- **Reuse `@pathscale/ui`.** Verify a component's props from existing usage in this
  repo rather than assuming its API or building a replacement.
- **User-facing strings:** this repo has no i18n system today. If one is added, route
  every user-facing string through it — don't hand-roll a second mechanism alongside it.
- **Use Bun and Biome**, and this repository's actual validation commands (below) —
  not a remembered command from another project.

## Context-efficient workflow

1. **Classify the task before reading files:** auth · data/hooks · feature page ·
   routing · stores · UI/styling.
2. **Search narrowly before reading.** Prefer symbols, exact strings and matching line
   ranges over opening whole files.
3. **Start with at most five directly relevant files.** Expand only when there is a
   concrete unanswered question.
4. **Mirror an analogous implementation** before creating a new pattern.
5. **This repo has no backend services contract** — there is no services JSON to
   consult. Don't look for one.
6. **Don't repeat a search whose result you already have**, and don't reread unchanged
   files without a reason.
7. **Verify existing `@pathscale/ui` usage** before assuming a component API.
8. **Validate incrementally:** smallest relevant check first, broader checks only when
   needed.
9. **Report only:** changed files · validation results · remaining risks · contract
   limitations.

## Validation

```bash
bun run typecheck
bun run lint
bun run format
bun run build
```

Run the smallest relevant check first; widen only if it passes or the failure is unclear.

## References

Load only the reference needed for the current task — not all of them automatically:

- **[Frontend architecture](frontend-architecture.md)** — the `src/` skeleton: what
  belongs in each directory, the `components/` vs `features/` split, where state lives,
  and the routing layers. Marks which pieces this starter ships and which are the shape a
  full app grows into.
- **[Frontend services contract](frontend-services-contract.md)** — how a backend endpoint
  is wired from its contract JSON through generated DTOs to the hook a component consumes,
  and how errors surface. This starter has no backend wiring yet; the doc is the target
  shape for an app that adds one.
- **[`@pathscale/ui` usage reference](https://github.com/pathscale/ui/blob/master/docs/ui-usage.md)**
  — theming, component conventions, forms, table, toast, icons. Lives in the `ui` repo and
  is the single source of truth. Don't copy it here.

Validation is not a separate reference: this repository's exact commands are in the
**Validation** section above.
