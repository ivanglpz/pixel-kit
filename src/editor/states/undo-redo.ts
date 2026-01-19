import { atom, Getter, PrimitiveAtom, Setter } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { flexLayoutAtom } from "../shapes/layout-flex";
import { ShapeState } from "../shapes/types/shape.state";
import { CURRENT_PAGE } from "./pages";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, { ALL_SHAPES, PLANE_SHAPES_ATOM } from "./shapes";

/* ============================================================
   TYPES (SNAPSHOT / PLAIN DATA)
============================================================ */

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [k: string]: JsonValue };

export type ShapeStateSnapshot = {
  id: string;
  // tool: ShapeState["tool"];
  parentId: string | null;
  children: ShapeSnapshot[];
} & JsonObject;

export type ShapeSnapshot = {
  id: string;
  // tool: ShapeState["tool"];
  state: ShapeStateSnapshot;
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
  shapes: ShapeSnapshot[];
  prevShapes?: ShapeSnapshot[];
};

export type UndoShapeValues = {
  type: ActionType;
  shapes: ALL_SHAPES[];
  prevShapes?: ALL_SHAPES[];
};

/* ============================================================
   PURE HELPERS
============================================================ */

const truncateListAtIndex = <T>(list: T[], index: number): T[] =>
  list.slice(0, index);

const findShapeById = (
  shapes: ALL_SHAPES[],
  id: string,
): ALL_SHAPES | undefined => shapes.find((s) => s.id === id);

/* ============================================================
   ATOM / JSON HELPERS
============================================================ */

type AtomLike = { read: unknown };

const isAtomLike = (value: unknown): value is AtomLike =>
  typeof value === "object" && value !== null && "read" in value;

const toJsonValue = (value: unknown): JsonValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toJsonValue);
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const obj: JsonObject = {};
    entries.forEach(([k, v]) => {
      obj[k] = toJsonValue(v);
    });
    return obj;
  }

  // functions / symbols / undefined -> se eliminan representándolos como null
  return null;
};

const atomOrValueToJson = (get: Getter, value: unknown): JsonValue => {
  if (typeof value === "function") return null;
  if (isAtomLike(value))
    return toJsonValue(get(value as unknown as PrimitiveAtom<unknown>));
  return toJsonValue(value);
};

/* ============================================================
   SERIALIZATION (RUNTIME -> SNAPSHOT)
============================================================ */

export const serializeShape =
  (get: Getter) =>
  (shape: ALL_SHAPES): ShapeSnapshot => {
    const st = get(shape.state);

    const childrenRuntime = get(st.children);
    const children = childrenRuntime.map(serializeShape(get));

    const parentId = get(st.parentId);

    // Serializa todas las keys del ShapeState a JSON, excepto children (lo manejamos aparte)
    const baseEntries = Object.entries(st).filter(([k]) => k !== "children");

    const plainState = baseEntries.reduce<JsonObject>((acc, [k, v]) => {
      acc[k] = atomOrValueToJson(get, v);
      return acc;
    }, {});

    const state: ShapeStateSnapshot = {
      ...plainState,
      id: st.id,
      // tool: st.tool,
      parentId,
      children,
    };

    return {
      id: shape.id,
      // tool: shape.tool,
      state,
    };
  };

export const captureSnapshots =
  (get: Getter) =>
  (shapes: ALL_SHAPES[]): ShapeSnapshot[] =>
    shapes.map(serializeShape(get));

/* ============================================================
   DESERIALIZATION (SNAPSHOT -> RUNTIME)
============================================================ */

const jsonToAtom = <T>(value: T): PrimitiveAtom<T> => atom(value);

