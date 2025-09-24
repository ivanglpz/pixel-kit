import { withAuth } from "@/db/middleware/auth";
import { Organization } from "@/db/schemas/organizations";
import { Project } from "@/db/schemas/projects";
import { IOrganization } from "@/db/schemas/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IOrganization | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing required field: id" });
  }

  try {
    // Verificar que el usuario sea owner
    const org = await Organization.findOne({
      _id: id,
      members: { $elemMatch: { user: req.userId, role: "owner" } },
    });

    if (!org) {
      return res
        .status(404)
        .json({ error: "Organization not found or not authorized" });
    }

    // Eliminar todos los proyectos de la organización
    await Project.deleteMany({ organization: org._id });

    // Eliminar la organización
    const deletedOrganization = await Organization.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Organization and its projects deleted successfully",
      data: deletedOrganization,
    });
  } catch (error) {
    console.error("Error while deleting organization:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
