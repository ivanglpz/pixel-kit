import { withAuth } from "@/db/middleware/auth";
import { IOrganizationMember, Organization } from "@/db/schemas/organizations";
import { Project } from "@/db/schemas/projects";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: any | null } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, organization, data } = req.body;

  if (!name || !organization) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Obtener organización
    const org = await Organization.findById(organization);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    // Verificar que el usuario sea owner o admin
    const actingMember = org.members.find(
      (m: IOrganizationMember) =>
        m.user.toString() === req.userId && ["owner", "admin"].includes(m.role)
    );

    if (!actingMember) {
      return res.status(403).json({
        error: "Not authorized to create projects in this organization",
      });
    }

    const newProject = await Project.create({
      name,
      organization,
      createdBy: req.userId,
      data: data ?? "{}",
    });

    return res.status(201).json({
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Error while creating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
