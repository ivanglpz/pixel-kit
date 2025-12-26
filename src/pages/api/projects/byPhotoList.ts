import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { PhotoSchema } from "@/db/schemas/photos";
import { IProject } from "@/db/schemas/projects";
import { sanitizeInput } from "@/utils/sanitize";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: IProject[] } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { projectId } = sanitizeInput(req.query);
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ error: "Invalid or missing projectId" });
  }

  try {
    // Buscar el proyecto para obtener su organización
    const project = await PhotoSchema.findOne(
      { projectId: new Types.ObjectId(projectId) },
      { projectId: 1 }
    )
      .populate("projectId")
      .lean<{ projectId: IProject }>();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const org = await Organization.findById(project.projectId.organization);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Verificar que el usuario sea miembro de la organización
    const isMember = org.members.some(
      (m: IOrganizationMember) => m.user.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        error: "Not authorized to view photos from this project",
      });
    }

    const photos = await PhotoSchema.find(
      {
        projectId: new Types.ObjectId(projectId),
        type: "PUBLIC",
      },
      { createdBy: 0, folder: 0, projectId: 0 }
    );

    return res.status(200).json({
      message: "Photos retrieved successfully",
      data: photos,
    });
  } catch (error) {
    console.error("Error while fetching photos:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
