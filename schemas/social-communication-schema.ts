// schemas/social-communication-schema.ts
import { z } from "zod";

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const socialUsernameRegex = /^[a-zA-Z0-9._-]+$/;

export const socialCommunicationSchema = z.object({
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

  preferredCommunication: z
    .enum(["email", "app"])
    .refine((val) => val !== undefined, {
      message: "Please select your preferred communication method",
    }),
});

export type SocialCommunicationData = z.infer<typeof socialCommunicationSchema>;
