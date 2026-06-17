import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      // Garden maturity, and the attestation seam:
      //   seedling = rough seeded thinking; budding = drafted. Both are
      //   signature-only (an agent may have drafted them; informational).
      //   evergreen = stamped by the principal (signet / Touch ID): the human
      //   vouches for it. Only Rafa can mint evergreen; agents never stamp.
      // Build deferred: today `status` is an honest label. When the first note
      // is firm enough to stamp, render a verified seal from its signet
      // $signatures block (build-time `signet verify`). Until then, label only.
      status: z.enum(["evergreen", "budding", "seedling"]).default("budding"),
      hero: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { notes };
