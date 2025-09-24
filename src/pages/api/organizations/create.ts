import { withAuth } from "@/db/middleware/auth";
import { Organization } from "@/db/schemas/organizations";
import { IOrganization } from "@/db/schemas/types";
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

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }

  try {
    const newOrganization = await Organization.create({
      name,
      members: [
        {
          user: new Types.ObjectId(req.userId),
          role: "owner",
        },
      ],
    });

    return res.status(201).json({
      message: "Organization created successfully",
      data: newOrganization,
    });
  } catch (error) {
    console.error("Error while creating organization:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
