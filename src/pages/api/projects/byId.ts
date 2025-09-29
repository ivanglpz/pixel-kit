import { withAuth } from "@/db/middleware/auth";
import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IProject | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = sanitizeInput(req.query);

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid project id" });
  }

  try {
    const project = await Project.findOne({
      _id: id,
    }).lean<IProject>();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error while fetching project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
