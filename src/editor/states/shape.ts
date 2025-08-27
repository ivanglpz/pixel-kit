import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/startEvent";
import { EVENT_ATOM } from "./event";
import { IPageShapeIds, PAGE_ID_ATOM } from "./pages";
import { PROJECT_ATOM } from "./projects";
import ALL_SHAPES_ATOM, { ALL_SHAPES, PLANE_SHAPES_ATOM } from "./shapes";
export const SHAPE_IDS_ATOM = atom(
  (get) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("SHAPE_IDS_ATOM_GET: Page not found");
    }
    return get(FIND_PAGE.SHAPE.ID);
  },
  (get, _set, shape: IPageShapeIds) => {
    // const ids = get(PROJECT_ATOM).SHAPE.ID;
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("SHAPE_IDS_ATOM_SET: Page not found");
    }
    const ids = FIND_PAGE.SHAPE.ID;
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
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("UPDATE_SHAPES_IDS_ATOM_GET: Page not found");
    }
    const ids = FIND_PAGE.SHAPE.ID;

    set(ids, args);
  }
);

export const REMOVE_SHAPE_ID_ATOM = atom(
  null,
  (get, set, args: IPageShapeIds) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("REMOVE_SHAPE_ID_ATOM_GET: Page not found");
    }
    const ids = FIND_PAGE.SHAPE.ID;

    const listIds = get(FIND_PAGE.SHAPE.ID);

    set(
      ids,
      listIds?.filter((e) => e?.id === args.id && e?.parentId === args.parentId)
    );
  }
);
export const RESET_SHAPES_IDS_ATOM = atom(null, (get, set) => {
  const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
  const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
  if (!FIND_PAGE) {
    throw new Error("RESET_SHAPES_IDS_ATOM_GET: Page not found");
  }
  const ids = FIND_PAGE.SHAPE.ID;

  set(ids, []);
});

export const SHAPE_SELECTED_ATOM = atom((get) => {
  const shapeSelected = get(SHAPE_IDS_ATOM).at(0);

  const shape = get(PLANE_SHAPES_ATOM)?.find(
    (e) =>
      e?.id === shapeSelected?.id &&
      get(e?.state).parentId === shapeSelected.parentId
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
  ): ALL_SHAPES => {
    const state = get(shape.state);
    const newId = uuidv4(); // Generamos un nuevo ID

    // Clonamos los children recursivamente pasando el nuevo ID como parentId
    const updatedChildren = get(state.children).map((child) =>
      recursiveCloneShape(child, newId)
    );

    return {
      ...shape,
      id: newId, // asignamos el nuevo ID
      state: atom({
        ...cloneDeep(state),
        id: newId, // también en el state
        parentId, // el parentId que viene del nivel superior
        children: atom(updatedChildren),
      }),
    };
  };
  const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
  const newShapes = shapesSelected.map((shape) =>
    recursiveCloneShape(shape, get(shape.state).parentId)
  );

  for (const element of newShapes) {
    if (get(element.state).parentId) {
      const FIND_SHAPE = PLANE_SHAPES?.find(
        (w) => w.id === get(element.state).parentId
      );
      if (!FIND_SHAPE) continue;
      const children = get(FIND_SHAPE.state).children;
      set(children, [...get(children), element]);
    } else {
      set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), element]);
    }
  }

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
