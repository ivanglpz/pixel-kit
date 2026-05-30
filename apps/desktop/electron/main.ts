import { app, BrowserWindow } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers } from "./ipc/handlers.js";
import { openPixelKitDatabase } from "./storage/database.js";
import { getDesktopPaths } from "./storage/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "Pixel kit",
    show: true,
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.focus();
    app.focus({ steal: true });
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL) => {
      console.error(
        `PixelKit renderer failed to load ${validatedURL}: ${errorCode} ${errorDescription}`,
      );
      mainWindow?.show();
    },
  );

  const rendererUrl =
    process.env.PIXELKIT_DESKTOP_RENDERER_URL ?? "http://localhost:4210";

  if (app.isPackaged || process.env.PIXELKIT_DESKTOP_RENDERER_MODE === "file") {
    void mainWindow.loadFile(join(app.getAppPath(), "out", "index.html"));
  } else {
    void mainWindow.loadURL(rendererUrl);
  }

  mainWindow.center();
  mainWindow.show();
  mainWindow.focus();
  app.focus({ steal: true });

  return mainWindow;
};

const initializeLocalBackend = () => {
  try {
    const paths = getDesktopPaths();
    const sqliteNativeBinding = app.isPackaged
      ? join(
          process.resourcesPath,
          "app.asar.unpacked",
          "node_modules",
          "better-sqlite3",
          "build",
          "Release",
          "better_sqlite3.node",
        )
      : undefined;
    const db = openPixelKitDatabase(paths.databasePath, sqliteNativeBinding);
    registerIpcHandlers(db, paths);
  } catch (error) {
    console.error("PixelKit local backend failed to initialize", error);
  }
};

app.whenReady().then(() => {
  createWindow();
  initializeLocalBackend();

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
      return;
    }

    mainWindow.show();
    mainWindow.focus();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
