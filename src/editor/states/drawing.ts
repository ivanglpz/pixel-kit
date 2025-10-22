import { atom } from "jotai";
import { CreateShapeSchema } from "../helpers/shape-schema";

export const DRAW_START_CONFIG_ATOM = atom(
  CreateShapeSchema({
    strokes: [
      {
        id: "559c1735-4e62-4c43-aa4c-246ec594ca06",
        visible: true,
        color: "#28a0f0",
      },
    ],
    strokeWidth: 5,
  })
);
