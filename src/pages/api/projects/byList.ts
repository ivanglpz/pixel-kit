import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
import { sanitizeInput } from "@/utils/sanitize";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: IProject[] } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { organizationId } = sanitizeInput(req.query);
  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "Invalid or missing organizationId" });
  }

  try {
    // Obtener la organización
    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Verificar que el usuario sea miembro de la organización
    const isMember = org.members.some(
      (m: IOrganizationMember) => m.user.toString() === req.userId,
    );

    if (!isMember) {
      return res.status(403).json({
        error: "Not authorized to view projects from this organization",
      });
    }

    // Obtener los proyectos de la organización
    const projects = await Project.find(
      {
        organization: new Types.ObjectId(organizationId),
      },
      {
        data: 0,
      },
    );

    return res.status(200).json({
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error while fetching projects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
