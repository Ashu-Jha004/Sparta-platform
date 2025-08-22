// components/ui/image-upload.tsx (FINAL WORKING VERSION)
"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import Uploady, {
  useItemFinishListener,
  useItemErrorListener,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  maxSize?: number;
  accept?: string;
}

// Handler component that processes upload events
const UploadHandler: React.FC<{
  onChange: (url: string) => void;
  onError?: (error: string) => void;
}> = ({ onChange, onError }) => {
  // Fix the response parsing in UploadHandler component:
  useItemFinishListener((item) => {
    console.log("🎉 Upload finished with item:", item);

    if (item.uploadStatus === "success" || item.uploadStatus === 200) {
      console.log("✅ Upload successful, processing response...");

      let imageUrl = null;

      if (item.uploadResponse) {
        const response = item.uploadResponse;
        console.log("📦 Upload response:", response);

        // FIX: Handle Uploady's wrapped response structure
        let actualData = response;

        // If response has a 'data' field, use that
        if (response.data) {
          actualData = response.data;
          console.log("📄 Using response.data:", actualData);
        }

        // Now check for the URL in the actual data
        if (actualData.data?.secure_url) {
          imageUrl = actualData.data.secure_url;
        } else if (actualData.data?.url) {
          imageUrl = actualData.data.url;
        } else if (actualData.secure_url) {
          imageUrl = actualData.secure_url;
        } else if (actualData.url) {
          imageUrl = actualData.url;
        }

        if (imageUrl) {
          console.log("📸 Found image URL:", imageUrl);
          onChange(imageUrl);
        } else {
          console.error(
            "❌ No valid URL found. Full response structure:",
            response
          );
          console.error("❌ Actual data structure:", actualData);
          onError?.("No image URL received from server");
        }
      } else {
        console.error("❌ No upload response received");
        onError?.("No response from server");
      }
    } else {
      console.error("❌ Upload failed with status:", item.uploadStatus);
      onError?.(`Upload failed with status: ${item.uploadStatus}`);
    }
  });

  useItemErrorListener((item) => {
    console.error("❌ Upload error:", item);
    onError?.("Upload error occurred");
  });

  return null;
};

// Custom response formatter for Uploady
const formatServerResponse = (response: any, status: number, headers: any) => {
  console.log("🔧 Formatting server response:", { response, status, headers });

  try {
    // If response is already an object, use it directly
    if (typeof response === "object") {
      return response;
    }

    // If response is a string, try to parse as JSON
    if (typeof response === "string") {
      return JSON.parse(response);
    }

    return response;
  } catch (error) {
    console.error("❌ Error formatting response:", error);
    return response;
  }
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  className = "",
  maxSize = 5,
  accept = "image/*",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleError = useCallback(
    (error: string) => {
      console.error("📛 Upload error:", error);
      setUploadError(error);
      setIsUploading(false);
      onError?.(error);
    },
    [onError]
  );

  const handleSuccess = useCallback(
    (url: string) => {
      console.log("🎉 Upload success:", url);
      setUploadError("");
      setIsUploading(false);
      onChange(url);
    },
    [onChange]
  );

  const clearImage = () => {
    console.log("🗑️ Clearing image");
    onChange("");
    setUploadError("");
  };

  // Show uploaded image
  // components/ui/image-upload.tsx - Update the image display section:

  // Replace this part in your ImageUpload component:
  if (value && value.length > 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 mx-auto">
          <img
            src={value}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("❌ Image failed to load:", value);
              // Instead of clearing the value, show a placeholder
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' fill='%23e5e7eb'%3E%3Crect width='128' height='128' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dy='.35em' fill='%236b7280'%3EImage Uploaded%3C/text%3E%3C/svg%3E";
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 
                   text-white rounded-full flex items-center justify-center 
                   transition-colors duration-200 shadow-lg z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success message for uploaded image */}
        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">
            ✅ Image uploaded successfully!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            Click × to change photo
          </p>
        </div>
      </div>
    );
  }

  return (
    <Uploady
      destination={{ url: "/api/upload" }}
      multiple={false}
      accept={accept}
      maxFileSize={maxSize * 1024 * 1024}
      formatServerResponse={formatServerResponse} // Key fix!
      forceJsonResponse={true} // Force JSON parsing
    >
      <UploadHandler onChange={handleSuccess} onError={handleError} />

      <div className={className}>
        <UploadButton
          extraProps={{
            accept,
            disabled: isUploading,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("🔄 File selected:", file.name);
                setIsUploading(true);
                setUploadError("");

                if (file.size > maxSize * 1024 * 1024) {
                  const errorMsg = `File is too large. Max size is ${maxSize}MB.`;
                  handleError(errorMsg);
                  e.target.value = "";
                  return;
                }
              }
            },
          }}
        >
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center 
                   transition-all duration-200 cursor-pointer hover:border-red-400 
                   ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                   ${
                     isDragOver
                       ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                       : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                   }`}
            onDragEnter={() => !isUploading && setIsDragOver(true)}
            onDragLeave={() => !isUploading && setIsDragOver(false)}
            onDrop={() => !isUploading && setIsDragOver(false)}
          >
            <div className="flex flex-col items-center justify-center">
              {isUploading ? (
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
              ) : isDragOver ? (
                <Upload className="w-12 h-12 text-red-400 mb-4" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isUploading ? "Uploading..." : "Upload Profile Photo"}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {isUploading
                  ? "Please wait while your image uploads..."
                  : "Drag and drop your photo here, or click to browse"}
              </p>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-4 h-4 mr-1" />
                Max {maxSize}MB • JPG, PNG, GIF
              </div>
            </div>
          </div>
        </UploadButton>

        {uploadError && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
              ❌ {uploadError}
            </p>
          </div>
        )}
      </div>
    </Uploady>
  );
};

export default ImageUpload;
