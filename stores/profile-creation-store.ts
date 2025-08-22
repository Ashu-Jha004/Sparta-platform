// stores/profile-creation-store.ts (FIXED VERSION)
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AthleteProfile } from "../types/athlete-profile";

interface ProfileCreationState {
  // Form state
  currentStep: number;
  completedSteps: number[];
  formData: Partial<AthleteProfile>;
  isDirty: boolean;
  isSubmitting: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updateFormData: (data: Partial<AthleteProfile>) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;

  // FIX: Removed all validation logic - React Hook Form handles this now
}

export const useProfileCreationStore = create<ProfileCreationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      completedSteps: [],
      formData: {},
      isDirty: false,
      isSubmitting: false,

      // Step navigation
      setCurrentStep: (step) => {
        console.log("📍 Setting current step to:", step);
        set({ currentStep: step });
      },

      markStepCompleted: (step) => {
        console.log("✅ Marking step completed:", step);
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        }));
      },
      isStepValid: (step) => {
        const { formData } = get();

        switch (step) {
          case 0: // Personal Information
            return !!(
              formData.fullName &&
              formData.dateOfBirth &&
              formData.gender &&
              formData.location?.city &&
              formData.location?.country &&
              formData.email &&
              formData.profilePhotoUrl
            );

          case 1: // Sporting Identity
            return !!formData.primarySport;

          case 2: // Social & Communication
            return !!formData.preferredCommunication;

          case 3: // Goals & Preferences
            return (
              formData.openToTeams !== undefined &&
              formData.privacyConsent === true
            );

          default:
            return false;
        }
      },

      nextStep: () => {
        const { currentStep, markStepCompleted } = get();
        console.log("⏭️ Moving to next step from:", currentStep);

        if (currentStep < 4) {
          // 0-indexed, max step is 4
          markStepCompleted(currentStep);
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        console.log("⏮️ Moving to previous step");
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        }));
      },

      // Form data management - SIMPLIFIED
      updateFormData: (data) => {
        console.log("💾 Updating form data:", data);
        set((state) => ({
          formData: { ...state.formData, ...data },
          isDirty: true,
        }));
      },

      resetForm: () => {
        console.log("🔄 Resetting form");
        set({
          currentStep: 0,
          completedSteps: [],
          formData: {},
          isDirty: false,
          isSubmitting: false,
        });
      },

      setSubmitting: (submitting) => {
        console.log("⏳ Setting submitting:", submitting);
        set({ isSubmitting: submitting });
      },

      // FIX: All validation logic removed - handled by React Hook Form
    }),
    {
      name: "sparta-profile-creation",
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
);
