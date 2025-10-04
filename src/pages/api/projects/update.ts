import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IProject | null }
  | { error: string };

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { _id, name, previewUrl } = sanitizeInput(req.body);
  const { data } = req.body;

  if (!_id || typeof _id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  try {
    // Buscar el proyecto para obtener su organización
    const project = await Project.findById(_id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Obtener la organización del proyecto
    const org = await Organization.findById(project.organization);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Verificar que el usuario sea owner o admin de la organización
    const actingMember = org.members.find(
      (m: IOrganizationMember) =>
        m.user.toString() === req.userId && ["owner", "admin"].includes(m.role)
    );

    if (!actingMember) {
      return res.status(403).json({
        error: "Not authorized to update projects in this organization",
      });
    }

    // Realizar la actualización
    const updatedProject = await Project.findOneAndUpdate(
      { _id: _id },
      {
        ...(name && { name }),
        ...(previewUrl && { previewUrl }),
        ...(data && { data }),
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error while updating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
