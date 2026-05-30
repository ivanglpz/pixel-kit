import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { app, BrowserWindow, nativeImage, protocol } from "electron";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers } from "./ipc/handlers.js";
import { openPixelKitDatabase } from "./storage/database.js";
import { getDesktopPaths } from "./storage/paths.js";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "pixelkit",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const getAppIconPath = () => resolve(__dirname, "..", "build", "icon.png");
const getRendererDistPath = () => resolve(__dirname, "..", "renderer-dist");

const getMimeType = (fileName: string) => {
  switch (extname(fileName).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".bmp":
      return "image/bmp";
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".ico":
      return "image/x-icon";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".mjs":
      return "text/javascript; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
};

const createFileResponse = async (filePath: string) => {
  const buffer = await readFile(filePath);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": getMimeType(filePath),
      "Cache-Control": "no-store",
    },
  });
};

const resolveSafePath = (rootDir: string, ...pathParts: string[]) => {
  const nextPath = resolve(rootDir, ...pathParts);

  if (nextPath === rootDir || nextPath.startsWith(`${rootDir}${sep}`)) {
    return nextPath;
  }

  return null;
};

const serveRendererRoute = async (url: URL) => {
  const rendererDistDir = getRendererDistPath();
  const requestedPath = decodeURIComponent(url.pathname);
  const candidatePath = resolveSafePath(
    rendererDistDir,
    `.${requestedPath === "/" ? "/index.html" : requestedPath}`,
  );

  if (
    candidatePath &&
    existsSync(candidatePath) &&
    statSync(candidatePath).isFile()
  ) {
    return createFileResponse(candidatePath);
  }

  const indexPath = resolveSafePath(rendererDistDir, "index.html");

  if (!indexPath || !existsSync(indexPath)) {
    return new Response("Renderer entrypoint not found", { status: 500 });
  }

  return createFileResponse(indexPath);
};

const registerAppProtocol = () => {
  const { assetsDir } = getDesktopPaths();

  protocol.handle("pixelkit", async (request) => {
    try {
      const url = new URL(request.url);

      if (url.hostname === "app") {
        return serveRendererRoute(url);
      }

      if (url.hostname !== "assets") {
        return new Response("Unknown desktop resource", { status: 404 });
      }

      const pathParts = url.pathname
        .split("/")
        .filter(Boolean)
        .map((part) => decodeURIComponent(part));
      const [projectId, fileName] = pathParts;

      if (!projectId || !fileName || pathParts.length !== 2) {
        return new Response("Invalid asset path", { status: 400 });
      }

      const projectDir = resolve(assetsDir, projectId);
      const filePath = resolveSafePath(projectDir, fileName);

      if (!filePath) {
        return new Response("Invalid asset path", { status: 400 });
      }

      return createFileResponse(filePath);
    } catch (error) {
      return new Response("Desktop resource not found", { status: 404 });
    }
  });
};

const createWindow = () => {
  const iconPath = getAppIconPath();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "Pixel kit",
    show: true,
    icon: existsSync(iconPath) ? iconPath : undefined,
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
  const useBundledRenderer =
    app.isPackaged || process.env.PIXELKIT_DESKTOP_RENDERER_MODE === "app";

  if (useBundledRenderer) {
    void mainWindow.loadURL("pixelkit://app/");
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
  const iconPath = getAppIconPath();

  if (process.platform === "darwin" && app.dock && existsSync(iconPath)) {
    app.dock.setIcon(nativeImage.createFromPath(iconPath));
  }

  registerAppProtocol();
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
