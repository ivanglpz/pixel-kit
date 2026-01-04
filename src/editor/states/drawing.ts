import { atom } from "jotai";
import { CreateShapeSchema } from "../helpers/shape-schema";

export const DRAW_START_CONFIG_ATOM = atom(
  CreateShapeSchema({
    strokeWidth: atom(2),
    strokeColor: atom("#28a0f0"),
  })
);
