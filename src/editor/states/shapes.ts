import {
  Align,
  FontWeight,
  IShape,
  JotaiState,
  VerticalAlign,
} from "@/editor/shapes/type.shape";
import { atom, Getter } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { Smile } from "lucide-static";
import { v4 as uuidv4 } from "uuid";
import { CreateShapeSchema, isNotNegative } from "../helpers/shape-schema";
import {
  AlignItems,
  FlexDirection,
  flexLayoutAtom,
  FlexWrap,
  JustifyContent,
} from "../shapes/layout-flex";
import { ShapeBase, ShapeImage } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { capitalize } from "../utils/capitalize";
import { SVG } from "../utils/svg";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "./currentItem";
import { DRAW_START_CONFIG_ATOM } from "./drawing";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, PAGE_ID_ATOM } from "./pages";
import {
  RESET_SHAPES_IDS_ATOM,
  SELECTED_SHAPES_BY_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "./shape";
import TOOL_ATOM, { IKeyTool, IShapesKeys } from "./tool";
import { NEW_UNDO_REDO } from "./undo-redo";

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IShapesKeys;
  // pageId: string | null;
  state: JotaiState<ShapeState>;
};

export type SHAPE_BASE_CHILDREN = Omit<ALL_SHAPES, "state"> & {
  state: ShapeBase;
};

type ExcludedKeys = "DRAW" | "MOVE" | "ICON";
type FirstArrayKeys = Exclude<IKeyTool, ExcludedKeys>; // ["IMAGE", "TEXT", "FRAME"]
type SecondArrayKeys = Extract<IKeyTool, "ICON">; // ["ICON"]

type DrawBasedTools = Extract<IKeyTool, "DRAW">;
const TOOLS_BOX_BASED: FirstArrayKeys[] = ["FRAME", "IMAGE", "TEXT"];
const TOOLS_ICON_BASED: SecondArrayKeys[] = ["ICON"];

const TOOLS_DRAW_BASED: DrawBasedTools[] = ["DRAW"];
export const DELETE_KEYS = ["DELETE", "BACKSPACE"];

export const ALL_SHAPES_ATOM = atom(
  (get) => {
    return get(get(CURRENT_PAGE).SHAPES.LIST);
  },
  (get, set, newTool: ALL_SHAPES[]) => {
    set(get(CURRENT_PAGE).SHAPES.LIST, newTool);
    return;
  }
);

