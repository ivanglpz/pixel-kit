import { atom, Getter, Setter } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/shape-schema";
import { flexLayoutAtom } from "../shapes/layout-flex";
import { IShape } from "../shapes/type.shape";
import { CURRENT_PAGE } from "./pages";
import { SHAPE_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES, PLANE_SHAPES_ATOM } from "./shapes";

// ===== TYPES =====
export type UndoShape = Omit<ALL_SHAPES, "state" | "children"> & {
  state: Omit<IShape, "children"> & { children: UndoShape[] };
};

export type ActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "INITIAL"
  | "CLEAR_ALL"
  | "MOVE"
  | "GROUPING";

export type UndoRedoAction = {
  id: string;
  type: ActionType;
  shapes: UndoShape[];
  prevShapes?: UndoShape[];
};

export type UndoShapeValues = {
  type: ActionType;
  shapes: ALL_SHAPES[];
  prevShapes?: ALL_SHAPES[];
};

export type MoveOperation = {
  movedShapes: string[];
  newParentId?: string;
};

// ===== PURE HELPERS =====
const findShapeById = (
  shapes: ALL_SHAPES[],
  id: string
): ALL_SHAPES | undefined => shapes.find((shape) => shape.id === id);

const filterShapesExcluding = (
  shapes: ALL_SHAPES[],
  excludeIds: string[]
): ALL_SHAPES[] => shapes.filter((shape) => !excludeIds.includes(shape.id));

const truncateListAtIndex = <T>(list: T[], index: number): T[] =>
  list.slice(0, index);

// ===== SHAPE CONVERSIONS =====
export const cloneShapeRecursive =
  (get: Getter) =>
  (shape: ALL_SHAPES): UndoShape => {
    const children = get(get(shape.state).children);
    return {
      ...shape,
      state: {
        ...cloneDeep(get(shape.state)),
        children: children?.map(cloneShapeRecursive(get)) ?? [],
      },
    };
  };

const convertUndoShapeToAllShapes = (undoShape: UndoShape): ALL_SHAPES => {
  const convertChildren = (children: UndoShape[]): ALL_SHAPES[] =>
    children.map(convertUndoShapeToAllShapes);

  return {
    id: undoShape.id,
    tool: undoShape.tool,
    state: atom<IShape>({
      ...cloneDeep(undoShape.state),
      children: atom(convertChildren(undoShape.state.children)),
    }),
  } as ALL_SHAPES;
};

const captureShapesState =
  (get: Getter) =>
  (shapeIds: string[]): UndoShape[] => {
    const currentShapes = get(PLANE_SHAPES_ATOM);
    const cloner = cloneShapeRecursive(get);

    return shapeIds
      .map((id) => findShapeById(currentShapes, id))
      .filter((shape): shape is ALL_SHAPES => shape !== undefined)
      .map(cloner);
  };

const createUndoRedoAction =
  (get: Getter) =>
  (args: UndoShapeValues): UndoRedoAction => ({
    id: uuidv4(),
    type: args.type,
    shapes: args.shapes.map(cloneShapeRecursive(get)),
    prevShapes: args.prevShapes?.map(cloneShapeRecursive(get)),
  });

// ===== SHAPE MANIPULATION =====
const removeShapeCompletely =
  (get: Getter, set: Setter) =>
  (shapeId: string): boolean => {
    const currentShapes = get(PLANE_SHAPES_ATOM);
    const shapeToRemove = findShapeById(currentShapes, shapeId);
    if (!shapeToRemove) return false;

    const currentParentId = get(shapeToRemove.state).parentId;

    if (currentParentId) {
      const parent = findShapeById(currentShapes, currentParentId);
      if (!parent) return false;

      const currentChildren = get(get(parent.state).children);
      const filteredChildren = filterShapesExcluding(currentChildren, [
        shapeId,
      ]);

      set(parent.state, {
        ...get(parent.state),
        children: atom(filteredChildren),
      });
      set(flexLayoutAtom, { id: currentParentId }); // aplicar layout si es flex
    } else {
      const currentRootShapes = get(ALL_SHAPES_ATOM);
      const filteredRootShapes = filterShapesExcluding(currentRootShapes, [
        shapeId,
      ]);
      set(ALL_SHAPES_ATOM, filteredRootShapes);
    }
    return true;
  };

