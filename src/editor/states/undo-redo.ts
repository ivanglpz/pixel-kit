import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { IShape } from "../shapes/type.shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES, DELETE_SHAPE_ATOM } from "./shapes";

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

export const REDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  const list = get(LIST_UNDO_REDO);

  // validar si hay algo más adelante
  if (count >= list.length) return;

  const nextIndex = count; // ya que count apunta al siguiente
  const action = list[nextIndex];

  if (!action) return;

  switch (action.type) {
    case "CREATE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      for (const shape of action.shapes) {
        const newAllShape: ALL_SHAPES = {
          ...shape,
          state: atom(shape.state as IShape), // reconstruimos atom
        };

        // insertamos en la posición original
        const newShapes = [
          ...currentShapes.slice(0, shape.position),
          newAllShape,
          ...currentShapes.slice(shape.position),
        ];

        set(ALL_SHAPES_ATOM, newShapes);
      }
      break;
    }

    case "DELETE": {
      for (const shape of action.shapes) {
        set(DELETE_SHAPE_ATOM, { id: shape.id });
      }
      break;
    }

    default:
      break;
  }

  // mover puntero hacia adelante
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
      // inversa de create = eliminar
      for (const shape of action.shapes) {
        set(DELETE_SHAPE_ATOM, { id: shape.id });
      }
      break;
    }

    case "DELETE": {
      // inversa de delete = restaurar
      const currentShapes = get(ALL_SHAPES_ATOM);
      for (const shape of action.shapes) {
        const newAllShape: ALL_SHAPES = {
          ...shape,
          state: atom(shape.state as IShape),
        };

        const newShapes = [
          ...currentShapes.slice(0, shape.position),
          newAllShape,
          ...currentShapes.slice(shape.position),
        ];

        set(ALL_SHAPES_ATOM, newShapes);
      }
      break;
    }

    default:
      break;
  }

  // mover puntero hacia atrás
  set(COUNT_UNDO_REDO, prevIndex);
});
