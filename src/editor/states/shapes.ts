import { IShape } from "@/editor/shapes/type.shape";
import { atom, PrimitiveAtom } from "jotai";
import { CURRENT_PAGE, PAGE_ID_ATOM } from "./pages";
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
    return get(get(CURRENT_PAGE).SHAPES.LIST);
  },
  (get, set, newTool: ALL_SHAPES[]) => {
    set(get(CURRENT_PAGE).SHAPES.LIST, newTool);
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
  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;

  set(SHAPE_IDS_, []);
  set(NEW_UNDO_REDO, {
    type: "DELETE",
    shapes: selected,
  });
});

// ===== Funciones de movimiento actualizadas =====

export const MOVE_SHAPES_BY_ID = atom(null, (get, set, args: string) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);
  const selectedShapes = currentShapes.filter((w) =>
    shapesSelected.some((e) => e.id === w.id)
  );
  const FIND_SHAPE = currentShapes.find((s) => s.id === args);
  if (!FIND_SHAPE) return;

  // Guardar estado anterior para undo/redo
  const prevShapes = [...selectedShapes];

  // recrea un árbol fresco con atom nuevos
  const cloneShapeRecursive = (
    shape: ALL_SHAPES,
    parentId: string
  ): ALL_SHAPES => {
    return {
      id: shape.id,
      pageId: shape.pageId,
      tool: shape.tool,
      state: atom<IShape>({
        ...get(shape.state),
        parentId,
        children: atom(
          get(get(shape.state).children).map((c) =>
            cloneShapeRecursive(c, shape.id)
          )
        ),
      }),
    };
  };

  const result = selectedShapes.map((s) =>
    cloneShapeRecursive(s, get(FIND_SHAPE.state).id)
  );

  // agregar nuevos hijos con referencia fresca
  set(FIND_SHAPE.state, {
    ...get(FIND_SHAPE.state),
    children: atom([...get(get(FIND_SHAPE.state).children), ...result]),
  });

  // remover de donde estaban antes
  for (const element of shapesSelected) {
    if (element.parentId) {
      const parent = currentShapes.find((r) => r.id === element.parentId);
      if (!parent) continue;
      set(parent.state, {
        ...get(parent.state),
        children: atom(
          get(get(parent.state).children).filter((u) => u.id !== element.id)
        ),
      });
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }

  // Registrar la acción MOVE para undo/redo

  set(NEW_UNDO_REDO, {
    type: "MOVE",
    shapes: result,
    prevShapes: prevShapes,
  });
});

export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
  const SELECTED = get(SHAPE_IDS_ATOM);
  const selectedShapes = PLANE_SHAPES.filter((w) =>
    SELECTED.some((e) => e.id === w.id)
  );

  // Guardar estado anterior para undo/redo
  const prevShapes = [...selectedShapes];

  const cloneShapeRecursive = (shape: ALL_SHAPES): ALL_SHAPES => {
    return {
      id: shape.id,
      pageId: shape.pageId,
      tool: shape.tool,
      state: atom<IShape>({
        ...get(shape.state),
        parentId: null,
        children: atom(get(get(shape.state).children).map(cloneShapeRecursive)),
      }),
    };
  };

  const result = selectedShapes.map(cloneShapeRecursive);

  // quitar de sus padres
  for (const element of SELECTED) {
    if (element.parentId) {
      const parent = PLANE_SHAPES.find((r) => r.id === element.parentId);
      if (!parent) continue;
      set(parent.state, {
        ...get(parent.state),
        children: atom(
          get(get(parent.state).children).filter((u) => u.id !== element.id)
        ),
      });
    }
  }

  // añadir al root con átomos frescos
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), ...result]);

  // Registrar la acción MOVE para undo/redo
  set(NEW_UNDO_REDO, {
    type: "MOVE",
    shapes: result,
    prevShapes: prevShapes,
  });
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
