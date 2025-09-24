import { withAuth } from "@/db/middleware/auth";
import { Project } from "@/db/schemas/projects";
import { IProject } from "@/db/schemas/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IProject | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, organization, data, members } = req.body;

  if (!name || !organization) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newProject = await Project.create({
      name,
      organization,
      createdBy: req.userId,
      data: data ?? "{}",
      members: members ?? [],
    });

    return res.status(201).json({
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Error while creating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
