import { useAtomValue } from "jotai";
import { Layer, Rect } from "react-konva";
import { constants } from "../constants/color";
import { RECTANGLE_SELECTION_ATOM } from "../states/rectangle-selection";

export const LayerSaelection = () => {
  const selection = useAtomValue(RECTANGLE_SELECTION_ATOM);
  if (!selection.visible) return null;

  return (
    <>
      <Layer id="layer-selection-shapes">
        <Rect
          x={selection.x}
          y={selection.y}
          width={selection.width}
          height={selection.height}
          fill={constants.theme.colors.background}
          stroke={constants.theme.colors.primary}
          strokeWidth={1.5}
        />
      </Layer>
    </>
  );
};
