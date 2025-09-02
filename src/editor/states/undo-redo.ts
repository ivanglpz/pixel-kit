import { atom, Getter, Setter } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/startEvent";
import { IShape } from "../shapes/type.shape";
import { PAGE_BY_MODE } from "./pages";
import { SHAPE_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES, PLANE_SHAPES_ATOM } from "./shapes";

export type UNDO_SHAPE = Omit<ALL_SHAPES, "state" | "children"> & {
  state: Omit<IShape, "children"> & {
    children: UNDO_SHAPE[];
  };
};

export type UNDO_REDO_PROPS = {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "INITIAL" | "CLEAR_ALL" | "MOVE";
  shapes: UNDO_SHAPE[];
  prevShapes?: UNDO_SHAPE[]; // Estado anterior para operaciones MOVE
};

export type UNDO_SHAPE_VALUES = Omit<
  UNDO_REDO_PROPS,
  "id" | "shapes" | "prevShapes"
> & {
  shapes: ALL_SHAPES[];
  prevShapes?: ALL_SHAPES[];
};

export const COUNT_UNDO_REDO = atom(
  (get) => {
    return get(get(PAGE_BY_MODE).UNDOREDO.COUNT_UNDO_REDO);
  },
  (get, _set, shape: number) => {
    return _set(get(PAGE_BY_MODE).UNDOREDO.COUNT_UNDO_REDO, shape);
  }
);

export const LIST_UNDO_REDO = atom(
  (get) => {
    return get(get(PAGE_BY_MODE).UNDOREDO.LIST_UNDO_REDO);
  },
  (get, _set, shape: UNDO_REDO_PROPS[]) => {
    return _set(get(PAGE_BY_MODE).UNDOREDO.LIST_UNDO_REDO, shape);
  }
);

export const NEW_UNDO_REDO = atom(null, (get, set, args: UNDO_SHAPE_VALUES) => {
  const list = get(LIST_UNDO_REDO);
  const count = get(COUNT_UNDO_REDO);

  // Truncar cualquier redo que exista más allá del puntero actual
  const newList = list.slice(0, count);

  const cloneShapeRecursive = (shape: ALL_SHAPES): UNDO_SHAPE => {
    const children = get(get(shape.state).children);
    return {
      ...shape,
      state: {
        ...cloneDeep(get(shape.state)),
        children: children?.map(cloneShapeRecursive) ?? [],
      },
    };
  };

  const newUndo: UNDO_REDO_PROPS = {
    ...args,
    id: uuidv4(),
    type: args.type,
    shapes: args.shapes.map(cloneShapeRecursive),
    prevShapes: args.prevShapes?.map(cloneShapeRecursive),
  };

  set(LIST_UNDO_REDO, [...newList, newUndo]);
  set(COUNT_UNDO_REDO, newList.length + 1);
});

export const UPDATE_UNDO_REDO = atom(null, (get, set) => {
  const shapeIds = get(SHAPE_IDS_ATOM);
  const allShapes = get(PLANE_SHAPES_ATOM);

  const selected = allShapes.filter((e) => shapeIds.some((w) => w.id === e.id));

  // registrar acción de tipo UPDATE
  set(NEW_UNDO_REDO, {
    type: "UPDATE",
    shapes: selected,
  });
});

// ===== Helper recursive converter =====
const convertUndoShapeToAllShapes = (undoShape: UNDO_SHAPE): ALL_SHAPES => {
  const convertChildren = (children: UNDO_SHAPE[]): ALL_SHAPES[] =>
    children.map((child) => convertUndoShapeToAllShapes(child));

  return {
    id: undoShape.id,
    pageId: undoShape.pageId,
    tool: undoShape.tool,
    state: atom<IShape>({
      ...cloneDeep(undoShape.state),
      children: atom(convertChildren(undoShape.state.children)),
    }),
  } as ALL_SHAPES;
};

