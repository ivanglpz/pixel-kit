import { withAuth } from "@/db/middleware/auth";
import { UserSchema } from "@/db/schemas/users";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { File, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type SuccessResponse = {
  message: string;
  data: {
    url: string;
    width: number;
    height: number;
  };
};

type ErrorResponse = {
  error: string;
};

type ResponseData = SuccessResponse | ErrorResponse;

type AuthenticatedRequest = NextApiRequest & { userId: string };

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const file: File | undefined = files.image?.[0];
    if (!file) {
      return res.status(400).json({ error: "No image file found" });
    }

    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size && file.size > maxSizeInBytes) {
      return res.status(400).json({
        error: "Image exceeds maximum size of 1MB",
      });
    }

    try {
      const folder = `app/pixelkit/users/${req.userId}/photo`;
      const publicId = "avatar";

      const payload: UploadApiOptions = {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      };

      const result = await cloudinary.uploader.upload(file.filepath, payload);

      const cacheBuster = Date.now();
      const photoUrl = `${result.secure_url}?v=${cacheBuster}`;

      const updatedUser = await UserSchema.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            photoUrl,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "Profile photo updated successfully",
        data: {
          url: photoUrl,
          width: result.width,
          height: result.height,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Error uploading profile image" });
    }
  });
}

export default withAuth(handler);
