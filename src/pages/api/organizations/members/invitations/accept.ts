import { withAuth } from "@/db/middleware/auth";
import {
  Organization,
  OrganizationInvitation,
} from "@/db/schemas/organizations";
import { IMembers, Role } from "@/db/schemas/types";
import { UserSchema } from "@/db/schemas/users";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: any } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { invitationId } = req.body;

  if (!invitationId) {
    return res
      .status(400)
      .json({ error: "Missing required field: invitationId" });
  }

  try {
    const invitation = await OrganizationInvitation.findById(invitationId);
    if (!invitation)
      return res.status(404).json({ error: "Invitation not found" });

    // Solo invitaciones pendientes
    if (invitation.status !== "pending") {
      return res.status(400).json({
        error: `Cannot accept invitation with status "${invitation.status}"`,
      });
    }

    const invitedUser = await UserSchema.findOne({ email: invitation.email });
    if (!invitedUser)
      return res.status(404).json({ error: "Invited user not registered" });

    // Solo el usuario invitado puede aceptar
    if (invitedUser._id.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Actualizar estado de la invitación
    invitation.status = "accepted";
    await invitation.save();

    // Agregar al miembro a la organización
    const org = await Organization.findById(invitation.organization);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    // Evitar duplicados
    if (
      org.members.some(
        (m: IMembers<Role>) => m.user.toString() === invitedUser._id.toString()
      )
    ) {
      return res.status(400).json({ error: "User is already a member" });
    }

    org.members.push({
      user: invitedUser._id,
      role: invitation.role,
    });
    const updatedOrg = await org.save();

    return res.status(200).json({
      message: "Invitation accepted and user added to organization",
      data: updatedOrg,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
