import { DB_CONNECT } from "@/db/mongodb";
import { UserSchema } from "@/db/schemas/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { sanitizeInput } from "../../../utils/sanitize";

type ResponseData =
  | { message: string }
  | { error: string }
  | { token: string; message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = sanitizeInput(req.body);

  // Validar que sean strings y no objetos
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password.trim()
  ) {
    return res
      .status(400)
      .json({ error: "Email and password must be non-empty strings" });
  }

  try {
    await DB_CONNECT();

    // Buscar el usuario de manera segura
    const existingUser = await UserSchema.findOne({ email: email.trim() });

    // Validación única para evitar enumeración
    const passwordValid = existingUser
      ? await bcrypt.compare(password, existingUser.password)
      : false;

    if (!existingUser || !passwordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        email: existingUser.email,
        fullName: existingUser.fullName,
        userId: existingUser._id.toString(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", (error as Error).message);

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
