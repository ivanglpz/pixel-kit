import { atom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";

export const DrawingBeforeStartAtom = atom({
  color: "#28a0f0",
  thickness: 5,
  lineCap: "round" as LineCap,
  lineJoin: "round" as LineJoin,
  dash: 0,
  dashEnable: false,
  shadowColor: "#000",
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowEnabled: false,
  shadowOpacity: 1,
});
