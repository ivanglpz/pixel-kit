import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/startEvent";
import { IShape } from "../shapes/type.shape";
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
  (get) => get(get(PROJECT_ATOM).UNDOREDO.COUNT_UNDO_REDO),
  (_get, _set, newTool: number) => {
    const toolAtom = _get(PROJECT_ATOM).UNDOREDO.COUNT_UNDO_REDO;
    _set(toolAtom, newTool);
  }
);
export const LIST_UNDO_REDO = atom(
  (get) => get(get(PROJECT_ATOM).UNDOREDO.LIST_UNDO_REDO),
  (_get, _set, newTool: UNDO_REDO_PROPS[]) => {
    const toolAtom = _get(PROJECT_ATOM).UNDOREDO.LIST_UNDO_REDO;
    _set(toolAtom, newTool);
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

// ========== REDO ==========
export const REDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  const list = get(LIST_UNDO_REDO);

  if (count >= list.length) return;

  const nextIndex = count;
  const action = list[nextIndex];
  if (!action) return;

  switch (action.type) {
    case "CREATE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      let newShapes = [...currentShapes];

      set(ALL_SHAPES_ATOM, newShapes);
      break;
    }

    case "DELETE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      const idsToDelete = action.shapes.map((s) => s.id);
      const newShapes = currentShapes.filter(
        (s) => !idsToDelete.includes(s.id)
      );
      set(ALL_SHAPES_ATOM, newShapes);
      break;
    }

    case "UPDATE": {
      const currentShapes = get(PLANE_SHAPES_ATOM);

      // const newShapes = currentShapes.map((s) => {
      //   const updated = action.shapes.find((u) => u.id === s.id);
      //   if (!updated) return s;
      //   return {
      //     ...updated,
      //     state: atom(cloneDeep(updated.state) as IShape),
      //   };
      // });
      // set(ALL_SHAPES_ATOM, newShapes);
      // break;
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

  const prevIndex = count - 1;
  const action = get(LIST_UNDO_REDO)[prevIndex];
  if (!action) return;

  switch (action.type) {
    case "CREATE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      const idsToDelete = action.shapes.map((s) => s.id);
      const newShapes = currentShapes.filter(
        (s) => !idsToDelete.includes(s.id)
      );
      set(ALL_SHAPES_ATOM, newShapes);
      break;
    }

    case "DELETE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      let newShapes = [...currentShapes];

      // for (const shape of action.shapes) {
      //   const newAllShape: ALL_SHAPES = {
      //     ...shape,
      //     state: atom(cloneDeep(shape.state) as IShape),
      //   };

      //   newShapes = [
      //     ...newShapes.slice(0, shape.position),
      //     newAllShape,
      //     ...newShapes.slice(shape.position),
      //   ];
      // }

      set(ALL_SHAPES_ATOM, newShapes);
      break;
    }

    case "UPDATE": {
      const currentShapes = get(PLANE_SHAPES_ATOM);
      console.log(action, "action");

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

          console.log(FIND_SHAPE, "FIND_SHAPE");

          console.log(payload, "payload");

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
          console.log(FIND_SHAPE, "FIND_SHAPE");

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

          // const payload: IShape = {
          //   ...element.state,
          //   children: atom(result),
          // };
          // set(FIND_SHAPE.state, {
          //   ...get(FIND_SHAPE.state),
          //   children: atom(
          //     get(get(FIND_SHAPE.state).children).map((w) => {
          //       if (w.id === payload.id) {
          //         return {
          //           ...w,
          //           state: atom(payload),
          //         };
          //       }
          //       return w;
          //     })
          //   ),
          // });
        }
      }

      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, prevIndex);
});
