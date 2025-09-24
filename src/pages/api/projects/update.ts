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
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  const {
    name,
    // organization,
    data,
    // members
  } = req.body;

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        // ...(organization && { organization }),
        ...(data && { data }),
        // ...(members && { members }),
      },
      { new: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ error: "Project not found or not authorized" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error while updating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
