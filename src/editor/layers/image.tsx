import { Layer } from "react-konva";
import { ShapeImage } from "../shapes/image.shape";
import { useImageRender } from "../hooks/image/hook";
import useScreen from "../hooks/screen";
import { calculateDimension } from "@/utils/calculateDimension";

export const LayerImage = () => {
  const { img } = useImageRender();
  const { height, width } = useScreen();
  if (!img?.base64) return null;
  return (
    <Layer>
      <ShapeImage
        screenHeight={height}
        screenWidth={width}
        isSelected={false}
        draggable={false}
        onClick={() => {}}
        onDragMove={() => {}}
        onDragStart={() => {}}
        onDragStop={() => {}}
        onTransformStop={() => {}}
        shape={{
          ...calculateDimension(width, height, img?.width, img?.height),
          id: "",
          src: img?.base64,
          isBlocked: true,
          tool: "IMAGE",
          visible: true,
          dash: 0,
        }}
      />
    </Layer>
  );
};
