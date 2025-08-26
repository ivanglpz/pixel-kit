import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { IShape } from "../shapes/type.shape";
import { ALL_SHAPES } from "./shapes";

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
