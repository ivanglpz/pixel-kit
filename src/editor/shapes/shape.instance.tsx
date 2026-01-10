// import { useMemo } from "react";

// import { useAtom, useAtomValue, useSetAtom } from "jotai";
// import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";

// import { Image as KonvaImage } from "react-konva";
// import { calculateCoverCrop } from "../utils/crop";
// import { SVG } from "../utils/svg";
// import { flexLayoutAtom } from "./layout-flex";
import { IShapeEvents } from "./type.shape";

export const SHAPE_INSTANCE = (props: IShapeEvents) => {
  const { shape: instance } = props;

  //   const source = getShapeById(instance.sourceShapeId);
  //   if (!source) return null;

  //   const x = useAtomValue(instance.x);
  //   const y = useAtomValue(instance.y);
  //   const rotation = useAtomValue(instance.rotation);

  //   return (
  //     <Group x={x} y={y} rotation={rotation}>
  //       <SHAPE_FRAME shape={source} />
  //     </Group>
  //   );
  return null;
};
