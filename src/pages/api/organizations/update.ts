import { withAuth } from "@/db/middleware/auth";
import { Organization } from "@/db/schemas/organizations";
import { IOrganization } from "@/db/schemas/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IOrganization | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, name } = req.body;

  if (!id || !name) {
    return res
      .status(400)
      .json({ error: "Missing required fields: id and name" });
  }

  try {
    const updatedOrganization = await Organization.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { name },
      { new: true }
    );

    if (!updatedOrganization) {
      return res
        .status(404)
        .json({ error: "Organization not found or not authorized" });
    }

    return res.status(200).json({
      message: "Organization updated successfully",
      data: updatedOrganization,
    });
  } catch (error) {
    console.error("Error while updating organization:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
