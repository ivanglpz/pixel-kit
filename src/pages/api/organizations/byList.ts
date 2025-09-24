import { withAuth } from "@/db/middleware/auth";
import { Organization } from "@/db/schemas/organizations";
import { IOrganization } from "@/db/schemas/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IOrganization[] }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const organizations = await Organization.find({
      "members.user": req.userId,
    });

    return res.status(200).json({
      message: "Organizations fetched successfully",
      data: organizations,
    });
  } catch (error) {
    console.error("Error while fetching organizations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
