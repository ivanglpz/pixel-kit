// Next.js API route: update fullName and photoUrl

import { withAuth } from "@/db/middleware/auth";
import { UserSchema } from "@/db/schemas/users";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type UpdateProfileBody = {
  fullName: string;
  photoUrl: string;
};

type AuthenticatedRequest = NextApiRequest & { userId: string };

type ResponseData = { message: string } | { error: string };

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullName, photoUrl } = sanitizeInput(req.body) as UpdateProfileBody;

  if (
    typeof fullName !== "string" ||
    typeof photoUrl !== "string" ||
    !fullName ||
    !photoUrl
  ) {
    return res
      .status(400)
      .json({ error: "fullName and photoUrl are required" });
  }

  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          fullName,
          photoUrl,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error while updating profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