const getStageBounds = (get: Getter) => (shapes: ALL_SHAPES[]) => {
  if (!shapes.length)
    return { width: 1000, height: 1000, startX: 0, startY: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  shapes.forEach((shape) => {
    const { x, y, width, height } = get(shape.state);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  return {
    width: maxX - minX,
    height: maxY - minY,
    startX: minX,
    startY: minY,
  };
};

export const STAGE_BOUNDS = atom((get) => {
  return getStageBounds(get)(get(ALL_SHAPES_ATOM));
});

export const GET_STAGE_BOUNDS_ATOM = atom(null, (get, set) => {
  return get(STAGE_BOUNDS);
});

export const PLANE_SHAPES_ATOM = atom((get) => {
  const getAllShapes = (nodes: ALL_SHAPES[]): ALL_SHAPES[] =>
    nodes.flatMap((node) => {
      const children =
        get(get(node.state).children).length > 0
          ? getAllShapes(get(get(node.state).children) as ALL_SHAPES[])
          : [];
      return [{ ...node }, ...children];
    });

  return getAllShapes(get(ALL_SHAPES_ATOM));
});

export const DELETE_SHAPES_ATOM = atom(null, (get, set) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapesSelected = get(SELECTED_SHAPES_BY_IDS_ATOM);

  for (const element of shapesSelected) {
    if (element.parentId) {
      const FIND_SHAPE = currentShapes.find((w) => w.id === element.parentId);

      if (!FIND_SHAPE) continue;
      set(flexLayoutAtom, { id: FIND_SHAPE.id }); // aplicar layout si es flex

      set(FIND_SHAPE.state, {
        ...get(FIND_SHAPE.state),
        children: atom(
          get(get(FIND_SHAPE.state).children).filter((e) => e.id !== element.id)
        ),
      });
      set(flexLayoutAtom, { id: element.parentId }); // aplicar layout si es flex
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }
  const selected = currentShapes.filter((e) =>
    shapesSelected.some((w) => w.id === e.id)
  );

  // registrar acción de tipo UPDATE
  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;

  set(SHAPE_IDS_, []);
  set(NEW_UNDO_REDO, {
    type: "DELETE",
    shapes: selected,
  });
});
export const GET_ALL_SHAPES_BY_ID = atom(
  null,
  (get, set, id: string): SHAPE_BASE_CHILDREN[] => {
    const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
    const FIND_SHAPE = PLANE_SHAPES.find((e) => e.id === id);
    if (!FIND_SHAPE) return [];

    const sanitizemap = (shape: ALL_SHAPES): SHAPE_BASE_CHILDREN => {
      const state = get(shape.state);
      return {
        ...shape,
        state: {
          ...state,
          children: get(state.children).map((child) => sanitizemap(child)),
        },
      };
    };

    return [sanitizemap(FIND_SHAPE)];
  }
);
export const DELETE_ALL_SHAPES_ATOM = atom(null, (get, set) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);

  for (const element of currentShapes) {
    if (get(element.state).parentId) {
      const FIND_SHAPE = currentShapes.find(
        (w) => w.id === get(element.state).parentId
      );

      if (!FIND_SHAPE) continue;
      set(FIND_SHAPE.state, {
        ...get(FIND_SHAPE.state),
        children: atom(
          get(get(FIND_SHAPE.state).children).filter((e) => e.id !== element.id)
        ),
      });
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }

  // registrar acción de tipo UPDATE
  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;

  set(SHAPE_IDS_, []);
  set(ALL_SHAPES_ATOM, []);
  set(NEW_UNDO_REDO, {
    type: "DELETE",
    shapes: currentShapes,
  });
});

// ===== Funciones de movimiento actualizadas =====
export const MOVE_SHAPES_BY_ID = atom(null, (get, set, targetId: string) => {
  const allShapes = get(PLANE_SHAPES_ATOM);
  const selectedShapeIds = get(SELECTED_SHAPES_BY_IDS_ATOM);

  // Early exits
  if (!allShapes?.length || !selectedShapeIds?.length) return;

  // Selection and target
  const selectedShapes = allShapes.filter((shape) =>
    selectedShapeIds.some((sel) => sel.id === shape.id)
  );
  const targetShape = allShapes.find((shape) => shape.id === targetId);
  if (!targetShape) return;

  // Prevent moving a node into itself or into its descendants
  const isDescendant = (parent: ALL_SHAPES, childId: string): boolean => {
    const children = get(get(parent.state).children);
    if (children.some((c) => c.id === childId)) return true;
    return children.some((c) => isDescendant(c, childId));
  };
  if (selectedShapes.some((s) => s.id === targetShape.id)) return;
  for (const shape of selectedShapes) {
    if (isDescendant(shape, targetShape.id)) return;
  }

  // Save previous state for undo
  const prevShapes = [...selectedShapes];

  // Precompute lookup map and helper to compute cumulative ancestor offsets
  const flatMap = new Map(allShapes.map((s) => [s.id, s] as const));
  const getInheritedOffset = (id: string | null): { x: number; y: number } => {
    if (!id) return { x: 0, y: 0 };
    let current = flatMap.get(id);
    let totalX = 0;
    let totalY = 0;
    while (current) {
      const st = get(current.state);
      totalX += st.x;
      totalY += st.y;
      current = st.parentId ? flatMap.get(st.parentId) : undefined;
    }
    return { x: totalX, y: totalY };
  };

  // Compute the target cumulative offset once (used when fixing positions)
  const targetAccum = getInheritedOffset(targetId);

  // Pure clone: returns a fresh ALL_SHAPES where state is a new atom
  const cloneShapeRecursive = (
    shape: ALL_SHAPES,
    parentId: string,
    fixPosition: boolean
  ): ALL_SHAPES => {
    const st = get(shape.state);
    const baseX = st.x;
    const baseY = st.y;

    const newX = fixPosition ? baseX - targetAccum.x : baseX;
    const newY = fixPosition ? baseY - targetAccum.y : baseY;

    const clonedChildren = get(st.children).map((child) =>
      cloneShapeRecursive(child, shape.id, false)
    );

    return {
      id: shape.id,
      tool: shape.tool,
      state: atom<IShape>({
        ...st,
        x: newX,
        y: newY,
        parentId,
        children: atom(clonedChildren),
      }),
    };
  };

  const targetChildren = get(get(targetShape.state).children);

  // Determine which selected shapes will be detached from their original parents
  const detachedShapes = selectedShapes.filter(
    (s) => !targetChildren.some((c) => c.id === s.id || s.id === targetId)
  );

  // Build cloned shapes that will be appended to the target
  const clonedShapes = selectedShapes.map((s) =>
    cloneShapeRecursive(s, get(targetShape.state).id, true)
  );

  const newChildren = clonedShapes.filter(
    (s) => !targetChildren.some((c) => c.id === s.id || s.id === targetId)
  );
  // Actualizar hijos del destino
  set(targetShape.state, {
    ...get(targetShape.state),
    children: atom([...targetChildren, ...newChildren]),
  });

  // Eliminar shapes de sus padres originales o nivel raíz
  for (const shape of detachedShapes) {
    const parentId = get(shape.state).parentId;

    if (parentId) {
      const parent = allShapes.find((p) => p.id === parentId);
      if (!parent) continue;

      const updatedChildren = get(get(parent.state).children).filter(
        (c) => c.id !== shape.id
      );
      set(parent.state, {
        ...get(parent.state),
        children: atom(updatedChildren),
      });
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((s) => s.id !== shape.id)
      );
    }
  }
  const updateShapesIds = get(SELECTED_SHAPES_BY_IDS_ATOM)?.map((e) => ({
    ...e,
    parentId: get(targetShape.state).id,
  }));
  set(UPDATE_SHAPES_IDS_ATOM, updateShapesIds);

  // Register MOVE for undo/redo
  set(NEW_UNDO_REDO, {
    type: "MOVE",
    shapes: clonedShapes,
    prevShapes,
  });
});

export const GROUP_SHAPES_IN_LAYOUT = atom(null, (get, set) => {
  const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
  const SELECTED = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (SELECTED.length === 0) return;

  const selectedShapes = PLANE_SHAPES.filter((w) =>
    SELECTED.some((e) => e.id === w.id)
  );

  // Verificar que todos tengan el mismo parentId
  const firstParentId = get(selectedShapes[0].state).parentId;
  const allHaveSameParent = selectedShapes.every(
    (shape) => get(shape.state).parentId === firstParentId
  );

  if (!allHaveSameParent) return;

  // Guardar estado ANTES del agrupamiento (prevShapes)
  const prevShapes = [...selectedShapes];

  // Calcular el bounding box de todos los elementos seleccionados
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  selectedShapes.forEach((shape) => {
    const state = get(shape.state);
    const x1 = state.x;
    const y1 = state.y;
    const x2 = x1 + (state.width || 0);
    const y2 = y1 + (state.height || 0);

    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);
  });

  const layoutWidth = maxX - minX;
  const layoutHeight = maxY - minY;

  // Crear el nuevo elemento layout
  const newLayoutId = uuidv4();
  const newLayout = CreateShapeSchema({
    tool: "FRAME",
    x: minX,
    y: minY,
    width: layoutWidth,
    height: layoutHeight,
    id: newLayoutId,
    label: "Layout",
    isLayout: true,
    parentId: firstParentId,
    fills: [],
  });

  // Clonar shapes y ajustar posiciones relativas al nuevo layout
  const cloneShapeRecursive = (
    shape: ALL_SHAPES,
    parentId: string
  ): ALL_SHAPES => {
    const state = get(shape.state);
    return {
      id: shape.id,
      tool: shape.tool,
      state: atom<IShape>({
        ...state,
        x: state.x - minX,
        y: state.y - minY,
        parentId,
        children: atom(
          get(state.children).map((c) => cloneShapeRecursive(c, shape.id))
        ),
      }),
    };
  };

  const clonedChildren = selectedShapes.map((s) =>
    cloneShapeRecursive(s, newLayoutId)
  );

  // Crear el nuevo elemento layout con los hijos
  const newLayoutShape: ALL_SHAPES = {
    id: newLayoutId,
    tool: "FRAME",
    state: atom<IShape>({
      ...newLayout,
      children: atom(clonedChildren),
    }),
  };

  // Si tienen parent, agregar al parent. Si no, agregar al root
  if (firstParentId) {
    const parentShape = PLANE_SHAPES.find((s) => s.id === firstParentId);
    if (!parentShape) return;

    // Remover los elementos seleccionados del parent
    const filteredChildren = get(get(parentShape.state).children).filter(
      (child) => !SELECTED.some((sel) => sel.id === child.id)
    );

    // Agregar el nuevo layout al parent
    set(parentShape.state, {
      ...get(parentShape.state),
      children: atom([...filteredChildren, newLayoutShape]),
    });
  } else {
    // Remover elementos seleccionados del root
    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM).filter(
        (s) => !SELECTED.some((sel) => sel.id === s.id)
      )
    );

    // Agregar el nuevo layout al root
    set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newLayoutShape]);
  }

  // Actualizar selección al nuevo layout
  set(RESET_SHAPES_IDS_ATOM);
  set(UPDATE_SHAPES_IDS_ATOM, [{ id: newLayoutId, parentId: firstParentId }]);

  // Registrar para undo/redo con tipo GROUPING
  set(NEW_UNDO_REDO, {
    type: "GROUPING",
    shapes: [newLayoutShape], // Estado DESPUÉS (el layout con los hijos)
    prevShapes: prevShapes, // Estado ANTES (los elementos individuales)
  });
});
export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const allShapes = get(PLANE_SHAPES_ATOM);
  const SELECTED = get(SELECTED_SHAPES_BY_IDS_ATOM);
  const selectedShapes = allShapes.filter((w) =>
    SELECTED.some((e) => e.id === w.id)
  );

  // Guardar estado anterior para undo/redo
  const prevShapes = [...selectedShapes];

  // Precompute lookup map and helper to compute cumulative ancestor offsets
  const flatMap = new Map(allShapes.map((s) => [s.id, s] as const));
  const getInheritedOffset = (id: string | null): { x: number; y: number } => {
    if (!id) return { x: 0, y: 0 };
    let current = flatMap.get(id);
    let totalX = 0;
    let totalY = 0;
    while (current) {
      const st = get(current.state);
      totalX += st.x;
      totalY += st.y;
      current = st.parentId ? flatMap.get(st.parentId) : undefined;
    }
    return { x: totalX, y: totalY };
  };

  // Clone a shape and its children. If parentId is null this clone will be
  // placed at root — in that case we must convert its position from relative
  // (inside its original parent chain) to absolute by adding the parent's
  // inherited offset. For nested children, positions remain relative to their
  // cloned parent.
  const cloneShapeRecursive = (
    shape: ALL_SHAPES,
    parentId: string | null = null
  ): ALL_SHAPES => {
    const state = get(shape.state);

    // If we're cloning to root (parentId === null) and the original shape had
    // a parent, add that parent's inherited position so the clone keeps the
    // same absolute coordinates.
    const originalParentId = state.parentId;
    const parentOffset = originalParentId
      ? getInheritedOffset(originalParentId)
      : { x: 0, y: 0 };

    const newX = parentId === null ? state.x + parentOffset.x : state.x;
    const newY = parentId === null ? state.y + parentOffset.y : state.y;

    return {
      id: shape.id,
      tool: shape.tool,
      state: atom<IShape>({
        ...state,
        x: newX,
        y: newY,
        parentId,
        children: atom(
          get(state.children).map((c) => cloneShapeRecursive(c, shape.id))
        ),
      }),
    };
  };

  const result = selectedShapes.map((s) => cloneShapeRecursive(s, null));

  // quitar de sus padres
  for (const element of SELECTED) {
    if (element.parentId) {
      const parent = allShapes.find((r) => r.id === element.parentId);
      if (!parent) continue;
      set(parent.state, {
        ...get(parent.state),
        children: atom(
          get(get(parent.state).children).filter((u) => u.id !== element.id)
        ),
      });
    }
  }
  const updateShapesIds = get(SELECTED_SHAPES_BY_IDS_ATOM)?.map((e) => ({
    ...e,
    parentId: null,
  }));
  set(UPDATE_SHAPES_IDS_ATOM, updateShapesIds);
  // añadir al root con átomos frescos
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), ...result]);

  // Registrar la acción MOVE para undo/redo
  set(NEW_UNDO_REDO, {
    type: "MOVE",
    shapes: result,
    prevShapes: prevShapes,
  });
});

