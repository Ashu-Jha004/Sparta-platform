import { z } from "zod";

export const goalsPreferencesSchema = z.object({
  shortTermGoals: z
    .string()
    .max(300, "Short-term goals must be less than 300 characters")
    .optional()
    .or(z.literal("")),

  longTermAspirations: z
    .string()
    .max(500, "Long-term aspirations must be less than 500 characters")
    .optional()
    .or(z.literal("")),

  openToTeams: z.boolean().refine((val) => val !== undefined, {
    message: "Please specify if you are open to joining teams",
  }),

  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy to continue",
  }),
});

export type GoalsPreferencesData = z.infer<typeof goalsPreferencesSchema>;
