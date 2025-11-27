import { useAtomValue } from "jotai";
import { Fill, JotaiState } from "../shapes/type.shape";

export function useFillColor(data: JotaiState<Fill[]>) {
  const fills = useAtomValue(data);

  const firstFill = fills.at(0);
  if (!firstFill) {
    return "transparent";
  }
  const color = useAtomValue(firstFill.color);
  return color;
}
