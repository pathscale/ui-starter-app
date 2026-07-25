# `api/` — transport wiring

Adapter configuration and the exported session objects hooks call. Nothing else.

**Belongs here:** `configure.ts` (remote URLs, method map, `timeout`, `onError`,
`onDisconnect`, then `wssAdapter.configure()`) and `index.ts` (exports the callable
sessions).

**Does not belong:** business logic, domain-aware retries, anything importing from
`features/`.

**Generated:** `api/services/` — one JSON method map per service, emitted by codegen.
Never hand-edited. Note the adapter config does *not* read it; it builds its method map
from the contract JSON directly.

See [`docs/frontend-services-contract.md`](../../docs/frontend-services-contract.md).
