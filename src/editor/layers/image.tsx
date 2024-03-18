import { Layer } from "react-konva";
import { ShapeImage } from "../shapes/image.shape";

export const LayerImage = () => {
  return (
    <Layer>
      <ShapeImage
        isSelected={false}
        draggable={false}
        onClick={() => {}}
        onDragMove={() => {}}
        onDragStart={() => {}}
        onDragStop={() => {}}
        onTransformStop={() => {}}
        shape={{
          x: 0,
          y: 0,
          id: "",
          isBlocked: true,
          tool: "IMAGE",
          visible: true,
        }}
      />
    </Layer>
  );
};
