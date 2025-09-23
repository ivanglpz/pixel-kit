/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from "jsonwebtoken";

type Response = {
  email: string;
  fullName: string;
  userId: string;
};

export function AUTH_TOKEN(accessToken: string): Response {
  try {
    return jwt.verify(accessToken, process.env.JWT_SECRET!) as Response;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
