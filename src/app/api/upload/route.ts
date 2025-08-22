// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ✅ Configure Cloudinary (make sure env vars are set in .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    console.log("📤 Upload request received");

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("❌ Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // ✅ Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size);
      return NextResponse.json(
        { error: "File is too large. Max size is 5MB." },
        { status: 400 }
      );
    }

    console.log("✅ File validation passed:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("📄 File converted to buffer:", buffer.length, "bytes");

    // ✅ Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    console.log("✅ Cloudinary upload successful:", uploadResult);

    // ✅ Construct consistent response format
    const response = {
      data: {
        secure_url: uploadResult.secure_url,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        original_filename: uploadResult.original_filename || file.name,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
        created_at: uploadResult.created_at,
      },
    };

    console.log("✅ Sending successful response:", response);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Upload error:", error);

    const errorResponse = {
      error: "Upload failed",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Handle non-POST methods
export async function GET() {
  return NextResponse.json(
    { message: "Upload endpoint - POST only" },
    { status: 405 }
  );
}
