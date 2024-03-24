import { atom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";

export const DrawingBeforeStartAtom = atom({
  color: "#28a0f0",
  thickness: 5,
  lineCap: "round" as LineCap,
  lineJoin: "round" as LineJoin,
  dash: 0,
  dashEnable: false,
});
