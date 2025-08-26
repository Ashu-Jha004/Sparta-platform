// src/app/api/profiles/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { athleteProfileUpdateSchema } from "@/lib/validation/athlete-profile";
// Error response helper
interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
}

function createErrorResponse(
  message: string,
  code: string,
  statusCode: number
): ApiError {
  return {
    success: false,
    error: {
      message,
      code,
      statusCode,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    // Extract auth from Clerk
    const { userId } = getAuth(req);

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        createErrorResponse("Authentication required", "UNAUTHORIZED", 401),
        { status: 401 }
      );
    }

    // Validate userId format (Clerk user IDs are typically strings)
    if (typeof userId !== "string" || userId.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse("Invalid user ID format", "INVALID_USER_ID", 400),
        { status: 400 }
      );
    }

    // Database operation with timeout and error handling
    const profile = await Promise.race([
      prisma.athleteProfile.findUnique({
        where: {
          clerkUserId: userId,
        },
      }),
      // 10-second timeout for database operations
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 10000)
      ),
    ]);

    // Profile not found
    if (!profile) {
      return NextResponse.json(
        createErrorResponse("Profile not found", "PROFILE_NOT_FOUND", 404),
        { status: 404 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error("API Error in /api/profile:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    });

    // Handle specific error types
    if (error instanceof Error) {
      // Database timeout
      if (error.message === "Database timeout") {
        return NextResponse.json(
          createErrorResponse(
            "Database operation timed out",
            "DATABASE_TIMEOUT",
            504
          ),
          { status: 504 }
        );
      }

      // Prisma-specific errors
      if (
        error.message.includes("PrismaClient") ||
        error.message.includes("P")
      ) {
        return NextResponse.json(
          createErrorResponse(
            "Database service unavailable",
            "DATABASE_ERROR",
            503
          ),
          { status: 503 }
        );
      }

      // Clerk auth errors
      if (error.message.includes("clerk") || error.message.includes("auth")) {
        return NextResponse.json(
          createErrorResponse(
            "Authentication service error",
            "AUTH_ERROR",
            401
          ),
          { status: 401 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      createErrorResponse("Internal server error", "INTERNAL_ERROR", 500),
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Extract auth from Clerk
    const { userId } = getAuth(req);

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        createErrorResponse("Authentication required", "UNAUTHORIZED", 401),
        { status: 401 }
      );
    }

    // Validate userId format
    if (typeof userId !== "string" || userId.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse("Invalid user ID format", "INVALID_USER_ID", 400),
        { status: 400 }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        createErrorResponse(
          "Invalid JSON in request body",
          "INVALID_JSON",
          400
        ),
        { status: 400 }
      );
    }

    // Handle date conversion for dateOfBirth
    if (requestBody.dateOfBirth) {
      try {
        requestBody.dateOfBirth = new Date(requestBody.dateOfBirth);
      } catch (dateError) {
        return NextResponse.json(
          createErrorResponse(
            "Invalid date format for dateOfBirth",
            "INVALID_DATE",
            400
          ),
          { status: 400 }
        );
      }
    }

    // Validate request body with Zod
    const validationResult = athleteProfileUpdateSchema.safeParse(requestBody);

    if (!validationResult.success) {
      const validationErrors = validationResult.error.cause;

      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            statusCode: 400,
            details: validationErrors,
          },
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Prepare data for database - handle nested  object
    const updateData: any = { ...validatedData };

    // Handle  transformation properly
    if (validatedData.city && validatedData.country) {
      updateData.city = validatedData.city;
      updateData.country = validatedData.country;
    }

    // Database operation with timeout - UPSERT
    const profile = await Promise.race([
      prisma.athleteProfile.upsert({
        where: {
          clerkUserId: userId,
        },
        update: {
          ...updateData,
          updatedAt: new Date(),
        },
        create: {
          clerkUserId: userId,
          ...updateData,
          // FIXED: Ensure all required fields have proper defaults
          fullName: validatedData.fullName || "",
          email: validatedData.email || "",
          gender: validatedData.gender || "prefer_not_to_say",
          dateOfBirth: validatedData.dateOfBirth || new Date(),
          profilePhotoUrl: validatedData.profilePhotoUrl || "",
          city: validatedData.city || "", // ✅ Fixed
          country: validatedData.country || "", // ✅ Fixed
          primarySport: validatedData.primarySport || "",
          preferredCommunication:
            validatedData.preferredCommunication || "email",
          openToTeams: validatedData.openToTeams ?? false,
          privacyConsent: validatedData.privacyConsent ?? false,
          otherSports: validatedData.otherSports || [],
          // Add any other optional fields with defaults
          athleticName: validatedData.athleticName || null,
          bio: validatedData.bio || null,
          socialLinks: validatedData.socialLinks || null,
          website: validatedData.website || null,
          shortTermGoals: validatedData.shortTermGoals || null,
          longTermAspirations: validatedData.longTermAspirations || null,
        },
      }),
      // 15-second timeout for upsert operations
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 15000)
      ),
    ]);

    // Transform response data back to frontend format
    const responseData = {
      ...profile,
      city: profile?.city,
      country: profile?.country,
    };

    // Success response with full updated profile
    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    // Log error for debugging
    console.error("API Error in PATCH /api/profiles/me:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    });

    // Handle specific error types
    if (error instanceof Error) {
      // Database timeout
      if (error.message === "Database timeout") {
        return NextResponse.json(
          createErrorResponse(
            "Database operation timed out",
            "DATABASE_TIMEOUT",
            504
          ),
          { status: 504 }
        );
      }

      // Prisma-specific errors
      if (
        error.message.includes("PrismaClient") ||
        error.message.includes("P")
      ) {
        return NextResponse.json(
          createErrorResponse(
            "Database service unavailable",
            "DATABASE_ERROR",
            503
          ),
          { status: 503 }
        );
      }

      // Unique constraint violations (duplicate data)
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          createErrorResponse(
            "Profile data conflicts with existing records",
            "DUPLICATE_DATA",
            409
          ),
          { status: 409 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      createErrorResponse("Internal server error", "INTERNAL_ERROR", 500),
      { status: 500 }
    );
  }
}
