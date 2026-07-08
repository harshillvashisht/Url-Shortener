import { z } from "zod";

export const linkSchema = z.object({
    originalUrl: z.string().trim().url(),
});
