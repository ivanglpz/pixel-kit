import { safeStorage } from "electron";
import type { AuthSession, LoginCredentials } from "@pixelkit/platform";
import type { UserProfile } from "@pixelkit/core";
import type { PixelKitDatabase } from "./database";
import type { SessionRow } from "../types";

type JwtPayload = {
  email?: string;
  fullName?: string;
  userId?: string;
  exp?: number;
};

type StoredSession = Omit<AuthSession, "accessToken"> & {
  accessToken: string;
  encrypted: boolean;
};

const decodeJwtPayload = (token: string): JwtPayload => {
  const [, payload] = token.split(".");
  if (!payload) return {};

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
};

const protectToken = (token: string) => {
  if (!safeStorage.isEncryptionAvailable()) {
    return { accessToken: token, encrypted: false };
  }

  return {
    accessToken: safeStorage.encryptString(token).toString("base64"),
    encrypted: true,
  };
};

const revealToken = (session: StoredSession) => {
  if (!session.encrypted) return session.accessToken;

  return safeStorage.decryptString(Buffer.from(session.accessToken, "base64"));
};

export const saveSession = (
  db: PixelKitDatabase,
  session: AuthSession,
): void => {
  const protectedToken = protectToken(session.accessToken);
  const stored: StoredSession = {
    ...session,
    ...protectedToken,
  };

  db.prepare(
    `INSERT INTO sessions (id, session, updated_at)
     VALUES ('current', ?, ?)
     ON CONFLICT(id) DO UPDATE SET session = excluded.session, updated_at = excluded.updated_at`,
  ).run(JSON.stringify(stored), new Date().toISOString());
};

export const getSession = (db: PixelKitDatabase): AuthSession | null => {
  const row = db
    .prepare("SELECT id, session, updated_at FROM sessions WHERE id = 'current'")
    .get() as SessionRow | undefined;

  if (!row) return null;

  const stored = JSON.parse(row.session) as StoredSession;
  return {
    ...stored,
    accessToken: revealToken(stored),
  };
};

export const clearSession = (db: PixelKitDatabase): void => {
  db.prepare("DELETE FROM sessions WHERE id = 'current'").run();
};

export const loginWithCloud = async (
  db: PixelKitDatabase,
  credentials: LoginCredentials,
): Promise<AuthSession> => {
  const apiBaseUrl = process.env.PIXELKIT_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("PIXELKIT_API_BASE_URL is required for desktop login");
  }

  const response = await fetch(`${apiBaseUrl}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const body = (await response.json()) as { token?: string; error?: string };
  if (!response.ok || !body.token) {
    throw new Error(body.error ?? "Desktop login failed");
  }

  const payload = decodeJwtPayload(body.token);
  const user: UserProfile = {
    userId: payload.userId ?? credentials.email,
    email: payload.email ?? credentials.email,
    fullName: payload.fullName ?? credentials.email,
    photoUrl: null,
  };
  const session: AuthSession = {
    accessToken: body.token,
    user,
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
    offlineAvailable: true,
  };

  saveSession(db, session);
  return session;
};
