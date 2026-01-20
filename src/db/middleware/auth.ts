/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { DB_CONNECT } from "../mongodb";

type NextHandler<T = any> = (
  req: NextApiRequest & { userId: string },
  res: NextApiResponse<T>,
) => Promise<void>;
type Response = {
  email: string;
  fullName: string;
  userId: string;
};
export function withAuth<T>(handler: NextHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse<T>) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" } as any);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Response;

      await DB_CONNECT();

      // ✅ Inyectamos el userId al req original
      (req as NextApiRequest & { userId: string }).userId = decoded.userId;

      return handler(req as NextApiRequest & { userId: string }, res);
    } catch (error) {
      console.error("Middleware error:", error);
      return res.status(500).json({ error: "Internal Server Error" } as any);
    }
  };
}
