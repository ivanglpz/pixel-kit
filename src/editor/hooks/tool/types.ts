export type IKeyTool =
  | "MOVE"
  | "BOX"
  | "CIRCLE"
  | "LINE"
  | "IMAGE"
  | "TEXT"
  | "FRAME"
  | "GROUP"
  | "DRAW"
  | "WRITING"
  | "CODE";

export type IKeyMethods = Exclude<
  IKeyTool,
  "GROUP" | "MOVE" | "FRAME" | "WRITING"
>;
