import { useAtomValue } from "jotai";
import { constants } from "../constants/color";
import { RECTANGLE_SELECTION_ATOM } from "../states/rectangle-selection";

export const LayerSaelection = () => {
  const selection = useAtomValue(RECTANGLE_SELECTION_ATOM);
  if (!selection.visible) return null;

  const x = selection.width < 0 ? selection.x + selection.width : selection.x;
  const y = selection.height < 0 ? selection.y + selection.height : selection.y;

  return (
    <div
      id="layer-selection-shapes"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: Math.abs(selection.width),
        height: Math.abs(selection.height),
        background: constants.theme.colors.background,
        border: `1.5px solid ${constants.theme.colors.primary}`,
        opacity: 0.4,
        pointerEvents: "none",
      }}
    />
  );
};
