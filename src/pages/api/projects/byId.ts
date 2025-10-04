import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IProject | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = sanitizeInput(req.query);

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid project id" });
  }

  try {
    // Buscar el proyecto
    const project = await Project.findById(id).lean<IProject>();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Obtener la organización del proyecto
    const org = await Organization.findById(project.organization);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Verificar que el usuario sea miembro de la organización
    // Para consulta, permitimos cualquier rol (owner, admin, member)
    const isMember = org.members.some(
      (m: IOrganizationMember) => m.user.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        error: "Not authorized to view this project",
      });
    }

    return res.status(200).json({
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error while fetching project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
