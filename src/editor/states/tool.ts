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
  | "CODE";

export type IKeyMethods = Exclude<IKeyTool, "MOVE" | "FRAME" | "WRITING">;

const toolEditorAtom = atom("MOVE" as IKeyTool);

export default toolEditorAtom;
