// src/lib/validations/athlete-profile-schema.ts
import { z } from "zod";

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const socialUsernameRegex = /^[a-zA-Z0-9._-]+$/;

export const athleteProfileUpdateSchema = z.object({
  // Personal Information (all optional for updates)
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .optional(),

  athleticName: z
    .string()
    .max(30, "Athletic name must be less than 30 characters")
    .optional()
    .or(z.literal(""))
    .optional(),

  dateOfBirth: z
    .date()
    .refine((date) => {
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
    }, "You must be at least 13 years old")
    .optional(),

  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),

  profilePhotoUrl: z.string().min(1, "Profile photo is required").optional(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City name is too long"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country name is too long"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .optional(),

  // Sporting Identity
  primarySport: z.string().min(1, "Primary sport is required").optional(),

  otherSports: z.array(z.string()).default([]).optional(),

  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),

  // Social & Communication
  socialLinks: z
    .object({
      instagram: z
        .string()
        .optional()
        .refine(
          (val) => !val || socialUsernameRegex.test(val.replace("@", "")),
          {
            message: "Invalid Instagram username format",
          }
        ),

      twitter: z
        .string()
        .optional()
        .refine(
          (val) => !val || socialUsernameRegex.test(val.replace("@", "")),
          {
            message: "Invalid Twitter username format",
          }
        ),

      youtube: z
        .string()
        .optional()
        .refine((val) => !val || urlRegex.test(val), {
          message: "Please enter a valid YouTube URL",
        }),

      tiktok: z
        .string()
        .optional()
        .refine(
          (val) => !val || socialUsernameRegex.test(val.replace("@", "")),
          {
            message: "Invalid TikTok username format",
          }
        ),

      twitch: z
        .string()
        .optional()
        .refine((val) => !val || socialUsernameRegex.test(val), {
          message: "Invalid Twitch username format",
        }),
    })
    .optional(),

  website: z
    .string()
    .optional()
    .refine((val) => !val || urlRegex.test(val), {
      message: "Please enter a valid website URL",
    }),

  preferredCommunication: z.enum(["email", "app"]).optional(),

  // Goals & Preferences
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

  openToTeams: z.boolean().optional(),

  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy policy to continue",
    })
    .optional(),
});

export type AthleteProfileUpdateData = z.infer<
  typeof athleteProfileUpdateSchema
>;
