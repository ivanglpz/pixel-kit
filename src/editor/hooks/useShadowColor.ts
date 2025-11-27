import { useAtomValue } from "jotai";
import { Effect, JotaiState } from "../shapes/type.shape";

export function useShadowColor(data: JotaiState<Effect[]>) {
  const effects = useAtomValue(data);

  const firstEffect = effects.at(0);
  if (!firstEffect) {
    return {
      color: "#fffff",
      enabled: false,
    };
  }
  return {
    color: useAtomValue(firstEffect.color),
    enabled: true,
  };
}
