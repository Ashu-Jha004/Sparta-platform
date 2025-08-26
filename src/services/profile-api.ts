// src/services/profile-api.ts
// Add better error handling for HTML responses

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    statusCode: number;
    details?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
  };
}

interface ProfileData {
  id: number;
  clerkUserId: string;
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

class ProfileAPIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ProfileAPIError";
  }
}

export class ProfileAPI {
  private static readonly BASE_URL = "/api/profile";

  /**
   * Enhanced response handler that detects HTML responses
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    // Check content type before parsing
    const contentType = response.headers.get("content-type");
    console.log(
      `📡 API Response - Status: ${response.status}, Content-Type: ${contentType}`
    );

    // If response is not JSON, get text content for debugging
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error(
        `❌ Non-JSON response received:`,
        errorText.substring(0, 500)
      );

      throw new ProfileAPIError(
        response.status,
        "NON_JSON_RESPONSE",
        `Server returned ${
          contentType || "unknown content type"
        } instead of JSON. This usually indicates an authentication redirect or server error.`
      );
    }

    // Parse JSON response
    let result: ApiResponse<T>;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error(`❌ JSON parse error:`, parseError);
      throw new ProfileAPIError(
        response.status,
        "JSON_PARSE_ERROR",
        "Server returned invalid JSON response"
      );
    }

    // Handle non-OK responses
    if (!response.ok) {
      throw new ProfileAPIError(
        response.status,
        result.error?.code || "UNKNOWN_ERROR",
        result.error?.message || "API request failed",
        result.error?.details
      );
    }

    // Validate success response structure
    if (!result.success || !result.data) {
      throw new ProfileAPIError(
        500,
        "INVALID_RESPONSE",
        "Invalid response format from server"
      );
    }

    return result.data;
  }

  /**
   * Get the current user's profile
   */
  static async getProfile(): Promise<ProfileData> {
    try {
      console.log(`🔍 Fetching profile from: ${this.BASE_URL}/me`);

      const response = await fetch(`${this.BASE_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // ✅ Explicitly request JSON
        },
        cache: "no-cache",
      });

      return await this.handleResponse<ProfileData>(response);
    } catch (error) {
      if (error instanceof ProfileAPIError) {
        throw error;
      }

      // Handle fetch errors (network, etc.)
      console.error(`❌ Network error in getProfile:`, error);
      throw new ProfileAPIError(
        500,
        "NETWORK_ERROR",
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  /**
   * Create or update the current user's profile
   */
  static async upsertProfile(
    profileData: Partial<ProfileData>
  ): Promise<ProfileData> {
    try {
      console.log(`📤 Updating profile at: ${this.BASE_URL}/me`);
      console.log(`📋 Payload:`, JSON.stringify(profileData, null, 2));

      const response = await fetch(`${this.BASE_URL}/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // ✅ Explicitly request JSON
        },
        body: JSON.stringify(profileData),
        cache: "no-cache",
      });

      return await this.handleResponse<ProfileData>(response);
    } catch (error) {
      if (error instanceof ProfileAPIError) {
        throw error;
      }

      // Handle fetch errors (network, etc.)
      console.error(`❌ Network error in upsertProfile:`, error);
      throw new ProfileAPIError(
        500,
        "NETWORK_ERROR",
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  /**
   * Helper method to check if error is a validation error
   */
  static isValidationError(error: ProfileAPIError): boolean {
    return error.code === "VALIDATION_ERROR";
  }

  /**
   * Helper method to check if error is an authentication error
   */
  static isAuthError(error: ProfileAPIError): boolean {
    return error.code === "UNAUTHORIZED" || error.code === "AUTH_ERROR";
  }

  /**
   * Helper method to check if error is a network/server error
   */
  static isServerError(error: ProfileAPIError): boolean {
    return error.statusCode >= 500 || error.code === "NETWORK_ERROR";
  }
}

// Export the error class for type checking
export { ProfileAPIError };