// ----------- COPY SHAPES -------------- //

export const EVENT_COPY_START_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const rootShapes = get(PLANE_SHAPES_ATOM) ?? [];
    const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM) ?? [];

    if (rootShapes.length === 0 || selectedIds.length === 0) return [];

    // Precompute a lookup map for ancestor traversal
    const flatMap = new Map(rootShapes.map((s) => [s.id, s] as const));

    const getInheritedOffset = (
      targetId?: string | null
    ): { x: number; y: number } => {
      if (!targetId) return { x: 0, y: 0 };
      let current = flatMap.get(targetId);
      let totalX = 0;
      let totalY = 0;
      while (current) {
        const s = get(current.state);
        totalX += get(s.x);
        totalY += get(s.y);
        const parentId = get(s.parentId);
        current = parentId ? flatMap.get(parentId) : undefined;
      }
      return { x: totalX, y: totalY };
    };

    const shapesSelected = rootShapes.filter((shape) =>
      selectedIds.some((sel) => sel.id === shape.id)
    );

    // Pure recursive clone that returns a plain IShape (not an atom)
    const recursiveCloneShape = (
      shape: ALL_SHAPES,
      parentId: string | null = null,
      isRootCopy = false
    ): ShapeState => {
      const state = get(shape.state);
      const newId = uuidv4();

      const originalChildren = get(state.children) ?? [];

      const clonedChildren: ALL_SHAPES[] = originalChildren.map((child) => {
        const newChildState = recursiveCloneShape(child, newId, false);
        return {
          ...child,
          id: newChildState.id,
          tool: newChildState.tool as IShapesKeys,
          pageId: get(PAGE_ID_ATOM),
          state: atom(newChildState),
        } as ALL_SHAPES;
      });

      return {
        id: newId,
        x: atom(
          isRootCopy
            ? args.x - get(state.x) - getInheritedOffset(parentId).x
            : get(state.x)
        ),
        y: atom(
          isRootCopy
            ? args.y - get(state.y) - getInheritedOffset(parentId).y
            : get(state.y)
        ),
        offsetX: atom(isRootCopy ? args.x - get(state.x) : 0),
        offsetY: atom(isRootCopy ? args.y - get(state.y) : 0),
        offsetCopyX: atom(
          isRootCopy
            ? args.x - get(state.x) - getInheritedOffset(parentId).x
            : 0
        ),
        offsetCopyY: atom(
          isRootCopy
            ? args.y - get(state.y) - getInheritedOffset(parentId).y
            : 0
        ),
        tool: state.tool,
        align: atom<Align>(get(state.align)),
        copyX: atom(get(state.copyX)),
        copyY: atom(get(state.copyY)),
        image: atom(get(state.image)),
        verticalAlign: atom<VerticalAlign>(get(state.verticalAlign)),
        paddingBottom: atom(get(state.paddingBottom)),
        paddingTop: atom(get(state.paddingTop)),
        borderBottomLeftRadius: atom(get(state.borderBottomLeftRadius)),
        isAllPadding: atom(get(state.isAllPadding)),
        borderBottomRightRadius: atom(get(state.borderBottomRightRadius)),
        borderTopLeftRadius: atom(get(state.borderTopLeftRadius)),
        borderTopRightRadius: atom(get(state.borderTopRightRadius)),
        paddingLeft: atom(get(state.paddingLeft)),
        paddingRight: atom(get(state.paddingRight)),
        padding: atom(get(state.padding)),
        maxHeight: atom(get(state.maxHeight)),
        maxWidth: atom(get(state.maxWidth)),
        minHeight: atom(get(state.minHeight)),
        minWidth: atom(get(state.minWidth)),
        isLocked: atom(get(state.isLocked)),
        fillContainerHeight: atom(get(state.fillContainerHeight)),
        fillContainerWidth: atom(get(state.fillContainerWidth)),
        label: atom(get(state.label)),
        parentId: atom<string | null>(get(state.parentId)),
        rotation: atom(get(state.rotation)),
        opacity: atom(get(state.opacity)),
        fillColor: atom(get(state.fillColor)),
        shadowColor: atom(get(state.shadowColor)),
        isLayout: atom(get(state.isLayout)),
        alignItems: atom<AlignItems>(get(state.alignItems)),
        flexDirection: atom<FlexDirection>(get(state.flexDirection)),
        flexWrap: atom<FlexWrap>(get(state.flexWrap)),
        justifyContent: atom<JustifyContent>(get(state.justifyContent)),
        gap: atom(get(state.gap)),
        strokeColor: atom(get(state.strokeColor)),
        visible: atom(get(state.visible)),
        height: atom(get(state.height)),
        width: atom(get(state.width)),
        points: atom<number[]>(get(state.points)),
        strokeWidth: atom(get(state.strokeWidth)),
        lineCap: atom<LineCap>(get(state.lineCap)),
        lineJoin: atom<LineJoin>(get(state.lineJoin)),
        shadowBlur: atom(get(state.shadowBlur)),
        shadowOffsetY: atom(get(state.shadowOffsetY)),
        shadowOffsetX: atom(get(state.shadowOffsetX)),
        shadowOpacity: atom(get(state.shadowOpacity)),
        isAllBorderRadius: atom(get(state.isAllBorderRadius)),
        borderRadius: atom(get(state.borderRadius)),
        dash: atom(get(state.dash)),
        fontStyle: atom(get(state.fontStyle)),
        textDecoration: atom(get(state.textDecoration)),
        fontWeight: atom<FontWeight>(get(state.fontWeight)),
        fontFamily: atom(get(state.fontFamily)),
        fontSize: atom(get(state.fontSize)),
        text: atom(get(state.text)),
        children: atom<ALL_SHAPES[]>(clonedChildren),
      };
    };

    const newShapes = shapesSelected.map((shape) =>
      recursiveCloneShape(shape, get(get(shape.state).parentId), true)
    );

    // Commit state changes immutably via Jotai setters
    set(RESET_SHAPES_IDS_ATOM);
    set(CREATE_CURRENT_ITEM_ATOM, newShapes);
    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "COPYING");
    return newShapes;
  }
);

