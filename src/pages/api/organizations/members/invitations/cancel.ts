import { withAuth } from "@/db/middleware/auth";
import { UserNotification } from "@/db/schemas/notifications";
import {
  Organization,
  OrganizationInvitation,
} from "@/db/schemas/organizations";
import { IMembers, Role } from "@/db/schemas/types";
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

    const org = await Organization.findById(invitation.organization);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const actingMember = org.members.find(
      (m: IMembers<Role>) => m.user.toString() === req.userId
    );
    if (!actingMember || !["owner", "admin"].includes(actingMember.role)) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel invitation" });
    }

    // Cancelar invitación
    invitation.status = "cancelled";
    await invitation.save();

    // Eliminar notificaciones relacionadas
    await UserNotification.deleteMany({ referenceId: invitation._id });

    return res.status(200).json({
      message: "Invitation cancelled and notifications removed successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
