import { BookmarkModel, IBookmark } from "@/backend/db/models/bookmark";
import { withAuth } from "@/backend/middleware/auth";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | { message: string; data: IBookmark | null }
  | { error: string };

async function handler(
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { _id } = req.query;
  if (!_id || typeof _id !== "string") {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  try {
    const bookmark = await BookmarkModel.findOne({
      _id: _id,
      userId: req.userId, // ✅ Ya viene inyectado desde el middleware
    })
      .populate("tags")
      .populate("category");

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    return res.status(200).json({
      message: "Bookmark retrieved successfully",
      data: bookmark,
    });
  } catch (error) {
    console.error("Error while querying bookmark:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler);
