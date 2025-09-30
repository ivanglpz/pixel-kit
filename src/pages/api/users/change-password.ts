import { DB_CONNECT } from "@/db/mongodb";
import { UserSchema } from "@/db/schemas/users";
import { sanitizeInput } from "@/utils/sanitize";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      message: string;
    }
  | {
      error: string;
    }
  | {
      token: string;
      message: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // const { oldPassword, newPassword } = req.body;
  const { oldPassword, newPassword } = sanitizeInput(req.body);

  const token = req.headers?.authorization ?? "";

  // Validar datos de entrada
  if (
    typeof token !== "string" ||
    typeof oldPassword !== "string" ||
    typeof newPassword !== "string" ||
    !token ||
    !oldPassword ||
    !newPassword
  ) {
    return res
      .status(400)
      .json({ error: "Token, oldPassword, and newPassword are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    // Conectar a la base de datos
    await DB_CONNECT();

    // Buscar al usuario por ID
    const user = await UserSchema.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar que la contraseña actual sea correcta
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña y la marca de tiempo
    user.password = hashedPassword;
    user.passwordUpdatedAt = new Date(); // Invalida tokens antiguos
    await user.save();

    // Generar un nuevo token JWT
    const newToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Password updated successfully",
      token: newToken, // Incluye el nuevo token en la respuesta
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }
    }
    console.error("Error while updating password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
