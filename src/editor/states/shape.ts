import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import SHAPES_ATOM from "./shapes";

const selectedShapeAtom = atom<IShape>({} as IShape);

export const SHAPE_ID_ATOM = atom<string | null>(null);
export const SHAPE_SELECTED_ATOM = atom((get) => {
  const shape = get(SHAPES_ATOM)?.find((e) => e?.id === get(SHAPE_ID_ATOM));

  if (!shape || !shape.state) return null;

  return get(shape?.state);
});

export const SHAPE_UPDATE_ATOM = atom(
  null,
  (get, set, args: Partial<IShape>) => {
    const findShape = get(SHAPES_ATOM)?.find(
      (e) => e?.id === get(SHAPE_ID_ATOM)
    );
    if (!findShape || !findShape.state) return null;
    set(findShape?.state, { ...get(findShape.state), ...args });
  }
);

export default selectedShapeAtom;
