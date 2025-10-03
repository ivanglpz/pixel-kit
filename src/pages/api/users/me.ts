import { DB_CONNECT } from "@/db/mongodb";
import { UserSchema } from "@/db/schemas/users";
import { AUTH_TOKEN } from "@/utils/token";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      message: string;
      user: {
        email: string;
        fullName: string;
        userId: string;
      };
    }
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validar que se haya enviado un token
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Verificar el token

    const decoded = AUTH_TOKEN(token); // Implementa esta función para verificar el JWT

    // Conectar a la base de datos
    await DB_CONNECT();

    // Buscar al usuario en la base de datos
    const user = await UserSchema.findById(
      decoded.userId,
      { password: 0, passwordUpdatedAt: 0 } // 0 significa excluir esta propiedad
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retornar la información del usuario
    return res.status(200).json({
      message: "Token is valid",
      user: {
        email: user.email,
        fullName: user.fullName,
        userId: user._id.toString(),
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
