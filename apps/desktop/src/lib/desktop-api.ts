import type { DesktopApi } from "../../electron/types";

declare global {
  interface Window {
    pixelkitDesktop?: DesktopApi;
  }
}

export const getDesktopApi = (): DesktopApi => {
  if (!window.pixelkitDesktop) {
    throw new Error("PixelKit desktop bridge is not available");
  }

  return window.pixelkitDesktop;
};