// ===== Helper para restaurar shapes en sus posiciones originales =====
const restoreShapesToOriginalPositions = (
  get: Getter,
  set: Setter,
  shapesToRestore: UNDO_SHAPE[]
) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);

  for (const element of shapesToRestore) {
    if (element.state.parentId) {
      // Restaurar como hijo de un elemento específico
      const PARENT_SHAPE = currentShapes.find(
        (w) => w.id === element.state.parentId
      );
      if (!PARENT_SHAPE) continue;

      const convertedShape = convertUndoShapeToAllShapes(element);

      set(PARENT_SHAPE.state, {
        ...get(PARENT_SHAPE.state),
        children: atom([
          ...get(get(PARENT_SHAPE.state).children),
          convertedShape,
        ]),
      });
    } else {
      // Restaurar en el root
      const convertedShape = convertUndoShapeToAllShapes(element);
      set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), convertedShape]);
    }
  }
};

// ===== Helper para remover shapes de sus posiciones actuales =====
const removeShapesFromCurrentPositions = (
  get: Getter,
  set: Setter,
  shapesToRemove: UNDO_SHAPE[]
) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);

  for (const element of shapesToRemove) {
    // Buscar la shape actual para obtener su parentId actual
    const currentShape = currentShapes.find((s) => s.id === element.id);
    if (!currentShape) continue;

    const currentParentId = get(currentShape.state).parentId;

    if (currentParentId) {
      // Remover del padre actual
      const CURRENT_PARENT = currentShapes.find(
        (w) => w.id === currentParentId
      );
      if (!CURRENT_PARENT) continue;

      set(CURRENT_PARENT.state, {
        ...get(CURRENT_PARENT.state),
        children: atom(
          get(get(CURRENT_PARENT.state).children).filter(
            (w) => w.id !== element.id
          )
        ),
      });
    } else {
      // Remover del root
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((w) => w.id !== element.id)
      );
    }
  }
};

// ========== REDO ==========
export const REDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  const list = get(LIST_UNDO_REDO);

  if (count >= list.length) return;

  const action = list[count];
  if (!action) return;

  const currentShapes = get(PLANE_SHAPES_ATOM);

  switch (action.type) {
    case "CREATE": {
      const newShapes: ALL_SHAPES[] = action.shapes.map(
        convertUndoShapeToAllShapes
      );
      set(ALL_SHAPES_ATOM, [...currentShapes, ...newShapes]);
      break;
    }

    case "DELETE": {
      for (const element of action.shapes) {
        if (element.state.parentId) {
          const FIND_SHAPE = currentShapes.find(
            (w) => w.id === element.state.parentId
          );
          if (!FIND_SHAPE) continue;
          set(FIND_SHAPE.state, {
            ...get(FIND_SHAPE.state),
            children: atom(
              get(get(FIND_SHAPE.state).children).filter(
                (w) => w.id !== element.state.id
              )
            ),
          });
        } else {
          set(
            ALL_SHAPES_ATOM,
            get(ALL_SHAPES_ATOM).filter((w) => w.id !== element.state.id)
          );
        }
      }
      break;
    }

    case "UPDATE": {
      const currentShapes = get(PLANE_SHAPES_ATOM);

      for (const element of action.shapes) {
        if (element.state.parentId) {
          const FIND_SHAPE = currentShapes.find(
            (w) => w.id === element.state.parentId
          );
          if (!FIND_SHAPE) continue;

          const result = element.state.children.map(
            convertUndoShapeToAllShapes
          );

          const payload: IShape = {
            ...element.state,
            children: atom(result),
          };

          set(FIND_SHAPE.state, {
            ...get(FIND_SHAPE.state),
            children: atom(
              get(get(FIND_SHAPE.state).children).map((w) => {
                if (w.id === payload.id) {
                  return {
                    ...w,
                    state: atom(payload),
                  };
                }
                return w;
              })
            ),
          });
        } else {
          const FIND_SHAPE = currentShapes.find(
            (w) => w.id === element.state.id
          );

          if (!FIND_SHAPE) continue;

          const result = element.state.children.map(
            convertUndoShapeToAllShapes
          );

          const payload: IShape = {
            ...element.state,
            children: atom(result),
          };

          set(FIND_SHAPE.state, {
            ...cloneDeep(element.state),
            children: atom(result),
          });
        }
      }
      break;
    }

    case "MOVE": {
      // Para REDO de MOVE: aplicar el estado final (shapes)
      if (!action.prevShapes) break;

      // Primero remover de posiciones anteriores usando prevShapes
      removeShapesFromCurrentPositions(get, set, action.prevShapes);

      // Luego restaurar en nuevas posiciones usando shapes
      restoreShapesToOriginalPositions(get, set, action.shapes);
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, count + 1);
});

