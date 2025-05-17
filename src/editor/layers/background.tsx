import { useAtomValue } from "jotai";
import { Layer, Rect } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { useCanvas } from "../hooks";

export const LayerBackground = () => {
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const { config } = useCanvas();

  return (
    <>
      <Layer id="layer-background-color">
        <Rect
          width={width}
          height={height}
          x={0}
          y={0}
          fill={config.backgroundColor}
        />
      </Layer>
    </>
  );
};
