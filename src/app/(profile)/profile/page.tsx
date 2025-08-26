// src/app/profile/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileDisplay } from "../../../app/(profile)/components/ui/profile-display";

export default async function ProfilePage() {
  // ✅ FIXED: Use auth() instead of getAuth(req) for App Router pages

  const user = await currentUser();
  const userId = user?.id;
  // Redirect if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // Fetch the user's profile directly from database
    const profile = await prisma.athleteProfile.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    // If no profile exists, redirect to profile creation
    if (!profile) {
      redirect("/");
    }

    // Transform data for display
    const profileData = {
      ...profile,
      city: profile.city || "",
      country: profile.country || "",
    };

    return (
      <div className="min-h-screen ">
        <ProfileDisplay profile={profileData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    redirect("/create-profile");
  }
}
