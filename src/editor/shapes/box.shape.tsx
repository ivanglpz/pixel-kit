import { Rect } from "react-konva";
import { useResolvedShape } from "./frame.shape";
import { ShapeLabel } from "./label";
import { IShapeEvents } from "./type.shape";

const ShapeBox = (props: IShapeEvents) => {
  const shape = useResolvedShape(props);

  if (!shape.visible) return null;

  return (
    <>
      {props?.options?.showLabel ? (
        <ShapeLabel
          x={shape.x}
          y={shape.y}
          label={shape.label}
          color={props?.options?.background}
          isComponent={shape.isComponent}
        />
      ) : null}

      <Rect
        id={props?.options?.isLocked ? "" : shape?.id}
        parentId={shape.parentId}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        listening={shape.listening}
        fillEnabled
        fill={shape.fillColor}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={shape.strokeWidth > 0}
        dash={[shape.dash]}
        dashEnabled={shape.dash > 0}
        cornerRadius={
          shape.isAllBorderRadius
            ? [
                shape.borderTopLeftRadius,
                shape.borderTopRightRadius,
                shape.borderBottomRightRadius,
                shape.borderBottomLeftRadius,
              ]
            : shape.borderRadius
        }
        // 5. Sombras
        shadowColor={shape.shadowColor}
        shadowOpacity={shape.shadowOpacity}
        shadowOffsetX={shape.shadowOffsetX}
        shadowOffsetY={shape.shadowOffsetY}
        shadowBlur={shape.shadowBlur}
        shadowEnabled
        opacity={shape.opacity}
        draggable={shape.isSelected}
        {...shape.events}
      />
    </>
  );
};

export default ShapeBox;
