import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      // Garden maturity. seedling = stub seeded from existing text, room to grow;
      // budding = drafted; evergreen = tended and load-bearing.
      status: z.enum(["evergreen", "budding", "seedling"]).default("budding"),
      hero: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { notes };
