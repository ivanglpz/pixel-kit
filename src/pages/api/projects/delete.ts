import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { Project } from "@/db/schemas/projects";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: any | null } | { error: string };

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
    // Obtener proyecto
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Verificar rol del usuario en la organización
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
