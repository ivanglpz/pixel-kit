import { DB_CONNECT } from "@/db/mongodb";
import { Project } from "@/db/schemas/projects";
import type { IProject } from "@/db/schemas/types";
import "@/db/schemas/users";
import { sanitizeInput } from "@/utils/sanitize";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponse = {
  message: string;
  data: IProject;
};

type ErrorResponse = {
  error: string;
};

type ResponseData = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { id } = sanitizeInput(req.query);

  if (typeof id !== "string") {
    res.status(400).json({ error: "Missing or invalid project id" });
    return;
  }

  try {
    await DB_CONNECT();
    const project = await Project.findOne({
      _id: id,
      isPublic: true,
    })
      .populate({
        path: "createdBy",
        select: "fullName photoUrl -_id",
      })
      .lean<IProject>();

    if (!project) {
      res.status(404).json({ error: "Public project not found" });
      return;
    }

    res.status(200).json({
      message: "Public project retrieved successfully",
      data: project,
    });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
