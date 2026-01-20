import { withAuth } from "@/db/middleware/auth";
import { UserSchema } from "@/db/schemas/users";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      message: string;
      user: {
        email: string;
        fullName: string;
        userId: string;
        photoUrl: string | null;
      };
    }
  | {
      error: string;
    };
type AuthenticatedRequest = NextApiRequest & { userId: string };

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Buscar al usuario en la base de datos
    const user = await UserSchema.findById(
      req.userId,
      { password: 0, passwordUpdatedAt: 0, userId: 0 }, // 0 significa excluir esta propiedad
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retornar la información del usuario
    return res.status(200).json({
      message: "User retrieved successfully",
      user: {
        email: user.email,
        fullName: user.fullName,
        userId: user._id.toString(),
        photoUrl: user.photoUrl || null,
      },
    });
  } catch (error) {
    console.error("Error while verifying token:", error);

    // Manejar errores de validación del token
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export default withAuth(handler);
