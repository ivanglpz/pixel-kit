import { withAuth } from "@/db/middleware/auth";
import { Organization } from "@/db/schemas/organizations";
import { IMembers, IOrganization, Role } from "@/db/schemas/types";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IOrganization | null }
  | { error: string };

// const ALLOWED_ROLES: Array<"admin" | "member"> = ["admin", "member"];

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { organizationId, userId: newUserId, role } = req.body;

  if (!organizationId || !newUserId || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["owner", "admin", "member"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Role must be 'owner', 'admin', or 'member'" });
  }

  try {
    const org = await Organization.findById(organizationId);

    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Buscar el rol del usuario que hace la acción
    const actingMember = org.members.find(
      (m: IMembers<Role>) => m.user.toString() === req.userId
    );

    if (!actingMember || !["owner", "admin"].includes(actingMember.role)) {
      return res.status(403).json({ error: "Not authorized to add members" });
    }

    // Validar que solo el owner pueda agregar otros owners o admins
    if (["owner", "admin"].includes(role) && actingMember.role !== "owner") {
      return res
        .status(403)
        .json({ error: "Only owner can add admins or owners" });
    }

    // Evitar duplicados
    if (
      org.members.some((m: IMembers<Role>) => m.user.toString() === newUserId)
    ) {
      return res.status(400).json({ error: "User is already a member" });
    }

    org.members.push({
      user: new Types.ObjectId(newUserId),
      role,
    });

    const updatedOrg = await org.save();

    return res.status(200).json({
      message: "Member added successfully",
      data: updatedOrg,
    });
  } catch (error) {
    console.error("Error while adding member:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
