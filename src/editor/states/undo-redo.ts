import { atom, Getter, Setter } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "../helpers/shape-schema";
import { IShape } from "../shapes/type.shape";
import { CURRENT_PAGE } from "./pages";
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
    return get(get(CURRENT_PAGE).UNDOREDO.COUNT_UNDO_REDO);
  },
  (get, _set, shape: number) => {
    return _set(get(CURRENT_PAGE).UNDOREDO.COUNT_UNDO_REDO, shape);
  }
);

export const LIST_UNDO_REDO = atom(
  (get) => {
    return get(get(CURRENT_PAGE).UNDOREDO.LIST_UNDO_REDO);
  },
  (get, _set, shape: UNDO_REDO_PROPS[]) => {
    return _set(get(CURRENT_PAGE).UNDOREDO.LIST_UNDO_REDO, shape);
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

// ===== NUEVO: Helper para capturar estado actual antes del move =====
export const CAPTURE_MOVE_STATE = atom(
  null,
  (get, set, shapesToMove: string[]) => {
    const currentShapes = get(PLANE_SHAPES_ATOM);

    const capturedShapes: UNDO_SHAPE[] = [];

    for (const shapeId of shapesToMove) {
      const shape = currentShapes.find((s) => s.id === shapeId);
      if (!shape) continue;

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

      capturedShapes.push(cloneShapeRecursive(shape));
    }

    return capturedShapes;
  }
);

// ===== NUEVO: Atom para registrar operación MOVE completa =====
export const REGISTER_MOVE_OPERATION = atom(
  null,
  (
    get,
    set,
    args: {
      movedShapes: string[]; // IDs de las shapes que se movieron
      newParentId?: string; // ID del nuevo padre (undefined = root)
    }
  ) => {
    // 1. Capturar estado ANTES del move (estado previo)
    const prevShapes = get(CAPTURE_MOVE_STATE);

    // 2. Capturar estado DESPUÉS del move (estado actual)
    const currentShapes = get(PLANE_SHAPES_ATOM);
    const currentMovedShapes: UNDO_SHAPE[] = [];

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

    for (const shapeId of args.movedShapes) {
      const shape = currentShapes.find((s) => s.id === shapeId);
      if (shape) {
        currentMovedShapes.push(cloneShapeRecursive(shape));
      }
    }

    // 3. Registrar la operación MOVE
    set(NEW_UNDO_REDO, {
      type: "MOVE",
      shapes: currentMovedShapes, // Estado después del move
      prevShapes: prevShapes, // Estado antes del move
    });
  }
);

// ===== Helper mejorado para remover shapes completamente =====
const removeShapeCompletely = (
  get: Getter,
  set: Setter,
  shapeId: string
): boolean => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapeToRemove = currentShapes.find((s) => s.id === shapeId);

  if (!shapeToRemove) return false;

  const currentParentId = get(shapeToRemove.state).parentId;

  if (currentParentId) {
    // Remover del padre
    const parent = currentShapes.find((s) => s.id === currentParentId);
    if (!parent) return false;

    const currentChildren = get(get(parent.state).children);
    const filteredChildren = currentChildren.filter(
      (child) => child.id !== shapeId
    );

    set(parent.state, {
      ...get(parent.state),
      children: atom(filteredChildren),
    });
  } else {
    // Remover del root
    const currentRootShapes = get(ALL_SHAPES_ATOM);
    const filteredRootShapes = currentRootShapes.filter(
      (s) => s.id !== shapeId
    );
    set(ALL_SHAPES_ATOM, filteredRootShapes);
  }

  return true;
};

// ===== Helper mejorado para agregar shape en posición específica =====
const addShapeToContainer = (
  get: Getter,
  set: Setter,
  shape: UNDO_SHAPE,
  targetParentId: string | null
): void => {
  const convertedShape = convertUndoShapeToAllShapes(shape);

  // Actualizar el parentId del shape convertido
  set(convertedShape.state, {
    ...get(convertedShape.state),
    parentId: targetParentId,
  });

  if (targetParentId) {
    // Agregar como child
    const currentShapes = get(PLANE_SHAPES_ATOM);
    const parent = currentShapes.find((s) => s.id === targetParentId);
    if (!parent) return;

    const currentChildren = get(get(parent.state).children);
    set(parent.state, {
      ...get(parent.state),
      children: atom([...currentChildren, convertedShape]),
    });
  } else {
    // Agregar al root
    const currentRootShapes = get(ALL_SHAPES_ATOM);
    set(ALL_SHAPES_ATOM, [...currentRootShapes, convertedShape]);
  }
};

// ===== REDO actualizado =====
export const REDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  const list = get(LIST_UNDO_REDO);

  if (count >= list.length) return;

  const action = list[count];
  if (!action) return;

  switch (action.type) {
    case "CREATE": {
      const newShapes: ALL_SHAPES[] = action.shapes.map(
        convertUndoShapeToAllShapes
      );
      const currentShapes = get(ALL_SHAPES_ATOM);
      set(ALL_SHAPES_ATOM, [...currentShapes, ...newShapes]);
      break;
    }

    case "DELETE": {
      // Eliminar las shapes
      for (const element of action.shapes) {
        removeShapeCompletely(get, set, element.id);
      }
      break;
    }

    case "UPDATE": {
      const currentShapes = get(PLANE_SHAPES_ATOM);

      for (const element of action.shapes) {
        const existingShape = currentShapes.find((s) => s.id === element.id);
        if (!existingShape) continue;

        const convertedChildren = element.state.children.map(
          convertUndoShapeToAllShapes
        );

        set(existingShape.state, {
          ...cloneDeep(element.state),
          children: atom(convertedChildren),
        });
      }
      break;
    }

    case "MOVE": {
      if (!action.prevShapes) break;

      // REDO: Ir del estado anterior (prevShapes) al estado nuevo (shapes)
      for (let i = 0; i < action.shapes.length; i++) {
        const currentShape = action.shapes[i];
        const prevShape = action.prevShapes[i];

        if (!currentShape || !prevShape) continue;

        // 1. Remover de la posición actual (donde está según prevShapes)
        removeShapeCompletely(get, set, currentShape.id);

        // 2. Agregar en la nueva posición (según shapes)
        addShapeToContainer(
          get,
          set,
          currentShape,
          currentShape.state.parentId
        );
      }
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, count + 1);
});

