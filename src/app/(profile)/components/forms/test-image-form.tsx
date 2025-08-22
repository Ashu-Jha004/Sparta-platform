// test-image-form.tsx (CREATE THIS FILE TO TEST)
"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Simple schema for testing
const testSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profilePhoto: z.string().min(1, "Photo is required"),
});

type TestFormData = z.infer<typeof testSchema>;

// Simplified ImageUpload for testing
const SimpleImageUpload = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("🔄 File selected:", file.name);

      // Simulate upload
      const mockUrl = `https://example.com/${Date.now()}-${file.name}`;
      console.log("📸 Setting URL:", mockUrl);
      onChange(mockUrl);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      {value && (
        <div>
          <p className="text-green-600">✅ Selected: {value}</p>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-red-500 text-sm"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export const TestImageForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      profilePhoto: "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  const onSubmit = (data: TestFormData) => {
    console.log("✅ Form submitted:", data);
    alert("Form is valid and submitted!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test Image Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Image Upload Field with Controller */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo *
          </label>
          <Controller
            name="profilePhoto"
            control={control}
            render={({ field }) => (
              <SimpleImageUpload
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.profilePhoto && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profilePhoto.message}
            </p>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 p-3 rounded text-sm">
          <h3 className="font-medium">Debug Info:</h3>
          <div>Name: {watchedValues.name || "empty"}</div>
          <div>Photo: {watchedValues.profilePhoto || "empty"}</div>
          <div>Valid: {isValid ? "✅" : "❌"}</div>
          <div>Submitting: {isSubmitting ? "⏳" : "✅"}</div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            isValid && !isSubmitting
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