const deserializeShape = (snapshot: ShapeSnapshot): ALL_SHAPES => {
  const children = snapshot.state.children.map(deserializeShape);

  // Reconstruye un ShapeState donde la gran mayoría de campos son atoms.
  // id/tool quedan como valores directos (coincide con tu ShapeState actual).
  // parentId y children deben ser atoms.
  const restoredEntries = Object.entries(snapshot.state).filter(
    ([k]) => k !== "children" && k !== "parentId" && k !== "id" && k !== "tool",
  );

  const restoredAtoms = restoredEntries.reduce<
    Record<string, PrimitiveAtom<JsonValue>>
  >((acc, [k, v]) => {
    acc[k] = jsonToAtom(v);
    return acc;
  }, {});

  const restoredState = {
    ...restoredAtoms,
    id: snapshot.state.id,
    tool: snapshot.state.tool,
    parentId: jsonToAtom(snapshot.state.parentId),
    children: jsonToAtom(children),
  } as unknown as ShapeState;

  return {
    id: snapshot.id,
    // tool: snapshot.tool,
    state: atom(restoredState),
  };
};

/* ============================================================
   SHAPE MANIPULATION
============================================================ */

const removeShapeCompletely =
  (get: Getter, set: Setter) =>
  (shapeId: string): void => {
    const plane = get(PLANE_SHAPES_ATOM);
    const shape = findShapeById(plane, shapeId);
    if (!shape) return;

    const st = get(shape.state);
    const parentId = get(st.parentId);

    if (parentId) {
      const parent = findShapeById(plane, parentId);
      if (!parent) return;

      const parentState = get(parent.state);
      const childrenAtom = parentState.children;

      set(
        childrenAtom,
        get(childrenAtom).filter((c) => c.id !== shapeId),
      );
      set(flexLayoutAtom, { id: parentId });
      return;
    }

    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM).filter((s) => s.id !== shapeId),
    );
  };

const addShapeToContainer =
  (get: Getter, set: Setter) =>
  (snapshot: ShapeSnapshot, targetParentId: string | null): void => {
    const shape = deserializeShape(snapshot);

    // Ajustar parentId del shape recién creado (es atom)
    const newState = get(shape.state);
    set(shape.state, {
      ...newState,
      parentId: atom(targetParentId),
    } as unknown as ShapeState);

    if (targetParentId) {
      const parent = findShapeById(get(PLANE_SHAPES_ATOM), targetParentId);
      if (!parent) return;

      const parentState = get(parent.state);
      const childrenAtom = parentState.children;

      set(childrenAtom, [...get(childrenAtom), shape]);
      set(flexLayoutAtom, { id: targetParentId });
      return;
    }

    set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), shape]);
  };

const updateExistingShape =
  (get: Getter, set: Setter) =>
  (snapshot: ShapeSnapshot): void => {
    const plane = get(PLANE_SHAPES_ATOM);
    const existing = findShapeById(plane, snapshot.id);
    if (!existing) return;

    const restored = deserializeShape(snapshot);
    set(existing.state, get(restored.state));
  };

/* ============================================================
   ACTION HANDLERS
============================================================ */

const handleRedoCreate =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[]): void => {
    const created = shapes.map(deserializeShape);
    set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), ...created]);
  };

const handleRedoDelete =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[]): void => {
    const remover = removeShapeCompletely(get, set);
    shapes.forEach((s) => remover(s.id));
  };

const handleRedoUpdate =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[]): void => {
    shapes.forEach(updateExistingShape(get, set));
  };

const handleRedoMove =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[], _prevShapes?: ShapeSnapshot[]): void => {
    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    shapes.forEach((s) => {
      remover(s.id);
      adder(s, s.state.parentId);
    });
  };

const handleRedoGrouping =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[], prevShapes?: ShapeSnapshot[]): void => {
    if (!prevShapes) return;

    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    prevShapes.forEach((s) => remover(s.id));
    shapes.forEach((s) => adder(s, s.state.parentId));
  };

const handleUndoCreate =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[]): void => {
    const remover = removeShapeCompletely(get, set);
    shapes.forEach((s) => remover(s.id));
  };

const handleUndoDelete =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[]): void => {
    const adder = addShapeToContainer(get, set);
    shapes.forEach((s) => adder(s, s.state.parentId));
  };

