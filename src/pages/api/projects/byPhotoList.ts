import { withAuth } from "@/db/middleware/auth";
import { PhotoSchema } from "@/db/schemas/photos";
import { IProject } from "@/db/schemas/types";
import { sanitizeInput } from "@/utils/sanitize";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string; data: IProject[] } | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { projectId } = sanitizeInput(req.query);
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ error: "Invalid or missing projectId" });
  }

  try {
    const projects = await PhotoSchema.find(
      {
        projectId: new Types.ObjectId(projectId),
      },

      { createdBy: 0, folder: 0, projectId: 0 }
    );

    return res.status(200).json({
      message: "Photos retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error while fetching projects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
