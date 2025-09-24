import { withAuth } from "@/db/middleware/auth";
import { UserNotification } from "@/db/schemas/notifications";
import { Organization } from "@/db/schemas/organizations";
import { IMembers, IOrganization, Role } from "@/db/schemas/types";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IOrganization | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { organizationId, memberId } = req.body;

  if (!organizationId || !memberId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (memberId === req.userId) {
    return res.status(403).json({ error: "Cannot remove yourself" });
  }

  try {
    const org = await Organization.findById(organizationId);

    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Buscar rol del usuario que realiza la acción
    const actingMember = org.members.find(
      (m: IMembers<Role>) => m.user.toString() === req.userId
    );
    if (!actingMember || !["owner", "admin"].includes(actingMember.role)) {
      return res
        .status(403)
        .json({ error: "Not authorized to remove members" });
    }

    // Buscar al miembro a remover
    const targetMember = org.members.find(
      (m: IMembers<Role>) => m.user.toString() === memberId
    );
    if (!targetMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (targetMember.role === "owner") {
      return res.status(403).json({ error: "Cannot remove the owner" });
    }

    if (targetMember.role === "admin" && actingMember.role !== "owner") {
      return res.status(403).json({ error: "Only owner can remove an admin" });
    }

    // Remover miembro
    org.members = org.members.filter(
      (m: IMembers<Role>) => m.user.toString() !== memberId
    );
    const updatedOrg = await org.save();

    // Crear notificación para el usuario removido
    await UserNotification.create({
      user: new Types.ObjectId(memberId),
      type: "organization_removed",
      message: `You have been removed from the organization "${org.name}".`,
      referenceId: org._id,
      read: false,
    });

    return res.status(200).json({
      message: "Member removed successfully",
      data: updatedOrg,
    });
  } catch (error) {
    console.error("Error while removing member:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
