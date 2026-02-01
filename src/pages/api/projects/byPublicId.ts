import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IProject | null }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = sanitizeInput(req.query);

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid project id" });
  }

  try {
    const project = await Project.findById(id).lean<IProject>();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.isPublic === false) {
      return res.status(403).json({
        message: "This project is private",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Public project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error while fetching public project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
