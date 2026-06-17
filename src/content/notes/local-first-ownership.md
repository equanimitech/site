---
title: Local-First Ownership
summary: The user owns their data and computation. Not "we store it securely for you," the user possesses it.
date: 2026-06-17
status: budding
draft: true
tags: [sovereignty]
---

The foundation of the [Sovereignty layer](/notes/start-here). Ownership is not custody. The tool keeps working whether or not anyone is still running a server for it.

**The design test**

> Does this work offline? Would the user lose anything if our servers shut down tomorrow?

<details>
<summary>How it shows up in the work</summary>

The whole studio is built on this floor.

- **Zenborg** keeps its vault in IndexedDB and `~/.zenborg` JSON. Sync is optional, never required. If the servers vanished tomorrow, nothing breaks.
- **keel** writes attention logs to `~/.keel/log/` as append-only JSONL, and its browser extension keeps all state in local storage. No account, no server, no sync.
- **Secretariat** is filesystem-authoritative: every document, identity, and instruction is a markdown file on disk. No database-as-truth. Keys never leave the device.
- **Respost** rides on AT Protocol records: the postcard survives a Respost shutdown because the link is the postcard.

</details>

A budding note, grounded in the work but not yet a finished essay. See also [Modification Rights](/notes/modification-rights) and [Holistic Control](/notes/holistic-control).
