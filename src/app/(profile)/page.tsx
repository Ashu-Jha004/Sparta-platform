// app/profile/create/page.tsx
"use client";

import React, { useState } from "react";
import { AthleteProfileWizard } from "../(profile)/components/athlete-profile-wizard";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
export default function CreateProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const handleProfileComplete = (data: any) => {
    console.log("Profile creation completed:", data);
    setProfileData(data);
    setShowSuccess(true);

    // Redirect to dashboard after a delay
    setTimeout(() => {
      router.push("/profile");
    }, 3000);
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (showSuccess) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 
                    flex items-center justify-center px-4"
      >
        <div className="max-w-md mx-auto text-center">
          {/* Success Animation */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Sparta, {user?.firstName}! 🏆
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Your athlete profile has been created successfully. You&apos;re now ready
            to connect with other athletes and start competing!
          </p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">What&apos;s Next?</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Explore athletes in your area</li>
              <li>• Join teams and communities</li>
              <li>• Challenge other athletes</li>
              <li>• Track your progress</li>
            </ul>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AthleteProfileWizard
      onComplete={handleProfileComplete}
      onCancel={handleCancel}
    />
  );
}
