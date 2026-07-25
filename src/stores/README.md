# `stores/` — global state

Module-level `createSignal` singletons, imported directly. No provider, no context.

This is the default for shared state and covers nearly everything — auth, connection
status, locale.

Use a **context** instead only when a value genuinely cannot be global because it belongs
to one subtree. That is the exception; reach for a store first.
