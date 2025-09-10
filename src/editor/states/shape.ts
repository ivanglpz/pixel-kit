import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/shape-schema";
import { CREATE_CURRENT_ITEM_ATOM } from "./currentItem";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, IPageShapeIds, PAGE_ID_ATOM } from "./pages";
import { ALL_SHAPES, PLANE_SHAPES_ATOM } from "./shapes";
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
  const shapeSelected = get(SHAPE_IDS_ATOM).at(0);

  const shape = get(PLANE_SHAPES_ATOM)?.find(
    (e) => e?.id === shapeSelected?.id
  );

  if (!shape || !shape.state) return null;

  return get(shape?.state);
});

export const GET_SELECTED_SHAPES_ATOM = atom(null, (get, set) => {
  const rootShapes = get(PLANE_SHAPES_ATOM);
  const selectedIds = get(SHAPE_IDS_ATOM);

  if (!rootShapes) return [];

  const shapesSelected = rootShapes.filter((shape) =>
    selectedIds.some((w) => w.id === shape.id)
  );

  const recursiveCloneShape = (
    shape: ALL_SHAPES,
    parentId: string | null = null
  ): IShape => {
    const state = get(shape.state);
    const newId = uuidv4(); // Generamos un nuevo ID

    return {
      ...cloneDeep(state),
      x: state.x + 10, // desplazamiento para diferenciar
      y: state.y + 10,
      id: newId, // también en el state
      parentId, // el parentId que viene del nivel superior
      children: atom<ALL_SHAPES[]>(
        get(state.children)?.map((i) => {
          const newElement = recursiveCloneShape(i, newId);
          return {
            ...i,
            id: newElement.id,
            tool: newElement.tool,
            pageId: get(PAGE_ID_ATOM),
            state: atom(newElement),
          };
        })
      ),
    };
  };
  const newShapes = shapesSelected.map((shape) =>
    recursiveCloneShape(shape, get(shape.state).parentId)
  );
  set(CREATE_CURRENT_ITEM_ATOM, newShapes);

  return;
});
export const SHAPE_UPDATE_ATOM = atom(
  null,
  (get, set, args: Partial<IShape>) => {
    const shapeSelected = get(SHAPE_IDS_ATOM).at(0);
    const findShape = get(PLANE_SHAPES_ATOM)?.find(
      (e) =>
        e?.id === shapeSelected?.id &&
        get(e?.state).parentId === shapeSelected.parentId
    );
    if (!findShape || !findShape.state) return null;

    set(findShape?.state, { ...get(findShape.state), ...args });
  }
);
