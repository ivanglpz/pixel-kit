// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { DB_CONNECT } from "@/db/mongodb";
import { UserSchema } from "@/db/schemas/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Importa jsonwebtoken
import type { NextApiRequest, NextApiResponse } from "next";
import { sanitizeInput } from "../../../utils/sanitize";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // const { email, password, fullName } = req.body;
  const { email, password, fullName } = sanitizeInput(req.body);

  // Validar datos de entrada
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof fullName !== "string" ||
    !email ||
    !password ||
    !fullName
  ) {
    return res
      .status(400)
      .json({ error: "Email, fullName and password are required" });
  }

  try {
    await DB_CONNECT();
    // Encriptar la contraseña

    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserSchema({
      email,
      password: hashedPassword,
      fullName,
    });

    await newUser.save();

    // Generar el JWT token
    const token = jwt.sign(
      {
        email: newUser.email,
        fullName: newUser.fullName,
        userId: newUser?._id?.toString(),
      }, // Payload del token
      process.env.JWT_SECRET!, // Clave secreta para firmar el token (debe ser configurada en .env)
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token, // Incluye el token en la respuesta
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
