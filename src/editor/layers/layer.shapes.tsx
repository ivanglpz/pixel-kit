import { useAtomValue } from "jotai";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import ALL_SHAPES_ATOM from "../states/shapes";

export const LayerShapes = () => {
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  // const selectedIds = useAtomValue(SHAPE_IDS_ATOM);
  // const selection = useAtomValue(RECTANGLE_SELECTION_ATOM);
  // const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);

  // useEffect(() => {
  //   const allShapes = lyRef.current ? getAllShapes(lyRef.current) : [];
  //   const nodes = allShapes?.filter?.(
  //     (child) => child?.attrs?.id !== "transformer-editable"
  //   );

  //   const selected = nodes?.filter((e) =>
  //     selectedIds?.some((w) => w.id === e.attrs?.id)
  //   );
  //   trRef.current?.nodes(selected);
  //   trRef.current?.getLayer()?.batchDraw();
  // }, [selectedIds, ALL_SHAPES]);

  return (
    <>
      {/* <Layer id="layer-shapes" ref={lyRef}> */}
      {ALL_SHAPES?.map((item) => {
        const Component = Shapes?.[item?.tool] as FCShapeWEvents;
        return <Component shape={item} key={`pixel-kit-shapes-${item?.id}`} />;
      })}
      {/* Transformer */}
      {/* <Transformer
          id="transformer-editable"
          ref={trRef}
          anchorSize={10}
          borderStroke={constants.theme.colors.primary}
          borderStrokeWidth={2}
          anchorCornerRadius={2}
          keepRatio={false}
          onTransformEnd={() => {
            setUpdateUndoRedo();
          }}
          onDragEnd={() => {
            setUpdateUndoRedo();
          }}
          anchorStroke={constants.theme.colors.primary}
          boundBoxFunc={(oldBox, newBox) => {
            // Limitar el tamaño mínimo
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        /> */}
      {/* Rectángulo de selección */}
      {/* {selection && selection.visible && (
          <Rect
            x={selection.x}
            y={selection.y}
            width={selection.width}
            height={selection.height}
            fill={constants.theme.colors.background}
            stroke={constants.theme.colors.primary}
            strokeWidth={1.5}
          />
        )} */}
      {/* </Layer> */}
    </>
  );
};
