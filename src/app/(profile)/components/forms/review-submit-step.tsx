// components/forms/review-submit-step.tsx
import React from "react";
import { CheckCircle, ArrowLeft, ArrowRight, User } from "lucide-react";

export const ReviewSubmitStep = ({ onBack, onSubmit, formData }) => (
  <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-slate-900 via-black to-slate-900 rounded-2xl shadow-2xl border border-gray-700 text-white relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none opacity-30 z-0"
      style={{
        background:
          "radial-gradient(ellipse at bottom right, #f87171 0%, transparent 70%)",
      }}
    />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="w-8 h-8 text-green-400" />
        <h2 className="text-3xl font-extrabold tracking-tight">
          Review & Submit
        </h2>
      </div>

      {/* Profile Photo Preview */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {formData.profilePhotoUrl ? (
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg">
              <img
                src={formData.profilePhotoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' fill='%23e5e7eb'%3E%3Crect width='128' height='128' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.35em' fill='%23d1d5db'%3EProfile Photo%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800/50">
              <div className="text-center">
                <User className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No Photo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 bg-black/40 p-6 mb-8 text-base leading-relaxed shadow-inner">
        <table className="w-full table-auto">
          <tbody>
            <tr>
              <td className="pr-4 py-3 font-medium text-gray-300">
                Full Name:
              </td>
              <td className="py-3 font-semibold">{formData.fullName}</td>
            </tr>
            <tr>
              <td className="pr-4 py-3 font-medium text-gray-300">
                Athletic Name:
              </td>
              <td className="py-3">
                {formData.athleticName || (
                  <span className="text-gray-500 italic">Not specified</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="pr-4 py-3 font-medium text-gray-300">Gender:</td>
              <td className="py-3 capitalize">{formData.gender}</td>
            </tr>
            <tr>
              <td className="pr-4 py-3 font-medium text-gray-300">
                Date of Birth:
              </td>
              <td className="py-3">
                {formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toLocaleDateString()
                  : ""}
              </td>
            </tr>
            <tr>
              <td className="pr-4 py-3 font-medium text-gray-300">Location:</td>
              <td className="py-3">
                {formData.location?.city}, {formData.location?.country}
              </td>
            </tr>
            <tr>
              <td className="pr-4 py-3 font-medium text-gray-300">Email:</td>
              <td className="py-3">{formData.email}</td>
            </tr>
            {/* Add sport info if available */}
            {formData.primarySport && (
              <tr>
                <td className="pr-4 py-3 font-medium text-gray-300">
                  Primary Sport:
                </td>
                <td className="py-3">{formData.primarySport}</td>
              </tr>
            )}
            {formData.experience && (
              <tr>
                <td className="pr-4 py-3 font-medium text-gray-300">
                  Experience:
                </td>
                <td className="py-3 capitalize">{formData.experience}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between gap-4 pt-4 border-t border-gray-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white transition-all duration-200 shadow"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={onSubmit}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 text-white transition-all duration-200 shadow"
        >
          Submit Profile <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);
