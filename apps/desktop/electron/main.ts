import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getDesktopPaths } from "./storage/paths.js";
import { openPixelKitDatabase } from "./storage/database.js";
import { registerIpcHandlers } from "./ipc/handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "PixelKit Desktop",
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const rendererUrl =
    process.env.PIXELKIT_DESKTOP_RENDERER_URL ?? "http://localhost:4210";

  if (
    app.isPackaged ||
    process.env.PIXELKIT_DESKTOP_RENDERER_MODE === "file"
  ) {
    void mainWindow.loadFile(join(app.getAppPath(), "out", "index.html"));
    return;
  }

  void mainWindow.loadURL(rendererUrl);
};

app.whenReady().then(() => {
  const paths = getDesktopPaths();
  const db = openPixelKitDatabase(paths.databasePath);
  registerIpcHandlers(db, paths);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
