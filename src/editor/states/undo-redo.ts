import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/startEvent";
import { IShape } from "../shapes/type.shape";
import { PAGE_ID_ATOM } from "./pages";
import { PROJECT_ATOM } from "./projects";
import { SHAPE_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES, PLANE_SHAPES_ATOM } from "./shapes";

export type UNDO_SHAPE = Omit<ALL_SHAPES, "state" | "children"> & {
  state: Omit<IShape, "children"> & {
    children: UNDO_SHAPE[];
  };
};

export type UNDO_REDO_PROPS = {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "INITIAL" | "CLEAR_ALL";
  shapes: UNDO_SHAPE[];
};

export type UNDO_SHAPE_VALUES = Omit<UNDO_REDO_PROPS, "id" | "shapes"> & {
  shapes: ALL_SHAPES[];
};

export const COUNT_UNDO_REDO = atom(
  (get) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("COUNT_UNDO_REDO_GET: Page not found");
    }
    return get(FIND_PAGE.UNDOREDO.COUNT_UNDO_REDO);
  },
  (get, _set, shape: number) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("COUNT_UNDO_REDO_SET: Page not found");
    }
    return _set(FIND_PAGE.UNDOREDO.COUNT_UNDO_REDO, shape);
  }
);
export const LIST_UNDO_REDO = atom(
  (get) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("COUNT_UNDO_REDO_GET: Page not found");
    }
    return get(FIND_PAGE.UNDOREDO.LIST_UNDO_REDO);
  },
  (get, _set, shape: UNDO_REDO_PROPS[]) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("COUNT_UNDO_REDO_SET: Page not found");
    }
    return _set(FIND_PAGE.UNDOREDO.LIST_UNDO_REDO, shape);
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

// UNDO = IR HACIA ATRÁS

// Deshace la última acción que hiciste
// Regresa al estado anterior
// Reduce el contador (count - 1)
// REDO = IR HACIA ADELANTE

// Rehace la acción que acabas de deshacer
// Avanza al estado siguiente
// Aumenta el contador (count + 1)

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

          const convertUndoShapeToAllShapes = (
            undoShape: UNDO_SHAPE
          ): ALL_SHAPES => {
            return {
              id: undoShape.id,
              pageId: undoShape.pageId,
              tool: undoShape.tool,
              state: atom<IShape>({
                ...undoShape.state,
                children: atom(
                  undoShape.state.children.map(convertUndoShapeToAllShapes)
                ),
              }),
            } as ALL_SHAPES;
          };
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

          const convertUndoShapeToAllShapes = (
            undoShape: UNDO_SHAPE
          ): ALL_SHAPES => {
            return {
              id: undoShape.id,
              pageId: undoShape.pageId,
              tool: undoShape.tool,
              state: atom<IShape>({
                ...undoShape.state,
                children: atom(
                  undoShape.state.children.map(convertUndoShapeToAllShapes)
                ),
              }),
            } as ALL_SHAPES;
          };
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
        }
      }

      break;
    }
    default:
      break;
  }

  set(COUNT_UNDO_REDO, count + 1);
});

// UNDO = IR HACIA ATRÁS

// Deshace la última acción que hiciste
// Regresa al estado anterior
// Reduce el contador (count - 1)
// REDO = IR HACIA ADELANTE

// Rehace la acción que acabas de deshacer
// Avanza al estado siguiente
// Aumenta el contador (count + 1)
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

          const convertUndoShapeToAllShapes = (
            undoShape: UNDO_SHAPE
          ): ALL_SHAPES => {
            return {
              id: undoShape.id,
              pageId: undoShape.pageId,
              tool: undoShape.tool,
              state: atom<IShape>({
                ...undoShape.state,
                children: atom(
                  undoShape.state.children.map(convertUndoShapeToAllShapes)
                ),
              }),
            } as ALL_SHAPES;
          };
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
          const convertUndoShapeToAllShapes = (
            undoShape: UNDO_SHAPE
          ): ALL_SHAPES => {
            return {
              id: undoShape.id,
              pageId: undoShape.pageId,
              tool: undoShape.tool,
              state: atom<IShape>({
                ...undoShape.state,
                children: atom(
                  undoShape.state.children.map(convertUndoShapeToAllShapes)
                ),
              }),
            } as ALL_SHAPES;
          };
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

          const convertUndoShapeToAllShapes = (
            undoShape: UNDO_SHAPE
          ): ALL_SHAPES => {
            return {
              id: undoShape.id,
              pageId: undoShape.pageId,
              tool: undoShape.tool,
              state: atom<IShape>({
                ...undoShape.state,
                children: atom(
                  undoShape.state.children.map(convertUndoShapeToAllShapes)
                ),
              }),
            } as ALL_SHAPES;
          };
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

          const convertUndoShapeToAllShapes = (
            undoShape: UNDO_SHAPE
          ): ALL_SHAPES => {
            return {
              id: undoShape.id,
              pageId: undoShape.pageId,
              tool: undoShape.tool,
              state: atom<IShape>({
                ...undoShape.state,
                children: atom(
                  undoShape.state.children.map(convertUndoShapeToAllShapes)
                ),
              }),
            } as ALL_SHAPES;
          };
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
        }
      }

      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, count - 1);
});

// UNDO = IR HACIA ATRÁS

// Deshace la última acción que hiciste
// Regresa al estado anterior
// Reduce el contador (count - 1)
// REDO = IR HACIA ADELANTE

// Rehace la acción que acabas de deshacer
// Avanza al estado siguiente
// Aumenta el contador (count + 1)
