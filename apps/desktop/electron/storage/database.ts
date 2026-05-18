import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type PixelKitDatabase = DatabaseType;

export const openPixelKitDatabase = (databasePath: string) => {
  mkdirSync(dirname(databasePath), { recursive: true });

  const db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      session TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      remote_id TEXT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      snapshot TEXT NOT NULL,
      preview TEXT,
      sync_status TEXT NOT NULL,
      revision INTEGER NOT NULL,
      last_synced_revision INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      remote_updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      url TEXT NOT NULL,
      path TEXT NOT NULL,
      name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      width INTEGER,
      height INTEGER,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  return db;
};
