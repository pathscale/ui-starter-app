# `constants/` — fixed values, no logic

Notably `queryKeys.ts`: every query key in one module, never inlined at the call site.
Invalidation only works if keys are built the same way everywhere.

**Does not belong:** anything computed, anything reading configuration. Those are `config/`
or `utils/`.
