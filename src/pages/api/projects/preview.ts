import { withAuth } from "@/db/middleware/auth";
import { PhotoSchema } from "@/db/schemas/photos";
import { Project } from "@/db/schemas/projects";
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
    name: string;
  };
};

type ErrorResponse = {
  error: string;
};

type ResponseData = SuccessResponse | ErrorResponse;

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const file: File | undefined = files.image?.[0];
    if (!file) {
      return res.status(400).json({ error: "No image file found" });
    }

    const projectId = fields.projectId?.[0] ?? fields.projectId;
    if (!projectId) {
      return res.status(400).json({ error: "Missing projectId" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // const maxSizeInBytes = 1 * 1024 * 1024;
    // if (file.size && file.size > maxSizeInBytes) {
    //   return res.status(400).json({
    //     error: "Image exceeds maximum size of 1MB",
    //   });
    // }

    try {
      const folder = `app/pixelkit/projects/${projectId}/preview`;
      const publicId = "preview";

      const payload: UploadApiOptions = {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      };

      const result = await cloudinary.uploader.upload(file.filepath, payload);

      const cacheBust = Date.now();
      const secureUrlWithCache = `${result.secure_url}?v=${cacheBust}`;

      const photo = await PhotoSchema.findOneAndUpdate(
        {
          projectId: project._id,
          folder,
          name: publicId,
          type: "PREVIEW",
        },
        {
          projectId: project._id,

          // Core
          name: publicId,
          url: secureUrlWithCache,
          secureUrl: result.secure_url,
          mimeType: file.mimetype ?? `image/${result.format}`,
          format: result.format,
          size: result.bytes,
          width: result.width,
          height: result.height,
          folder,

          createdBy: req.userId,
          type: "PREVIEW",

          // Cloudinary
          cloudinaryPublicId: result.public_id,
          cloudinaryAssetId: result.asset_id,
          cloudinaryResourceType: result.resource_type,
          cloudinaryVersion: result.version,
          cloudinarySignature: result.signature,
          cloudinaryOriginalFilename: result.original_filename,
          cloudinaryAccessMode: result.access_mode,
          cloudinaryEtag: result.etag,
          tags: result.tags ?? [],
          colors: result.colors,
          metadata: result.metadata,
          context: result.context,
        },
        {
          new: true,
          upsert: true,
        }
      );

      return res.status(200).json({
        message: "Preview image uploaded successfully",
        data: {
          url: photo.url,
          width: photo.width,
          height: photo.height,
          name: photo.name,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error uploading preview image",
      });
    }
  });
}

export default withAuth(handler);
