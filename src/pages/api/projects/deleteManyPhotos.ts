import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { PhotoSchema } from "@/db/schemas/photos";
import { Project } from "@/db/schemas/projects";
import { v2 as cloudinary } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export type DeletePhotosBody = {
  projectId: string;
  photoIds: string[];
};

type ResponseData =
  | { message: string; deletedCount: number }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { projectId, photoIds } = req.body as DeletePhotosBody;

  if (!projectId || !Array.isArray(photoIds) || photoIds.length === 0) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const org = await Organization.findById(project.organization);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const authorized = org.members.some(
      (m: IOrganizationMember) =>
        m.user.toString() === req.userId &&
        (m.role === "owner" || m.role === "admin")
    );

    if (!authorized) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const photos = await PhotoSchema.find(
      {
        _id: { $in: photoIds },
        projectId,
      },
      {
        cloudinaryPublicId: 1,
      }
    );

    if (photos.length === 0) {
      return res.status(404).json({ error: "No photos found" });
    }

    const publicIds = photos.map((p) => p.cloudinaryPublicId).filter(Boolean);

    if (publicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(publicIds, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary delete failed:", cloudinaryError);
      }
    }

    const deleteResult = await PhotoSchema.deleteMany({
      _id: { $in: photoIds },
      projectId,
    });

    return res.status(200).json({
      message: "Photos deleted successfully",
      deletedCount: deleteResult.deletedCount ?? 0,
    });
  } catch (error) {
    console.error("Delete photos error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
