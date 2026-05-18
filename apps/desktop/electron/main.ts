import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getDesktopPaths } from "./storage/paths";
import { openPixelKitDatabase } from "./storage/database";
import { registerIpcHandlers } from "./ipc/handlers";

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