const addShapeToContainer =
  (get: Getter, set: Setter) =>
  (shape: UndoShape, targetParentId: string | null): void => {
    const convertedShape = convertUndoShapeToAllShapes(shape);
    set(convertedShape.state, {
      ...get(convertedShape.state),
      parentId: targetParentId,
    });

    if (targetParentId) {
      const currentShapes = get(PLANE_SHAPES_ATOM);
      const parent = findShapeById(currentShapes, targetParentId);
      if (!parent) return;

      const currentChildren = get(get(parent.state).children);
      set(parent.state, {
        ...get(parent.state),
        children: atom([...currentChildren, convertedShape]),
      });
      set(flexLayoutAtom, { id: targetParentId }); // aplicar layout si es flex
    } else {
      const currentRootShapes = get(ALL_SHAPES_ATOM);
      set(ALL_SHAPES_ATOM, [...currentRootShapes, convertedShape]);
    }
  };

const updateExistingShape =
  (get: Getter, set: Setter) =>
  (existingShape: ALL_SHAPES, newState: UndoShape): void => {
    const convertedChildren = newState.state.children.map(
      convertUndoShapeToAllShapes
    );
    set(existingShape.state, {
      ...cloneDeep(newState.state),
      children: atom(convertedChildren),
    });
  };

// ===== ACTION HANDLERS =====
const handleRedoCreate =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[]): void => {
    const newShapes = shapes.map(convertUndoShapeToAllShapes);
    const currentShapes = get(ALL_SHAPES_ATOM);
    set(ALL_SHAPES_ATOM, [...currentShapes, ...newShapes]);
  };

const handleRedoDelete =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[]): void => {
    const remover = removeShapeCompletely(get, set);
    shapes.forEach((shape) => remover(shape.id));
  };

const handleRedoUpdate =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[]): void => {
    const currentShapes = get(PLANE_SHAPES_ATOM);
    const updater = updateExistingShape(get, set);
    shapes.forEach((element) => {
      const existingShape = findShapeById(currentShapes, element.id);
      if (existingShape) updater(existingShape, element);
    });
  };

const handleRedoMove =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[], prevShapes?: UndoShape[]): void => {
    if (!prevShapes) return;
    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    shapes.forEach((currentShape, index) => {
      const prevShape = prevShapes[index];
      if (!currentShape || !prevShape) return;
      remover(currentShape.id);
      adder(currentShape, currentShape.state.parentId ?? null);
    });
  };

const handleRedoGrouping =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[], prevShapes?: UndoShape[]): void => {
    if (!prevShapes) return;

    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    // Remover los elementos originales (prevShapes)
    prevShapes.forEach((shape) => {
      remover(shape.id);
    });

    // Agregar el nuevo layout con los hijos agrupados (shapes)
    shapes.forEach((shape) => {
      adder(shape, shape.state.parentId ?? null);
    });
  };

const handleUndoCreate =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[]): void => {
    const remover = removeShapeCompletely(get, set);
    shapes.forEach((shape) => remover(shape.id));
  };

const handleUndoDelete =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[]): void => {
    const adder = addShapeToContainer(get, set);
    shapes.forEach((element) => {
      adder(element, element.state.parentId ?? null);
    });
  };

const handleUndoMove =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[], prevShapes?: UndoShape[]): void => {
    if (!prevShapes) return;
    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    shapes.forEach((currentShape, index) => {
      const prevShape = prevShapes[index];
      if (!currentShape || !prevShape) return;
      remover(currentShape.id);
      adder(prevShape, prevShape.state.parentId ?? null);
    });
  };

