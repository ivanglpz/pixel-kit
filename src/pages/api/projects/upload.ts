import { withAuth } from "@/db/middleware/auth";
import { PhotoSchema } from "@/db/schemas/photos";
import { Project } from "@/db/schemas/projects";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

// ⛔️ Desactiva bodyParser de Next.js
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

type ResponseData = { message: string; data?: any | null } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const file = files.image?.[0];

      if (!file) {
        return res.status(400).json({ error: "No image file found" });
      }

      const projectId = fields.projectId?.[0] || fields.projectId;
      if (!projectId) {
        return res.status(400).json({ error: "Missing projectId" });
      }

      // Validar que el proyecto existe
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      if (file.size && file.size > maxSizeInBytes) {
        return res.status(400).json({
          error: "Image exceeds maximum size of 1MB",
        });
      }
      try {
        // Subida a Cloudinary
        const payload: UploadApiOptions = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          folder: `app/pixelkit/projects/${projectId}/photos`,
          resource_type: "image",
        };
        const result = await cloudinary.uploader.upload(file.filepath, payload);

        // Crear documento en MongoDB
        const newPhoto = await PhotoSchema.create({
          projectId: project._id,
          url: result.secure_url,
          mimeType: file.mimetype || "image/jpeg",
          size: file.size || 0,
          folder: payload.folder,
          createdBy: req.userId,
          width: result.width,
          height: result.height,
          name: file.originalFilename,
        });

        return res.status(201).json({
          message: "Image uploaded successfully",
          data: {
            url: newPhoto.url,
            width: newPhoto.width,
            height: newPhoto.height,
            name: newPhoto.name,
          },
        });
      } catch (uploadError) {
        console.error(uploadError);
        return res
          .status(500)
          .json({ error: "Error uploading image to Cloudinary" });
      }
    });
  } catch (error) {
    console.error("Error in photo upload handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
