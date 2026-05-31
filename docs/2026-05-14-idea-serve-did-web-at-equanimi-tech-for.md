---
migrated_from: equanimi.tech/project/site/dev/20260514T105942Z-vfk2dr.md
---
## Idea: serve did:web at equanimi.tech for org verification

Secretariat's `equanimi.tech` org is registered as `did:web:equanimi.tech`. For that DID to be resolvable (and for the org to be cryptographically verifiable by peers), the site needs to serve a DID document at:

  https://equanimi.tech/.well-known/did.json

This would let any peer resolve the org's identity, public keys, and service endpoints without trusting a central directory. Pure local-first identity infrastructure, aligned with the lab's Sovereignty principles.

What we'd need:
- DID document at `public/.well-known/did.json` in the site repo
- Public key(s) for the org's signing identity (lives in secretariat's key store)
- Service endpoint(s) if we want to advertise inbox / channels publicly later

Filed as a future enhancement. Not blocking the landing page launch.