// ===== UNDO actualizado =====
export const UNDO_ATOM = atom(null, (get, set) => {
  const count = get(COUNT_UNDO_REDO);
  if (count <= 0) return;

  const action = get(LIST_UNDO_REDO)[count - 1];
  if (!action) return;

  switch (action.type) {
    case "CREATE": {
      // Eliminar las shapes creadas
      for (const shape of action.shapes) {
        removeShapeCompletely(get, set, shape.id);
      }
      break;
    }

    case "DELETE": {
      // Restaurar las shapes eliminadas
      for (const element of action.shapes) {
        addShapeToContainer(get, set, element, element.state.parentId);
      }
      break;
    }

    case "UPDATE": {
      const currentShapes = get(PLANE_SHAPES_ATOM);

      for (const element of action.shapes) {
        const existingShape = currentShapes.find((s) => s.id === element.id);
        if (!existingShape) continue;

        const convertedChildren = element.state.children.map(
          convertUndoShapeToAllShapes
        );

        set(existingShape.state, {
          ...cloneDeep(element.state),
          children: atom(convertedChildren),
        });
      }
      break;
    }

    case "MOVE": {
      if (!action.prevShapes) break;

      // UNDO: Ir del estado actual (shapes) al estado anterior (prevShapes)
      for (let i = 0; i < action.shapes.length; i++) {
        const currentShape = action.shapes[i];
        const prevShape = action.prevShapes[i];

        if (!currentShape || !prevShape) continue;

        // 1. Remover de la posición actual
        removeShapeCompletely(get, set, currentShape.id);

        // 2. Restaurar en la posición anterior
        addShapeToContainer(get, set, prevShape, prevShape.state.parentId);
      }
      break;
    }

    default:
      break;
  }

  set(COUNT_UNDO_REDO, count - 1);
});
