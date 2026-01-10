import { atom } from "jotai";
import { PROJECT_ATOM } from "./projects";

export type IKeyTool =
  | "MOVE"
  // | "BOX"
  // | "CIRCLE"
  // | "LINE"
  | "IMAGE"
  | "TEXT"
  | "FRAME"
  | "DRAW"
  | "ICON"
  | "INSTANCE"
  | "COMPONENT";
// | "CODE"
// | "GROUP"
// | "CLIP";

export type IKeyMethods = Exclude<
  IKeyTool,
  "MOVE" | "FRAME" | "WRITING" | "CLIP"
>;

export type IShapeTool = Exclude<IKeyTool, "MOVE" | "CLIP">;
const TOOL_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).TOOL),
  (_get, _set, newTool: IKeyTool) => {
    const toolAtom = _get(PROJECT_ATOM).TOOL;
    _set(toolAtom, newTool);
  }
);
export const PAUSE_MODE_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).PAUSE_MODE),
  (_get, _set, newTool: boolean) => {
    const toolAtom = _get(PROJECT_ATOM).PAUSE_MODE;
    _set(toolAtom, newTool);
  }
);
export default TOOL_ATOM;