export const EVENT_COPY_CREATING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);
    for (const element of CURRENT_ITEMS) {
      set(element.x, args.x - get(element.offsetCopyX));
      set(element.y, args.y - get(element.offsetCopyY));
      set(element.copyX, args.x - get(element.offsetX));
      set(element.copyY, args.y - get(element.offsetY));
    }
  }
);

export const EVENT_COPY_FINISH_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);
  for (const newShape of CURRENT_ITEMS) {
    set(CREATE_SHAPE_ATOM, newShape);
  }
  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS?.map((e) => ({
        id: e?.id,
        parentId: get(e?.parentId),
      }))
    );
  });
  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});
// ----------- COPY SHAPES -------------- //

// ----------- DOWN SHAPES -------------- //
export const EVENT_DOWN_START_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const drawConfig = get(DRAW_START_CONFIG_ATOM);
    const tool = get(TOOL_ATOM);
    if (TOOLS_BOX_BASED.includes(tool as FirstArrayKeys)) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: tool as IShape["tool"],
          x: atom(x),
          y: atom(y),
          label: atom<string>(tool),
        }),
      ]);
    }
    if (TOOLS_ICON_BASED.includes(tool as SecondArrayKeys)) {
      console.log(SVG.Encode(Smile), "Smile");

      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: tool as IShape["tool"],
          x: atom(x),
          y: atom(y),
          label: atom<string>(tool),
          strokeWidth: atom(1),
          strokeColor: atom("#000000"),
          image: atom({
            src: SVG.Encode(Smile),
            height: 24,
            width: 24,
            name: "smile",
          } as ShapeImage),
        }),
      ]);
    }

    if (TOOLS_DRAW_BASED.includes(tool as DrawBasedTools)) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          ...drawConfig,
          tool: tool as IShape["tool"],
          points: atom<number[]>([x, y, x, y]),
          label: atom(capitalize(tool)),
        }),
      ]);
    }
    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "CREATING");
  }
);

