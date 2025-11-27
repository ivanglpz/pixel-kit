import { useAtomValue } from "jotai";
import { JotaiState, Stroke } from "../shapes/type.shape";

export function useStrokeColor(data: JotaiState<Stroke[]>) {
  const strokes = useAtomValue(data);

  const firstStroke = strokes.at(0);
  if (!firstStroke) {
    return "#fffff";
  }
  const color = useAtomValue(firstStroke.color);
  return color;
}
