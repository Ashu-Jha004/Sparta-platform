import { z } from "zod";

export const sportingIdentitySchema = z.object({
  primarySport: z.string().min(1, "Primary sport is required"),
  otherSports: z.array(z.string()).default([]).optional(), // ✅ always array
  bio: z.string().max(500, "Max 500 characters").optional(),
});

export type SportingIdentityData = z.infer<typeof sportingIdentitySchema>;
