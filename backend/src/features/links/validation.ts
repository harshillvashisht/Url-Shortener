import { z } from "zod";

export const linkSchema = z.object({
    originalUrl: z.string().trim().url(),
});

export const shortCodeSchema = z.object({
    shortCode: z.string().trim().min(1),
});
