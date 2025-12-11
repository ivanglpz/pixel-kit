import { useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Transformer } from "react-konva";
import { constants } from "../constants/color";
import { useAutoSave } from "../hooks/useAutoSave";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import ALL_SHAPES_ATOM from "../states/shapes";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";

const getAllShapes = (node: Konva.Layer | Konva.Group): Konva.Shape[] => {
  const children = Array.from(node.getChildren());
  return children.flatMap((child) => {
    if (child.getClassName() === "Group") {
      return getAllShapes(child as Konva.Group);
    }
    return [child as Konva.Shape];
  });
};

export const LayerShapes = () => {
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const trRef = useRef<Konva.Transformer>(null);
  const lyRef = useRef<Konva.Layer>(null);
  const selectedIds = useAtomValue(SELECTED_SHAPES_BY_IDS_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);
  const { debounce } = useAutoSave();

  useEffect(() => {
    const allShapes = lyRef.current ? getAllShapes(lyRef.current) : [];
    const nodes = allShapes?.filter?.(
      (child) => child?.attrs?.id !== "transformer-editable"
    );

    const selected = nodes?.filter((e) =>
      selectedIds?.some((w) => w.id === e.attrs?.id)
    );
    trRef.current?.nodes(selected);
    trRef.current?.getLayer()?.batchDraw();
  }, [selectedIds, ALL_SHAPES]);

  return (
    <>
      <Layer id="layer-shapes" ref={lyRef}>
        {ALL_SHAPES?.map((item, index) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return (
            <Component
              shape={item}
              key={`pixel-kit-shapes-${item?.id}-${index}`}
            />
          );
        })}
        {/* Transformer */}
        <Transformer
          id="transformer-editable"
          ref={trRef}
          anchorSize={10}
          borderStroke={constants.theme.colors.primary}
          borderStrokeWidth={2}
          anchorCornerRadius={2}
          keepRatio={false}
          onTransformEnd={() => {
            // setUpdateUndoRedo();
            // debounce.execute();
          }}
          onDragEnd={() => {
            // setUpdateUndoRedo();
            // debounce.execute();
          }}
          anchorStroke={constants.theme.colors.primary}
          boundBoxFunc={(oldBox, newBox) => {
            // Limitar el tamaño mínimo
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </>
  );
};
