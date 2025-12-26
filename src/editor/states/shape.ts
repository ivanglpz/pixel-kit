import { atom, Getter, Setter } from "jotai";
import { ShapeBase } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, IShapeId } from "./pages";
import { PLANE_SHAPES_ATOM } from "./shapes";
import { UndoShape } from "./undo-redo";

const filterListId = (id: string, parentId: string | null) => {
  return (e: IShapeId) => e?.id === id && e?.parentId === parentId;
};
export const SELECTED_SHAPES_BY_IDS_ATOM = atom(
  (get) => {
    return get(get(CURRENT_PAGE).SHAPES.ID);
  },
  (get, _set, shape: IShapeId) => {
    const ids = get(CURRENT_PAGE).SHAPES.ID;
    const event = get(EVENT_ATOM);
    const listIds = get(ids);

    if (event === "MULTI_SELECT") {
      const findId = listIds?.some(filterListId(shape.id, shape.parentId));

      if (findId) {
        _set(ids, listIds?.filter(filterListId(shape.id, shape.parentId)));

        return;
      }
      _set(ids, [...listIds, shape]);
      return;
    }
    _set(ids, [shape]);
  }
);
export const UPDATE_SHAPES_IDS_ATOM = atom(
  null,
  (get, set, args: IShapeId[]) => {
    const ids = get(CURRENT_PAGE).SHAPES.ID;
    set(ids, args);
  }
);

export const RESET_SHAPES_IDS_ATOM = atom(null, (get, set) => {
  const SHAPE_IDS_ATOM = get(CURRENT_PAGE).SHAPES.ID;
  set(SHAPE_IDS_ATOM, []);
});

export const SHAPE_SELECTED_ATOM = atom((get) => {
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);

  const planeShapes = get(PLANE_SHAPES_ATOM);

  const shapes = planeShapes
    .filter((shape) =>
      selectedIds.some(
        (selected) =>
          shape.id === selected.id &&
          get(get(shape.state).parentId) === selected.parentId
      )
    )
    .map((shape) => get(shape.state));

  return {
    shape: shapes.at(0) || null,
    shapes,
    count: shapes.length,
  };
});

export type UpdatableKeys = keyof Omit<
  ShapeState,
  "id" | "tool" | "children" | "parentId"
>;

export type ShapeUpdateAtomProps<K extends UpdatableKeys> = {
  type: UpdatableKeys;
  value: Omit<ShapeBase[K], "id" | "tool" | "children" | "parentId">;
};
export const SHAPE_UPDATE_ATOM = atom(
  null,
  <K extends UpdatableKeys>(
    get: Getter,
    set: Setter,
    args: ShapeUpdateAtomProps<K>
  ) => {
    const { type, value } = args;

    const selected = get(SHAPE_SELECTED_ATOM);
    for (const shape of selected.shapes) {
      const target = shape[type];
      if (!target) continue;
      set(target as any, value);
    }
  }
);

export const SHAPE_XD_DATA = atom(null, (get, set, args: UndoShape[]) => {
  const planeShapes = get(PLANE_SHAPES_ATOM);
  for (const element of args) {
    const find_shape = planeShapes.find((e) => e.id === element.id);

    if (!find_shape) continue;
  }
});
