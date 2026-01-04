import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { PhotoSchema } from "@/db/schemas/photos";
import { Project } from "@/db/schemas/projects";
import { sanitizeInput } from "@/utils/sanitize";
import { v2 as cloudinary } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type ResponseData =
  | { message: string; data: unknown | null }
  | { error: string };

const deleteProjectPhotos = async (projectId: string): Promise<void> => {
  const photos = await PhotoSchema.find(
    { projectId },
    { cloudinaryPublicId: 1 }
  );

  const publicIds = photos.map((p) => p.cloudinaryPublicId).filter(Boolean);

  if (publicIds.length > 0) {
    try {
      await cloudinary.api.delete_resources(publicIds, {
        resource_type: "image",
      });
    } catch (error) {
      // best-effort cleanup
      console.error("Cloudinary bulk delete failed:", error);
    }
  }

  await PhotoSchema.deleteMany({ projectId });
};

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = sanitizeInput(req.query);
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const org = await Organization.findById(project.organization);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const actingMember = org.members.find(
      (m: IOrganizationMember) =>
        m.user.toString() === req.userId && ["owner", "admin"].includes(m.role)
    );

    if (!actingMember) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this project" });
    }

    // 1. Delete all photos (Cloudinary + Mongo)
    await deleteProjectPhotos(id);

    // 2. Delete project
    const deletedProject = await Project.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    console.error("Error while deleting project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
