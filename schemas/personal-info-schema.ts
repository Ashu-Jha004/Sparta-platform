// schemas/personal-info-schema.ts
import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  athleticName: z
    .string()
    .max(30, "Athletic name must be less than 30 characters")
    .optional()
    .or(z.literal("")),

  dateOfBirth: z.date().refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      return age - 1 >= 13;
    }
    return age >= 13;
  }, "You must be at least 13 years old to create an account"),

  gender: z
    .enum(["male", "female", "other", "prefer-not-to-say"])
    .describe("Please select your gender"),

  profilePhotoUrl: z.string().min(1, "Profile photo is required"),
  location: z.object({
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(50, "City name is too long"),
    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country name is too long"),
  }),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long"),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
