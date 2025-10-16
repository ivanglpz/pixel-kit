import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, IPageShapeIds } from "./pages";
import { PLANE_SHAPES_ATOM } from "./shapes";
export const SHAPE_IDS_ATOM = atom(
  (get) => {
    return get(get(CURRENT_PAGE).SHAPES.ID);
  },
  (get, _set, shape: IPageShapeIds) => {
    const ids = get(CURRENT_PAGE).SHAPES.ID;
    const event = get(EVENT_ATOM);
    const listIds = get(ids);

    if (event === "MULTI_SELECT") {
      const findId = listIds?.some(
        (e) => e?.id === shape.id && e?.parentId === shape.parentId
      );

      if (findId) {
        _set(
          ids,
          listIds?.filter(
            (e) => e?.id === shape.id && e?.parentId === shape.parentId
          )
        );

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
  (get, set, args: IPageShapeIds[]) => {
    const ids = get(CURRENT_PAGE).SHAPES.ID;
    set(ids, args);
  }
);

export const RESET_SHAPES_IDS_ATOM = atom(null, (get, set) => {
  const SHAPE_IDS_ATOM = get(CURRENT_PAGE).SHAPES.ID;

  set(SHAPE_IDS_ATOM, []);
});

export const SHAPE_SELECTED_ATOM = atom((get) => {
  const shapes = get(SHAPE_IDS_ATOM);
  const shapeSelected = shapes.at(0);

  const shape = get(PLANE_SHAPES_ATOM)?.find(
    (e) => e?.id === shapeSelected?.id
  );

  if (!shape || !shape.state)
    return {
      shape: null,
      count: 0,
    };

  return {
    shape: get(shape?.state),
    count: shapes.length,
  };
});

export const SHAPE_UPDATE_ATOM = atom(
  null,
  (get, set, args: Partial<IShape>) => {
    const shapesSelected = get(SHAPE_IDS_ATOM);
    const planeShapes = get(PLANE_SHAPES_ATOM);

    shapesSelected.forEach((selected) => {
      const target = planeShapes.find(
        (shape) =>
          shape.id === selected.id &&
          get(shape.state).parentId === selected.parentId
      );

      if (target && target.state) {
        set(target.state, {
          ...get(target.state),
          ...args,
        });
      }
    });
  }
);
