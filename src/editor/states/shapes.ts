import { IShape } from "@/editor/shapes/type.shape";
import { atom, PrimitiveAtom } from "jotai";
import { PAGE_ID_ATOM } from "./pages";
import { PROJECT_ATOM } from "./projects";
import { SHAPE_IDS_ATOM } from "./shape";
import { IKeyMethods } from "./tool";
import { NEW_UNDO_REDO } from "./undo-redo";

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IKeyMethods;
  pageId: string;
  state: PrimitiveAtom<IShape> & WithInitialValue<IShape>;
};

export const ALL_SHAPES_ATOM = atom(
  (get) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("Page  shapes is require");
    }
    return get(FIND_PAGE.SHAPE.LIST);
  },
  (get, set, newTool: ALL_SHAPES[]) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("Page  shapes is require");
    }
    set(FIND_PAGE.SHAPE.LIST, newTool);
    return;
  }
);

export const PLANE_SHAPES_ATOM = atom((get) => {
  const getAllShapes = (nodes: ALL_SHAPES[]): ALL_SHAPES[] =>
    nodes.flatMap((node) => {
      const children =
        get(get(node.state).children).length > 0
          ? getAllShapes(get(get(node.state).children) as ALL_SHAPES[])
          : [];
      return [{ ...node }, ...children];
    });

  return getAllShapes(get(ALL_SHAPES_ATOM));
});

export const DELETE_SHAPES_ATOM = atom(null, (get, set) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);

  for (const element of shapesSelected) {
    if (element.parentId) {
      const FIND_SHAPE = currentShapes.find((w) => w.id === element.parentId);

      if (!FIND_SHAPE) continue;
      set(FIND_SHAPE.state, {
        ...get(FIND_SHAPE.state),
        children: atom(
          get(get(FIND_SHAPE.state).children).filter((e) => e.id !== element.id)
        ),
      });
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }
  const selected = currentShapes.filter((e) =>
    shapesSelected.some((w) => w.id === e.id)
  );

  // registrar acción de tipo UPDATE
  set(NEW_UNDO_REDO, {
    type: "DELETE",
    shapes: selected,
  });
});

export const MOVE_SHAPES_BY_ID = atom(null, (get, set, args: string) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);
  const selectedShapes = currentShapes.filter((w) =>
    shapesSelected.some((e) => e.id === w.id)
  );
  const FIND_SHAPE = currentShapes.find((s) => s.id === args);
  if (!FIND_SHAPE) return;

  const convertUndoShapeToAllShapes = (undoShape: ALL_SHAPES): ALL_SHAPES => {
    return {
      id: undoShape.id,
      pageId: undoShape.pageId,
      tool: undoShape.tool,
      state: atom<IShape>({
        ...get(undoShape.state),
        parentId: get(FIND_SHAPE.state).parentId,
        children: atom(
          get(get(undoShape.state).children).map(convertUndoShapeToAllShapes)
        ),
      }),
    } as ALL_SHAPES;
  };
  const result = selectedShapes.map(convertUndoShapeToAllShapes);

  set(FIND_SHAPE.state, {
    ...get(FIND_SHAPE.state),
    children: atom(get(get(FIND_SHAPE.state).children).concat(result)),
  });

  for (const element of shapesSelected) {
    if (element.parentId) {
      const FIND_SHAPE = currentShapes.find((r) => r.id === element.parentId);
      if (!FIND_SHAPE) continue;

      set(FIND_SHAPE.state, {
        ...get(FIND_SHAPE.state),
        children: atom(
          get(get(FIND_SHAPE.state).children).filter((u) => u.id !== element.id)
        ),
      });
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }
});
export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);
  const selectedShapes = currentShapes.filter((w) =>
    shapesSelected.some((e) => e.id === w.id)
  );

  const convertUndoShapeToAllShapes = (undoShape: ALL_SHAPES): ALL_SHAPES => {
    return {
      id: undoShape.id,
      pageId: undoShape.pageId,
      tool: undoShape.tool,
      state: atom<IShape>({
        ...get(undoShape.state),
        parentId: null,
        children: atom(
          get(get(undoShape.state).children).map(convertUndoShapeToAllShapes)
        ),
      }),
    } as ALL_SHAPES;
  };
  const result = selectedShapes.map(convertUndoShapeToAllShapes);

  set(ALL_SHAPES_ATOM, get(ALL_SHAPES_ATOM).concat(result));

  for (const element of shapesSelected) {
    if (element.parentId) {
      const FIND_SHAPE = currentShapes.find((r) => r.id === element.parentId);
      if (!FIND_SHAPE) continue;

      set(FIND_SHAPE.state, {
        ...get(FIND_SHAPE.state),
        children: atom(
          get(get(FIND_SHAPE.state).children).filter((u) => u.id !== element.id)
        ),
      });
    }
  }
});

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: IShape) => {
  if (!args || !args?.id) return;
  const newAllShape: ALL_SHAPES = {
    id: args?.id,
    tool: args?.tool,
    state: atom({
      ...args,
      children: atom(
        args?.children ? get(args.children) : ([] as ALL_SHAPES[])
      ),
    }),
    pageId: get(PAGE_ID_ATOM),
  };
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
  set(NEW_UNDO_REDO, {
    shapes: [newAllShape],
    type: "CREATE",
  });
});

export default ALL_SHAPES_ATOM;
