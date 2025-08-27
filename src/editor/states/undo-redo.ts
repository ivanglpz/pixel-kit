import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/startEvent";
import { IShape } from "../shapes/type.shape";
import { PROJECT_ATOM } from "./projects";
import { ADD_SHAPE_ID_ATOM } from "./shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES } from "./shapes";

export type UNDO_SHAPE = Omit<ALL_SHAPES, "state"> & {
  state: IShape;
};
export type UNDO_REDO_PROPS = {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "INITIAL" | "CLEAR_ALL";
  shapes: UNDO_SHAPE[];
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

export const NEW_UNDO_REDO = atom(
  null,
  (get, set, args: Omit<UNDO_REDO_PROPS, "id">) => {
    const list = get(LIST_UNDO_REDO);
    const count = get(COUNT_UNDO_REDO);

    // Truncar cualquier redo que exista más allá del puntero actual
    const newList = list.slice(0, count);

    const newUndo: UNDO_REDO_PROPS = {
      ...args,
      id: uuidv4(),
      type: args.type,
      shapes: args?.shapes?.map((e) => cloneDeep(e)),
    };
    // Agregar el nuevo registro
    set(LIST_UNDO_REDO, [...newList, newUndo]);

    // Mover el puntero al final del nuevo historial
    set(COUNT_UNDO_REDO, newList.length + 1);
  }
);

export const UPDATE_UNDO_REDO = atom(null, (get, set) => {
  const shapeIds = get(ADD_SHAPE_ID_ATOM);
  const allShapes = get(ALL_SHAPES_ATOM);

  // shapes seleccionados en este momento
  const selected = allShapes.filter((e) => shapeIds.includes(e.id));

  // preparar shapes para guardar en undo/redo
  const undoShapes: UNDO_SHAPE[] = selected.map((s) => ({
    ...s,
    state: cloneDeep(get(s.state)), // guardamos el estado actual del atom
  }));

  // registrar acción de tipo UPDATE
  set(NEW_UNDO_REDO, {
    type: "UPDATE",
    shapes: undoShapes,
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

      for (const shape of action.shapes) {
        const newAllShape: ALL_SHAPES = {
          ...shape,
          state: atom(cloneDeep(shape.state) as IShape),
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

    case "UPDATE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      const newShapes = currentShapes.map((s) => {
        const updated = action.shapes.find((u) => u.id === s.id);
        if (!updated) return s;
        return {
          ...updated,
          state: atom(cloneDeep(updated.state) as IShape),
        };
      });
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
          state: atom(cloneDeep(shape.state) as IShape),
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

    case "UPDATE": {
      const currentShapes = get(ALL_SHAPES_ATOM);
      const newShapes = currentShapes.map((s) => {
        const old = action.shapes.find((u) => u.id === s.id);
        if (!old) return s;
        return {
          ...old,
          state: atom(cloneDeep(old.state) as IShape),
        };
      });
      set(ALL_SHAPES_ATOM, newShapes);
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, prevIndex);
});
