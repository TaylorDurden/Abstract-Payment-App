import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const accountSchema = z.object({
  id: z.string(),
  address: z.string(),
  owner: z.string().optional(),
  info: z.object({
    name: z.string().nullable(),
    chainId: z.string(),
    description: z.string().nullable(),
    link: z.string().nullable(),
  }),
  balances: z.array(
    z.object({
      amount: z.string(),
      denom: z.string(),
    })
  ),
});

export type Task = z.infer<typeof accountSchema>;
