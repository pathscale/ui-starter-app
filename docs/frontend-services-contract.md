# Frontend services contract — contract to hook

How a backend endpoint reaches a component in a `@pathscale/ui` application built on the
WebSocket RPC adapter (`@pathscale/wss-adapter`).

**This starter has no backend wiring** — no `api/`, `models/`, `services/` or `hooks/`
directory yet. This document is the target shape for an app that adds one, so the wiring
is consistent from the first endpoint rather than reinvented per app.

It documents the **pattern**, not a list of endpoints. Endpoints live in an app's own
service contract files and are already machine-readable there; any list here would be
stale within a week.

## The rule that comes before everything

**The service contract JSON is authoritative.** Endpoints, parameters, returns, error
variants and roles all come from it. If something is not in the contract, it does not
exist as far as the frontend is concerned.

Do not invent an endpoint, add a parameter the contract doesn't declare, or assume a
return shape because it would be convenient. When something you need is missing, **say so
and stop** — that is a backend conversation, not a frontend workaround. Guessing produces
code that typechecks, passes review, and fails against a real server.

An app carries one contract file per backend service, conventionally under `docs/` as
`<service>.services.json`. Each contract maps to its own subtree under `src/models/`.

## The chain

```
docs/<service>.services.json        the contract — authoritative, hand-maintained
  │
  ├─(codegen)─> src/models/<contract>/…        generated DTOs, enums, error catalog
  └─(codegen)─> src/api/services/<contract>/…  generated method maps (JSON)

src/api/configure.ts    reads the contract, configures @pathscale/wss-adapter
  └─> src/api/index.ts        exports callable session objects
        └─> src/hooks/<group>/useX.ts    solid-query wrapper — what components consume
              └─> src/services/…         only where there is domain logic to own
```

Two things about this are easy to get wrong:

**`src/api/services/` is generated, and the adapter configuration does not read it.** The
method map handed to the adapter is built in-process from the contract JSON. The files
under `src/api/services/` are a *separate emission* of the same information, imported by
hand in only a couple of narrow places. Don't treat that directory as the wiring, and
don't hand-edit it.

**`src/services/` is not a mandatory hop.** A plain read goes hook → `api/`. The
`services/` layer is entered when there is real work to own — multi-step flows, error
normalisation, connection lifecycle. Routing every call through it "for consistency" adds
a pass-through file that does nothing.

## What is generated, and what you write

The codegen script (conventionally `src/scripts/schema.js`, run via `bun run schema`)
reads each contract and emits:

| generated | contents |
|---|---|
| `src/models/<contract>/<service>/<Endpoint>Dto.ts` | request params + response types |
| `src/models/<contract>/<service>/index.ts` | barrel re-export |
| `src/models/<contract>/enums/` | contract enums, one file each, plus an index |
| `src/models/<contract>/errorCatalog.ts` | typed error variants, where the contract declares them |
| `src/api/services/<contract>/<service>.json` | endpoint code → name + parameter names |

**All of it is overwritten on the next run.** Edits are silently lost. Generated files
carry a "DO NOT MODIFY IT BY HAND" banner — if a file in `models/` has no banner, it is
hand-written and safe to edit, which is worth checking rather than assuming either way.

Hand-written: everything in `hooks/` and `services/`, the query keys in `constants/`, and
`api/configure.ts`.

## The hook layer

One hook per endpoint, wrapping `@tanstack/solid-query`. Four conventions, all
load-bearing:

- **Types come from `models/`** — never hand-declared next to the hook. A hand-written
  interface that mirrors a DTO will drift the first time the contract moves, and nothing
  will catch it.
- **Query keys come from a central module** (`src/constants/queryKeys.ts`), never inlined.
  Invalidation depends on keys being constructed the same way in every call site.
- **Gate `enabled` on connection readiness.** With a WebSocket transport the socket is not
  up on first paint; a query that doesn't gate will fire and fail before the session
  exists.
- **Unwrap the response defensively.** The adapter may return the payload directly or
  nested under `params` — handle both.

Components call the hook and read its reactive state. They never touch the session objects
from `api/` directly.

## Adding an endpoint

1. **Confirm it exists in the contract.** If not, stop — nothing below is valid.
2. **Regenerate.** Never hand-write the DTO.
3. **Commit the generated output** with your change; it is checked in.
4. **Add a query key** to the central module.
5. **Write the hook**, mirroring the nearest existing one — same unwrapping, same gate.
6. **Add a `services/` function only if there is logic to own.** Otherwise skip it.
7. **Consume the hook** from the component.

## How errors surface

Where a contract declares error variants, codegen emits a typed error catalog, and a
normalisation module in `services/` turns raw adapter errors into something a component
can act on. Four rules that module should encode:

- **Never branch on a message string.** Control flow keys off the error `kind` and numeric
  `code`. Messages are display text; they get rewritten, translated, and will break any
  logic built on them.
- **Allowlist what reaches the UI.** Pass through the safe structured fields — retry
  timings, attempt counts — and drop everything else, so a backend that later attaches a
  token to an error payload cannot leak it into a component.
- **Never surface the raw error.** Keep it for logging; don't render it.
- **Distinguish known from unknown.** A declared contract variant and an unrecognised
  failure should not take the same path — unknown failures get a generic message rather
  than an unhandled branch.

Transport-level failures are handled **once, centrally**, in the adapter's `onError`:
auth failures invalidate the session, everything else is logged. Individual hooks do not
re-implement that.

## When the contract and the code disagree

The contract wins. If `models/` looks wrong, regenerate before you debug — the usual cause
is a contract that moved and generated files that didn't. If the contract itself looks
wrong, that is a backend conversation. Don't paper over it in a hook.