// ========== UNDO ==========
export const UNDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  if (count <= 0) return;

  const action = get(LIST_UNDO_REDO)[count - 1];
  if (!action) return;

  const currentShapes = get(PLANE_SHAPES_ATOM);

  switch (action.type) {
    case "CREATE": {
      const idsToDelete = action.shapes.map((s) => s.id);
      set(
        ALL_SHAPES_ATOM,
        currentShapes.filter((s) => !idsToDelete.includes(s.id))
      );
      break;
    }

    case "DELETE": {
      for (const element of action.shapes) {
        if (element.state.parentId) {
          const FIND_SHAPE = currentShapes.find(
            (w) => w.id === element.state.parentId
          );
          if (!FIND_SHAPE) continue;

          const result = element.state.children.map(
            convertUndoShapeToAllShapes
          );

          const payload: IShape = {
            ...element.state,
            children: atom(result),
          };

          set(FIND_SHAPE.state, {
            ...get(FIND_SHAPE.state),
            children: atom([
              ...get(get(FIND_SHAPE.state).children),
              {
                ...element,
                state: atom(payload),
              },
            ]),
          });
        } else {
          const result = element.state.children.map(
            convertUndoShapeToAllShapes
          );

          const payload: IShape = {
            ...element.state,
            children: atom(result),
          };

          set(ALL_SHAPES_ATOM, [
            ...get(ALL_SHAPES_ATOM),
            {
              ...element,
              state: atom(payload),
            },
          ]);
        }
      }
      break;
    }

    case "UPDATE": {
      const currentShapes = get(PLANE_SHAPES_ATOM);

      for (const element of action.shapes) {
        if (element.state.parentId) {
          const FIND_SHAPE = currentShapes.find(
            (w) => w.id === element.state.parentId
          );
          if (!FIND_SHAPE) continue;

          const result = element.state.children.map(
            convertUndoShapeToAllShapes
          );

          const payload: IShape = {
            ...element.state,
            children: atom(result),
          };

          set(FIND_SHAPE.state, {
            ...cloneDeep(element.state),
            children: atom(
              get(get(FIND_SHAPE.state).children).map((w) => {
                if (w.id === payload.id) {
                  return {
                    ...w,
                    state: atom(payload),
                  };
                }
                return w;
              })
            ),
          });
        } else {
          const FIND_SHAPE = currentShapes.find(
            (w) => w.id === element.state.id
          );

          if (!FIND_SHAPE) continue;

          const result = element.state.children.map(
            convertUndoShapeToAllShapes
          );

          const payload: IShape = {
            ...element.state,
            children: atom(result),
          };

          set(FIND_SHAPE.state, {
            ...cloneDeep(element.state),
            children: atom(result),
          });
        }
      }
      break;
    }

    case "MOVE": {
      // Para UNDO de MOVE: restaurar el estado anterior (prevShapes)
      if (!action.prevShapes) break;

      // Primero remover de posiciones actuales usando shapes
      removeShapesFromCurrentPositions(get, set, action.shapes);

      // Luego restaurar en posiciones originales usando prevShapes
      restoreShapesToOriginalPositions(get, set, action.prevShapes);
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, count - 1);
});
