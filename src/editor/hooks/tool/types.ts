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
