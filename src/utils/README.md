# `utils/` — small stateless helpers

One concern per file: formatting, parsing, coercion.

If it grows a subdirectory and internal state, it belongs in `lib/` instead. That is the
whole distinction.

**Does not belong:** anything importing from `features/`, and anything that talks to the
network.
