import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { IShape } from "../shapes/type.shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES } from "./shapes";

type UNDO_SHAPE = Omit<ALL_SHAPES, "state"> & {
  state: IShape;
};
type UNDO_REDO_PROPS = {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "INITIAL" | "CLEAR_ALL";
  shapes: UNDO_SHAPE[];
};

export const COUNT_UNDO_REDO = atom<number>(0);
export const LIST_UNDO_REDO = atom<UNDO_REDO_PROPS[]>([]);

export const NEW_UNDO_REDO = atom(
  null,
  (get, set, args: Omit<UNDO_REDO_PROPS, "id">) => {
    const list = get(LIST_UNDO_REDO);
    const count = get(COUNT_UNDO_REDO);

    // Truncar cualquier redo que exista más allá del puntero actual
    const newList = list.slice(0, count);

    const newUndo: UNDO_REDO_PROPS = { ...args, id: uuidv4(), type: args.type };
    // Agregar el nuevo registro
    set(LIST_UNDO_REDO, [...newList, newUndo]);

    // Mover el puntero al final del nuevo historial
    set(COUNT_UNDO_REDO, newList.length + 1);
  }
);

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

      for (const shape of action.shapes) {
        const newAllShape: ALL_SHAPES = {
          ...shape,
          state: atom(shape.state as IShape),
        };

        newShapes = [
          ...newShapes.slice(0, shape.position),
          newAllShape,
          ...newShapes.slice(shape.position),
        ];
      }

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

      for (const shape of action.shapes) {
        const newAllShape: ALL_SHAPES = {
          ...shape,
          state: atom(shape.state as IShape),
        };

        newShapes = [
          ...newShapes.slice(0, shape.position),
          newAllShape,
          ...newShapes.slice(shape.position),
        ];
      }

      set(ALL_SHAPES_ATOM, newShapes);
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, prevIndex);
});
