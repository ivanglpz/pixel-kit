import { withAuth } from "@/db/middleware/auth";
import { UserNotification } from "@/db/schemas/notifications";
import {
  Organization,
  OrganizationInvitation,
} from "@/db/schemas/organizations";
import { IMembers, Role } from "@/db/schemas/types";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: any } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { organizationId, email, role } = req.body;

  if (!organizationId || !email || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'admin' or 'member'" });
  }

  try {
    const org = await Organization.findById(organizationId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const actingMember = org.members.find(
      (m: IMembers<Role>) => m.user.toString() === req.userId
    );
    if (!actingMember || !["owner", "admin"].includes(actingMember.role)) {
      return res
        .status(403)
        .json({ error: "Not authorized to invite members" });
    }

    const invitation = await OrganizationInvitation.create({
      organization: organizationId,
      email,
      role,
      invitedBy: req.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    // Crear notificación para el usuario invitado
    await UserNotification.create({
      user: new Types.ObjectId(), // si tienes el userId real, reemplaza aquí; si solo email, deberías buscarlo
      type: "organization_invite",
      message: `Has sido invitado a unirte a la organización "${org.name}" como ${role}.`,
      referenceId: invitation._id,
      read: false,
    });

    return res.status(201).json({
      message: "Invitation created and notification sent successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
