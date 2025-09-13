import { useAtomValue } from "jotai";
import { SHAPES } from "../shapes/shapes";
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
      {ALL_SHAPES?.map((item) => {
        const Component = SHAPES?.[item?.tool];
        if (!Component) {
          return null;
        }
        return <Component shape={item} key={`pixel-kit-shapes-${item?.id}`} />;
      })}
    </>
  );
};