const handleUndoGrouping =
  (get: Getter, set: Setter) =>
  (shapes: UndoShape[], prevShapes?: UndoShape[]): void => {
    if (!prevShapes) return;

    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    // Remover el layout agrupado (shapes)
    shapes.forEach((shape) => {
      remover(shape.id);
    });

    // Restaurar los elementos originales sin agrupar (prevShapes)
    prevShapes.forEach((shape) => {
      adder(shape, shape.state.parentId ?? null);
    });
  };

// ===== ATOMS =====
export const COUNT_UNDO_REDO = atom(
  (get) => get(get(CURRENT_PAGE).UNDOREDO.COUNT_UNDO_REDO),
  (get, set, count: number) =>
    set(get(CURRENT_PAGE).UNDOREDO.COUNT_UNDO_REDO, count)
);

export const LIST_UNDO_REDO = atom(
  (get) => get(get(CURRENT_PAGE).UNDOREDO.LIST_UNDO_REDO),
  (get, set, list: UndoRedoAction[]) =>
    set(get(CURRENT_PAGE).UNDOREDO.LIST_UNDO_REDO, list)
);

export const NEW_UNDO_REDO = atom(null, (get, set, args: UndoShapeValues) => {
  const currentList = get(LIST_UNDO_REDO);
  const currentCount = get(COUNT_UNDO_REDO);

  const truncatedList = truncateListAtIndex(currentList, currentCount);
  const newAction = createUndoRedoAction(get)(args);
  const updatedList = [...truncatedList, newAction];

  set(LIST_UNDO_REDO, updatedList);
  set(COUNT_UNDO_REDO, updatedList.length);
});

export const UPDATE_UNDO_REDO = atom(null, (get, set) => {
  const shapeIds = get(SHAPE_IDS_ATOM);
  const allShapes = get(PLANE_SHAPES_ATOM);
  const selectedShapes = allShapes.filter((shape) =>
    shapeIds.some((selectedId) => selectedId.id === shape.id)
  );
  set(NEW_UNDO_REDO, { type: "UPDATE", shapes: selectedShapes });
});

export const CAPTURE_MOVE_STATE = atom(null, (get, set, shapeIds: string[]) =>
  captureShapesState(get)(shapeIds)
);

export const REDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  const list = get(LIST_UNDO_REDO);
  if (count >= list.length) return;

  const action = list[count];
  if (!action) return;

  const actionHandlers = {
    CREATE: handleRedoCreate(get, set),
    DELETE: handleRedoDelete(get, set),
    UPDATE: handleRedoUpdate(get, set),
    MOVE: (shapes: UndoShape[], prevShapes?: UndoShape[]) =>
      handleRedoMove(get, set)(shapes, prevShapes),
    GROUPING: (shapes: UndoShape[], prevShapes?: UndoShape[]) =>
      handleRedoGrouping(get, set)(shapes, prevShapes),
    INITIAL: () => {},
    CLEAR_ALL: () => {},
  };

  const handler = actionHandlers[action.type];
  if (action.type === "MOVE" || action.type === "GROUPING") {
    handler(action.shapes, action.prevShapes);
  } else {
    handler(action.shapes);
  }
  set(COUNT_UNDO_REDO, count + 1);
});

export const UNDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  if (count <= 0) return;

  const action = get(LIST_UNDO_REDO)[count - 1];
  if (!action) return;

  const actionHandlers = {
    CREATE: handleUndoCreate(get, set),
    DELETE: handleUndoDelete(get, set),
    UPDATE: handleRedoUpdate(get, set),
    MOVE: (shapes: UndoShape[], prevShapes?: UndoShape[]) =>
      handleUndoMove(get, set)(shapes, prevShapes),
    GROUPING: (shapes: UndoShape[], prevShapes?: UndoShape[]) =>
      handleUndoGrouping(get, set)(shapes, prevShapes),
    INITIAL: () => {},
    CLEAR_ALL: () => {},
  };

  const handler = actionHandlers[action.type];
  if (action.type === "MOVE" || action.type === "GROUPING") {
    handler(action.shapes, action.prevShapes);
  } else {
    handler(action.shapes);
  }
  set(COUNT_UNDO_REDO, count - 1);
});
