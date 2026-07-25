# `services/` — business logic and error normalisation

Where an API call becomes a domain operation: sequencing several calls, normalising errors
into something a component can act on, owning connection lifecycle.

**Not a mandatory hop.** A plain read goes hook → `api/`. Enter this layer when there is
logic to own; routing every call through it "for consistency" just adds a pass-through
file.

**Belongs here:** connection/session lifecycle (the readiness gate hooks check), auth
flows, error normalisation.

**Does not belong:** JSX, component imports, route knowledge.
