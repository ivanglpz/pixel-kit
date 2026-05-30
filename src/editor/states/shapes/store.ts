import { atom } from "jotai";
import { flexLayoutAtom } from "../../shapes/layout-flex";
import type { ShapeState } from "../../shapes/types/shape.state";
import { CURRENT_PAGE, PAGE_ID_ATOM } from "../pages";
import {
  RESET_SHAPES_IDS_ATOM,
  SELECTED_SHAPES_BY_IDS_ATOM,
} from "../shape";
import { buildPlaneShapes, computeStageBounds } from "./helpers";
import type { ALL_SHAPES } from "./types";

export const ALL_SHAPES_ATOM = atom(
  (get) => get(get(CURRENT_PAGE).SHAPES.LIST),
  (get, set, newShapes: ALL_SHAPES[]) => {
    set(get(CURRENT_PAGE).SHAPES.LIST, newShapes);
  },
);

export const GET_STAGE_BOUNDS_ATOM = atom(null, (get) => {
  return computeStageBounds(get)(get(ALL_SHAPES_ATOM));
});

export const PLANE_SHAPES_ATOM = atom((get) => {
  return buildPlaneShapes(get)(get(ALL_SHAPES_ATOM));
});

export const DELETE_SHAPES_ATOM = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selected = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selected.length === 0) return;

  selected.forEach((selection) => {
    if (selection.parentId) {
      const parent = plane.find((shape) => shape.id === selection.parentId);
      if (!parent) return;

      set(flexLayoutAtom, { id: parent.id });

      const childrenAtom = get(parent.state).children;
      const nextChildren = get(childrenAtom).filter(
        (child) => child.id !== selection.id,
      );
      set(childrenAtom, nextChildren);

      set(flexLayoutAtom, { id: selection.parentId });
      return;
    }

    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM).filter((shape) => shape.id !== selection.id),
    );
  });

  set(RESET_SHAPES_IDS_ATOM);
});

export const DELETE_ALL_SHAPES_ATOM = atom(null, (get, set) => {
  set(RESET_SHAPES_IDS_ATOM);
  set(ALL_SHAPES_ATOM, []);
});

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: ShapeState) => {
  if (!args || !args.id) return;

  if (get(args.parentId)) {
    const parentId = get(args.parentId);
    const parentShape = get(PLANE_SHAPES_ATOM).find(
      (shape) => shape.id === parentId,
    );
    if (!parentShape) return;

    const childrenAtom = get(parentShape.state).children;
    set(childrenAtom, [
      ...get(childrenAtom),
      {
        id: args.id,
        state: atom<ShapeState>(args),
        pageId: get(PAGE_ID_ATOM),
      },
    ]);

    set(flexLayoutAtom, { id: parentShape.id });
    return;
  }

  const newShape: ALL_SHAPES = {
    id: args.id,
    state: atom<ShapeState>(args),
  };

  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newShape]);
});

export default ALL_SHAPES_ATOM;
