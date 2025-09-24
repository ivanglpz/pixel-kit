import { withAuth } from "@/db/middleware/auth";
import {
  Organization,
  OrganizationInvitation,
} from "@/db/schemas/organizations";
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
      (m) => m.user.toString() === req.userId
    );
    if (!actingMember || !["owner", "admin"].includes(actingMember.role)) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel invitation" });
    }

    invitation.status = "cancelled";
    await invitation.save();

    return res.status(200).json({
      message: "Invitation cancelled successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
