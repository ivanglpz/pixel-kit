import { withAuth } from "@/db/middleware/auth";
import { OrganizationInvitation } from "@/db/schemas/invitations";
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

    // Impedir modificar si ya no está pendiente
    if (invitation.status !== "pending") {
      return res.status(400).json({
        error: `Cannot modify invitation with status "${invitation.status}"`,
      });
    }

    const invitedUser = await UserSchema.findOne({ email: invitation.email });
    if (!invitedUser)
      return res.status(404).json({ error: "Invited user not registered" });

    if (invitedUser._id.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    invitation.status = "rejected";
    await invitation.save();

    return res.status(200).json({
      message: "Invitation rejected successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
