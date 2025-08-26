// src/components/profile-display.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Calendar,
  Mail,
  MapPin,
  Trophy,
  Users,
  Globe,
  Edit,
  User,
  Target,
  Zap,
  Rocket,
  Award,
  Star,
  ExternalLink,
  MessageCircle,
  BarChart3,
  Quote,
} from "lucide-react";
import { format } from "date-fns";

interface ProfileData {
  id: number;
  fullName: string;
  athleticName?: string;
  dateOfBirth: Date;
  gender: string;
  profilePhotoUrl: string;
  city: string;
  country: string;
  email: string;
  primarySport: string;
  otherSports: string[];
  bio?: string;
  socialLinks?: Record<string, string>;
  website?: string;
  preferredCommunication: string;
  shortTermGoals?: string;
  longTermAspirations?: string;
  openToTeams: boolean;
  privacyConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileDisplayProps {
  profile: ProfileData;
}

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "MMMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const calculateAge = (dateOfBirth: Date) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Modern Header */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
          </div>

          {/* Header Content */}
          <div className="relative z-10 px-8 md:px-12 py-12">
            {/* Status Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs font-medium tracking-wide uppercase">
                    Active Athlete
                  </span>
                </div>

                {profile.openToTeams && (
                  <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2">
                    <Users className="w-3 h-3 text-emerald-300" />
                    <span className="text-emerald-200 text-xs font-medium">
                      Available for Teams
                    </span>
                  </div>
                )}
              </div>

              <button
                title="Edit"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-3 transition-colors duration-200"
              >
                <Edit className="w-5 h-5 text-white/90 transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Main Profile Section */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white/20 shadow-2xl">
                    <Image
                      src={profile.profilePhotoUrl || "/default-avatar.png"}
                      alt={profile.fullName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Achievement Badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>

                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="space-y-6">
                  {/* Name & Athletic Name */}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {profile.fullName}
                    </h1>
                    {profile.athleticName && (
                      <p className="text-xl text-blue-200 italic mt-2 font-light">
                        {profile.athleticName}
                      </p>
                    )}
                  </div>

                  {/* Stats Pills */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2.5 hover:bg-white/20 transition-colors">
                      <Calendar className="w-4 h-4 text-blue-300" />
                      <span className="text-white/90 font-medium">
                        {calculateAge(profile.dateOfBirth)} years
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2.5 hover:bg-white/20 transition-colors">
                      <MapPin className="w-4 h-4 text-emerald-300" />
                      <span className="text-white/90 font-medium">
                        {profile.city}, {profile.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2.5 hover:bg-white/20 transition-colors">
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span className="text-white/90 font-medium">
                        {profile.primarySport}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank & Class Section */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center justify-center gap-16">
                {/* Class */}
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-3">
                    Class
                  </p>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl hover:scale-105 transition-transform duration-200">
                    S
                  </div>
                </div>

                {/* Divider */}
                <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                {/* Rank */}
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-3">
                    Rank
                  </p>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-6 py-3 shadow-2xl hover:scale-105 transition-transform duration-200">
                    <Star className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-xl">King</span>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Content Sections */}
          <div className="xl:col-span-3 space-y-6">
            {/* About Section */}
            {profile.bio && (
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">About</h2>
                  <Quote className="w-5 h-5 text-gray-400 ml-auto" />
                </div>

                <div className="relative">
                  <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <p className="text-gray-700 leading-relaxed text-lg pl-6 font-light">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Sports Section */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sports & Expertise
                </h2>
              </div>

              {/* Primary Sport Highlight */}
              <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 hover:border-amber-300/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-600 tracking-wide uppercase mb-1 flex items-center gap-2">
                        <Star className="w-3 h-3" />
                        Primary Sport
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {profile.primarySport}
                      </h3>
                    </div>
                  </div>

                  <div className="text-4xl">🏆</div>
                </div>
              </div>

              {/* Other Sports */}
              {profile.otherSports.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Other Sports
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {profile.otherSports.map((sport, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Goals Section */}
            {(profile.shortTermGoals || profile.longTermAspirations) && (
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Goals & Aspirations
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Short-term Goals */}
                  {profile.shortTermGoals && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 mt-1">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Short-term Goals
                          <span className="text-yellow-500">⚡</span>
                        </h3>
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-l-4 border-yellow-400 hover:border-yellow-500 transition-colors duration-200">
                          <p className="text-gray-700 leading-relaxed">
                            {profile.shortTermGoals}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Long-term Aspirations */}
                  {profile.longTermAspirations && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 mt-1">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Long-term Aspirations
                          <span className="text-purple-500">🚀</span>
                        </h3>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-400 hover:border-purple-500 transition-colors duration-200">
                          <p className="text-gray-700 leading-relaxed">
                            {profile.longTermAspirations}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Profile Statistics
                </h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Age
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {calculateAge(profile.dateOfBirth)} years
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {profile.city}, {profile.country}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Contact
                      </p>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {profile.preferredCommunication}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Member since:</span>
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last updated:</span>
                  <span>{formatDate(profile.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Gender:</span>
                  <span className="capitalize">
                    {profile.gender.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Contact Info
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-sm truncate">
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Prefers:
                    </span>
                    <span className="text-gray-700 text-sm capitalize">
                      {profile.preferredCommunication}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {profile.socialLinks &&
              Object.keys(profile.socialLinks).length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Social Links
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(profile.socialLinks).map(
                      ([platform, handle]) =>
                        handle && (
                          <div
                            key={platform}
                            className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors cursor-pointer"
                          >
                            <Globe className="w-4 h-4 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-gray-500 capitalize block">
                                {platform}
                              </span>
                              <span className="text-gray-700 text-sm truncate block">
                                {handle}
                              </span>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

            {/* Website */}
            {profile.website && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Website</h3>
                </div>

                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50/80 rounded-xl hover:bg-blue-50/80 transition-colors text-blue-600 hover:text-blue-800"
                >
                  <span className="text-sm truncate flex-1">
                    {profile.website}
                  </span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Team Availability */}
            {profile.openToTeams && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="font-bold text-emerald-800">
                    Available for Teams
                  </h3>
                </div>
                <p className="text-emerald-600 text-sm">
                  This athlete is currently open to joining new teams and
                  collaborations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
