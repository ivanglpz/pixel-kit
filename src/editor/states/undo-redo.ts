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
      const idsToDelete = action.shapes.map((s) => s.id);
      set(
        ALL_SHAPES_ATOM,
        currentShapes.filter((s) => !idsToDelete.includes(s.id))
      );
      break;
    }

    case "UPDATE": {
      const updatedShapes = currentShapes.map((s) => {
        const update = action.shapes.find((u) => u.id === s.id);
        if (!update) return s;
        return convertUndoShapeToAllShapes(update);
      });
      set(ALL_SHAPES_ATOM, updatedShapes);
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
      const restoredShapes: ALL_SHAPES[] = action.shapes.map(
        convertUndoShapeToAllShapes
      );
      set(ALL_SHAPES_ATOM, [...currentShapes, ...restoredShapes]);
      break;
    }

    case "UPDATE": {
      const revertedShapes = currentShapes.map((s) => {
        const update = action.shapes.find((u) => u.id === s.id);
        if (!update) return s;
        return convertUndoShapeToAllShapes(update);
      });
      set(ALL_SHAPES_ATOM, revertedShapes);
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, count - 1);
});
