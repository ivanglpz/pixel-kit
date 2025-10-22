import { IStageEvents } from "../states/event";

export const cursor_event: Record<IStageEvents, string> = {
  CREATE: "custom-cursor-crosshair",
  COPY: "custom-cursor-arrow-duplicate",
  COPYING: "custom-cursor-arrow-duplicate",
  CREATING: "custom-cursor-crosshair",
  IDLE: "CursorDefault",
  MULTI_SELECT: "CursorDefault",
  SELECT_AREA: "CursorDefault",
};

export const STAGE_IDS = [
  null,
  undefined,
  "main-image-render-stage",
  "pixel-kit-stage",
];
