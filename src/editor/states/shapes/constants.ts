import type { IKeyTool } from "../tool";

type ExcludedKeys = "DRAW" | "MOVE" | "ICON";
type BoxBasedTool = Exclude<IKeyTool, ExcludedKeys>;
type IconBasedTool = Extract<IKeyTool, "ICON">;
type DrawBasedTool = Extract<IKeyTool, "DRAW">;

export const TOOLS_BOX_BASED: BoxBasedTool[] = ["FRAME", "IMAGE", "TEXT"];
export const TOOLS_ICON_BASED: IconBasedTool[] = ["ICON"];
export const TOOLS_DRAW_BASED: DrawBasedTool[] = ["DRAW"];

export const DELETE_KEYS = ["DELETE", "BACKSPACE"];
