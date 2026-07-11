import { z } from "zod";

export const analyticsParamsSchema = z.object({
  id: z.string().cuid(),
});