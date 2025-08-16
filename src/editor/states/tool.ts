import { atom } from "jotai";

export type IKeyTool =
  | "MOVE"
  | "BOX"
  | "CIRCLE"
  | "LINE"
  | "IMAGE"
  | "TEXT"
  | "FRAME"
  | "EXPORT"
  | "DRAW"
  | "WRITING"
  | "CODE"
  | "GROUP"
  | "CLIP";

export type IKeyMethods = Exclude<
  IKeyTool,
  "MOVE" | "FRAME" | "WRITING" | "CLIP"
>;

const TOOL_ATOM = atom("MOVE" as IKeyTool);
export const PAUSE_MODE_ATOM = atom<boolean>(false);
export default TOOL_ATOM;