export const EVENT_DOWN_CREATING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);
    for (const item of CURRENT_ITEMS) {
      const newHeight = isNotNegative(y - Number(get(item?.y)));
      const newWidth = isNotNegative(x - Number(get(item?.x)));

      if (TOOLS_BOX_BASED.includes(item.tool as FirstArrayKeys)) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_ICON_BASED.includes(item.tool as SecondArrayKeys)) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_DRAW_BASED.includes(item.tool as DrawBasedTools)) {
        const points = get(item.points);
        set(item.points, points.concat(x, y));
      }
    }
  }
);
export const EVENT_DOWN_FINISH_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);
  for (const newShape of CURRENT_ITEMS) {
    set(CREATE_SHAPE_ATOM, newShape);
  }
  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS?.map((e) => ({
        id: e?.id,
        parentId: get(e?.parentId),
      }))
    );
  });
  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});
// ----------- DOWN SHAPES -------------- //

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: ShapeState) => {
  if (!args || !args?.id) return;

  if (get(args.parentId)) {
    const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find(
      (e) => e.id === get(args.parentId)
    );
    if (!FIND_SHAPE) return;

    const currentChildren = get(get(FIND_SHAPE.state).children);

    const newElement = {
      ...get(FIND_SHAPE.state),
      children: atom([
        ...currentChildren,
        {
          id: args?.id,
          tool: args?.tool,
          state: atom<ShapeState>(args),
          pageId: get(PAGE_ID_ATOM),
        },
      ]),
    };

    set(FIND_SHAPE.state, newElement);
    set(flexLayoutAtom, { id: FIND_SHAPE.id }); // aplicar layout si es flex
    // set(NEW_UNDO_REDO, {
    //   shapes: [
    //     {
    //       ...FIND_SHAPE,
    //       state: atom(newElement),
    //       // pageId: get(PAGE_ID_ATOM),
    //     },
    //   ],
    //   type: "CREATE",
    // });
    return;
  }
  // const result = args?.children ? get(args?.children) : [];
  const newAllShape: ALL_SHAPES = {
    id: args?.id,
    tool: args?.tool,
    state: atom<ShapeState>(args),
    // pageId: get(PAGE_ID_ATOM),
  };

  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
  // set(NEW_UNDO_REDO, {
  //   shapes: [newAllShape],
  //   type: "CREATE",
  // });
});

export default ALL_SHAPES_ATOM;