const handleUndoMove =
  (get: Getter, set: Setter) =>
  (_shapes: ShapeSnapshot[], prevShapes?: ShapeSnapshot[]): void => {
    if (!prevShapes) return;

    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    prevShapes.forEach((s) => {
      remover(s.id);
      adder(s, s.state.parentId);
    });
  };

const handleUndoGrouping =
  (get: Getter, set: Setter) =>
  (shapes: ShapeSnapshot[], prevShapes?: ShapeSnapshot[]): void => {
    if (!prevShapes) return;

    const remover = removeShapeCompletely(get, set);
    const adder = addShapeToContainer(get, set);

    shapes.forEach((s) => remover(s.id));
    prevShapes.forEach((s) => adder(s, s.state.parentId));
  };

/* ============================================================
   ATOMS
============================================================ */

export const COUNT_UNDO_REDO = atom(
  (get) => get(get(CURRENT_PAGE).UNDOREDO.COUNT_UNDO_REDO),
  (get, set, value: number) =>
    set(get(CURRENT_PAGE).UNDOREDO.COUNT_UNDO_REDO, value),
);

export const LIST_UNDO_REDO = atom(
  (get) => get(get(CURRENT_PAGE).UNDOREDO.LIST_UNDO_REDO),
  (get, set, list: UndoRedoAction[]) =>
    set(get(CURRENT_PAGE).UNDOREDO.LIST_UNDO_REDO, list),
);

export const NEW_UNDO_REDO = atom(null, (get, set, args: UndoShapeValues) => {
  const list = get(LIST_UNDO_REDO);
  const count = get(COUNT_UNDO_REDO);

  const truncated = truncateListAtIndex(list, count);

  const action: UndoRedoAction = {
    id: uuidv4(),
    type: args.type,
    shapes: captureSnapshots(get)(args.shapes),
    prevShapes: args.prevShapes
      ? captureSnapshots(get)(args.prevShapes)
      : undefined,
  };

  set(LIST_UNDO_REDO, [...truncated, action]);
  set(COUNT_UNDO_REDO, truncated.length + 1);
});

export const UPDATE_UNDO_REDO = atom(null, (get, set) => {
  const selected = get(SELECTED_SHAPES_BY_IDS_ATOM);
  const plane = get(PLANE_SHAPES_ATOM);

  const shapes = plane.filter((s) => selected.some((sel) => sel.id === s.id));
  set(NEW_UNDO_REDO, { type: "UPDATE", shapes });
});

export const REDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  const list = get(LIST_UNDO_REDO);
  if (count >= list.length) return;

  const action = list[count];
  if (!action) return;

  const handlers: Record<
    ActionType,
    (shapes: ShapeSnapshot[], prevShapes?: ShapeSnapshot[]) => void
  > = {
    CREATE: (s) => handleRedoCreate(get, set)(s),
    DELETE: (s) => handleRedoDelete(get, set)(s),
    UPDATE: (s) => handleRedoUpdate(get, set)(s),
    MOVE: (s, p) => handleRedoMove(get, set)(s, p),
    GROUPING: (s, p) => handleRedoGrouping(get, set)(s, p),
    INITIAL: () => {},
    CLEAR_ALL: () => {},
  };

  handlers[action.type](action.shapes, action.prevShapes);
  set(COUNT_UNDO_REDO, count + 1);
});

export const UNDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  if (count <= 0) return;

  const action = get(LIST_UNDO_REDO)[count - 1];
  if (!action) return;

  const handlers: Record<
    ActionType,
    (shapes: ShapeSnapshot[], prevShapes?: ShapeSnapshot[]) => void
  > = {
    CREATE: (s) => handleUndoCreate(get, set)(s),
    DELETE: (s) => handleUndoDelete(get, set)(s),
    UPDATE: (s) => handleRedoUpdate(get, set)(s),
    MOVE: (s, p) => handleUndoMove(get, set)(s, p),
    GROUPING: (s, p) => handleUndoGrouping(get, set)(s, p),
    INITIAL: () => {},
    CLEAR_ALL: () => {},
  };

  handlers[action.type](action.shapes, action.prevShapes);
  set(COUNT_UNDO_REDO, count - 1);
});
