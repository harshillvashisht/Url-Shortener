import { z } from "zod";

export const linkSchema = z.object({
    originalUrl: z.string().trim().url(),
});

export const shortCodeSchema = z.object({
    shortCode: z.string().trim().min(1),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1, { message: "Page must be a positive integer" }).default(1),
    limit: z.coerce.number().int().max(100, { message: "Limit must be a positive integer not greater than 100" }).default(10),
});

export const idSchema = z.object({
    id: z.string().cuid().trim()
});