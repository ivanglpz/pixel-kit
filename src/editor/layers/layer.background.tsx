import { useAtomValue } from "jotai";
import { Layer, Rect } from "react-konva";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";

export const LayerBackground = () => {
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);

  return (
    <>
      <Layer id="layer-background-color">
        <Rect width={width} height={height} x={0} y={0} fill={background} />
      </Layer>
    </>
  );
};
