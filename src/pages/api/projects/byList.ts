import { withAuth } from "@/db/middleware/auth";
import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
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

  const { organizationId } = req.query;
  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "Invalid or missing organizationId" });
  }

  try {
    const projects = await Project.find({
      organization: new Types.ObjectId(organizationId),
      "members.user": new Types.ObjectId(req.userId),
    })
      .populate("organization")
      .populate("members.user");

    return res.status(200).json({
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error while fetching projects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
