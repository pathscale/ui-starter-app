# `hooks/` — what components consume

One hook per endpoint or interaction, wrapping `@tanstack/solid-query` and returning
reactive state. Components call these; they never touch `api/` directly.

Four conventions, all load-bearing:

- Types come from `models/` — never hand-declared beside the hook.
- Query keys come from `constants/` — never inlined.
- Gate `enabled` on connection readiness; the socket is not up on first paint.
- Unwrap the response defensively — the payload may arrive nested under `params`.

Group subdirectories by domain or by service. Either is fine; match what's already here.
