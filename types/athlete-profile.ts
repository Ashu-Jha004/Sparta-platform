// types/athlete-profile.ts
export interface AthleteProfile {
  // Personal Information
  fullName: string;
  athleticName?: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  profilePhotoUrl: string;
  location: {
    city: string;
    country: string;
  };
  email: string;

  // Sporting Identity
  primarySport: string;
  otherSports?: string[];
  bio?: string;

  // Social & Communication
  socialLinks?: { [platform: string]: string };
  website?: string;
  preferredCommunication: "email" | "app";

  // Goals & Preferences
  shortTermGoals?: string;
  longTermAspirations?: string;
  openToTeams: boolean;
  privacyConsent: boolean;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
}

export interface SocialPlatform {
  name: string;
  placeholder: string;
  icon: string;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
  },
  {
    id: 2,
    title: "Sporting Identity",
    description: "Your athletic background",
  },
  {
    id: 3,
    title: "Social & Communication",
    description: "How to connect with you",
  },
  {
    id: 4,
    title: "Goals & Preferences",
    description: "Your aspirations",
  },
  {
    id: 5,
    title: "Review & Submit",
    description: "Confirm your profile",
  },
];

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { name: "instagram", placeholder: "@username", icon: "instagram" },
  { name: "twitter", placeholder: "@username", icon: "twitter" },
  { name: "youtube", placeholder: "Channel URL", icon: "youtube" },
  { name: "tiktok", placeholder: "@username", icon: "tiktok" },
  { name: "twitch", placeholder: "Channel name", icon: "twitch" },
];

export const SPORTS_LIST = [
  "Tennis",
  "Basketball",
  "Football",
  "Soccer",
  "Baseball",
  "Volleyball",
  "Swimming",
  "Track & Field",
  "Gymnastics",
  "Boxing",
  "MMA",
  "Wrestling",
  "Golf",
  "Cricket",
  "Rugby",
  "Hockey",
  "Badminton",
  "Table Tennis",
];
