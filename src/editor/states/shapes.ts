import {
  Align,
  FontWeight,
  IShape,
  VerticalAlign,
} from "@/editor/shapes/type.shape";
import { atom, Getter, PrimitiveAtom } from "jotai";
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

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IShapesKeys;
  // pageId: string | null;
  state: PrimitiveAtom<ShapeState>;
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
    const x = get(get(shape.state).x);
    const y = get(get(shape.state).y);
    const width = get(get(shape.state).width);
    const height = get(get(shape.state).height);

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
          ? getAllShapes(get(get(node.state).children))
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
      const children = get(FIND_SHAPE.state).children;
      set(
        children,
        get(children).filter((e) => e.id !== element.id)
      );
      set(flexLayoutAtom, { id: element.parentId }); // aplicar layout si es flex
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }

  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;

  set(SHAPE_IDS_, []);
  // set(NEW_UNDO_REDO, {
  //   type: "DELETE",
  //   shapes: selected,
  // });
});
export const DELETE_ALL_SHAPES_ATOM = atom(null, (get, set) => {
  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;

  set(SHAPE_IDS_, []);
  set(ALL_SHAPES_ATOM, []);
  // set(NEW_UNDO_REDO, {
  //   type: "DELETE",
  //   shapes: currentShapes,
  // });
});

export const GET_ALL_SHAPES_BY_ID = atom(
  null,
  (get, set, id: string): SHAPE_BASE_CHILDREN[] => {
    const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
    const FIND_SHAPE = PLANE_SHAPES.find((e) => e.id === id);
    if (!FIND_SHAPE) return [];

    // const sanitizemap = (shape: ALL_SHAPES): SHAPE_BASE_CHILDREN => {
    //   const state = get(shape.state);
    //   return {
    //     ...shape,
    //     state: {
    //       ...state,
    //       children: get(state.children).map((child) => sanitizemap(child)),
    //     },
    //   };
    // };

    // return [sanitizemap(FIND_SHAPE)];
    return [];
  }
);

// ===== Funciones de movimiento actualizadas =====
export const MOVE_SHAPES_BY_ID = atom(
  null,
  async (get, set, targetId: string) => {
    const shapes = get(PLANE_SHAPES_ATOM);
    const selectedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);

    if (!shapes?.length || !selectedRefs?.length) return;

    const selectedShapes = shapes.filter((shape) =>
      selectedRefs.some((ref) => ref.id === shape.id)
    );

    const targetShape = shapes.find((shape) => shape.id === targetId);
    if (!targetShape) return;

    const targetChildren = get(get(targetShape.state).children);

    const shapesToDetach = selectedShapes.filter(
      (shape) =>
        !targetChildren.some(
          (child) => child.id === shape.id || shape.id === targetId
        )
    );

    for (const shape of shapesToDetach) {
      const parentId = get(get(shape.state).parentId);

      if (parentId) {
        const parent = shapes.find((p) => p.id === parentId);
        if (!parent) continue;

        const filteredChildren = get(get(parent.state).children).filter(
          (child) => child.id !== shape.id
        );

        set(get(parent.state).children, filteredChildren);
      } else {
        set(
          ALL_SHAPES_ATOM,
          get(ALL_SHAPES_ATOM).filter((s) => s.id !== shape.id)
        );
      }
    }

    const isDescendant = (parent: ALL_SHAPES, childId: string): boolean => {
      const children = get(get(parent.state).children);
      if (children.some((child) => child.id === childId)) return true;
      return children.some((child) => isDescendant(child, childId));
    };

    if (selectedShapes.some((shape) => shape.id === targetShape.id)) return;

    for (const shape of selectedShapes) {
      if (isDescendant(shape, targetShape.id)) return;
    }

    const previousSelectionSnapshot = [...selectedShapes];

    const shapeLookup = new Map(shapes.map((s) => [s.id, s] as const));

    const computeAncestorOffset = (
      id: string | null
    ): { x: number; y: number } => {
      if (!id) return { x: 0, y: 0 };
      let current = shapeLookup.get(id);
      let accumulatedX = 0;
      let accumulatedY = 0;

      while (current) {
        const st = get(current.state);
        accumulatedX += get(st.x);
        accumulatedY += get(st.y);

        const parentId = get(st.parentId);
        current = parentId ? shapeLookup.get(parentId) : undefined;
      }

      return { x: accumulatedX, y: accumulatedY };
    };

    const targetOffset = computeAncestorOffset(targetId);

    const relocateShapeTree = (
      shape: ALL_SHAPES,
      newParentId: string,
      adjustPosition: boolean
    ) => {
      const st = get(shape.state);
      const baseX = get(st.x);
      const baseY = get(st.y);

      const nextX = adjustPosition ? baseX - targetOffset.x : baseX;
      const nextY = adjustPosition ? baseY - targetOffset.y : baseY;

      set(st.x, nextX);
      set(st.y, nextY);
      set(st.parentId, newParentId);

      for (const child of get(st.children)) {
        relocateShapeTree(child, shape.id, false);
      }

      return shape;
    };

    const relocatedShapes = selectedShapes.map((shape) =>
      relocateShapeTree(shape, get(targetShape.state).id, true)
    );

    const shapesToAppend = relocatedShapes.filter(
      (shape) =>
        !targetChildren.some(
          (child) => child.id === shape.id || shape.id === targetId
        )
    );

    set(get(targetShape.state).children, [
      ...targetChildren,
      ...shapesToAppend,
    ]);

    const updatedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM)?.map((ref) => ({
      ...ref,
      parentId: get(targetShape.state).id,
    }));

    set(UPDATE_SHAPES_IDS_ATOM, updatedRefs);
  }
);

export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const shapes = get(PLANE_SHAPES_ATOM);
  const selectedShapeRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);
  const selectedShapes = shapes.filter((shape) =>
    selectedShapeRefs.some((ref) => ref.id === shape.id)
  );

  const shapeLookup = new Map(
    shapes.map((shape) => [shape.id, shape] as const)
  );

  const computeAncestorOffset = (
    shapeId: string | null
  ): { x: number; y: number } => {
    if (!shapeId) return { x: 0, y: 0 };
    let current = shapeLookup.get(shapeId);
    let accumulatedX = 0;
    let accumulatedY = 0;

    while (current) {
      const state = get(current.state);
      accumulatedX += get(state.x);
      accumulatedY += get(state.y);

      const parentId = get(state.parentId);
      current = parentId ? shapeLookup.get(parentId) : undefined;
    }

    return { x: accumulatedX, y: accumulatedY };
  };

  const relocateShapeTree = (
    shape: ALL_SHAPES,
    newParentId: string | null = null
  ): ALL_SHAPES => {
    const state = get(shape.state);

    const localX = get(state.x);
    const localY = get(state.y);
    const originalParentId = get(state.parentId);

    const offset = originalParentId
      ? computeAncestorOffset(originalParentId)
      : { x: 0, y: 0 };

    const absoluteX = newParentId === null ? localX + offset.x : localX;
    const absoluteY = newParentId === null ? localY + offset.y : localY;

    set(state.x, absoluteX);
    set(state.y, absoluteY);
    set(state.parentId, newParentId);

    for (const child of get(state.children)) {
      relocateShapeTree(child, shape.id);
    }

    return shape;
  };

  const relocatedShapes = selectedShapes.map((shape) =>
    relocateShapeTree(shape, null)
  );

  for (const ref of selectedShapeRefs) {
    if (!ref.parentId) continue;

    const parent = shapes.find((shape) => shape.id === ref.parentId);
    if (!parent) continue;

    const parentChildren = get(parent.state).children;
    set(
      parentChildren,
      get(parentChildren).filter((child) => child.id !== ref.id)
    );
  }

  const updatedRefs = selectedShapeRefs?.map((ref) => ({
    ...ref,
    parentId: null,
  }));

  set(UPDATE_SHAPES_IDS_ATOM, updatedRefs);
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), ...relocatedShapes]);
});

export const GROUP_SHAPES_IN_LAYOUT = atom(null, (get, set) => {
  const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
  const SELECTED = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (SELECTED.length === 0) return;

  const selectedShapes = PLANE_SHAPES.filter((w) =>
    SELECTED.some((e) => e.id === w.id)
  );

  // Verificar que todos tengan el mismo parentId
  const firstParentId = get(get(selectedShapes[0].state).parentId);
  const allHaveSameParent = selectedShapes.every(
    (shape) => get(get(shape.state).parentId) === firstParentId
  );

  if (!allHaveSameParent) return;

  // Calcular el bounding box de todos los elementos seleccionados
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  selectedShapes.forEach((shape) => {
    const state = get(shape.state);
    const x1 = get(state.x);
    const y1 = get(state.y);
    const x2 = x1 + (get(state.width) || 0);
    const y2 = y1 + (get(state.height) || 0);

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
    x: atom(minX),
    y: atom(minY),
    width: atom(layoutWidth),
    height: atom(layoutHeight),
    label: atom("LAYOUT"),
    isLayout: atom(false),
    // x: minX,
    // y: minY,
    // width: layoutWidth,
    // height: layoutHeight,
    id: newLayoutId,
    // label: "Layout",
    // isLayout: true,
    parentId: atom(firstParentId),
    // fills: [],
  });

  // Clonar shapes y ajustar posiciones relativas al nuevo layout
  const cloneShapeRecursive = (
    shape: ALL_SHAPES,
    parentId: string
  ): ALL_SHAPES => {
    const state = get(shape.state);
    const x = get(state.x);
    const y = get(state.y);

    set(state.x, x - minX);
    set(state.y, y - minY);
    set(state.parentId, parentId);
    for (const c of get(state.children)) {
      cloneShapeRecursive(c, shape.id);
    }

    return shape;
  };

  const clonedChildren = selectedShapes.map((s) =>
    cloneShapeRecursive(s, newLayoutId)
  );

  // Crear el nuevo elemento layout con los hijos
  const newLayoutShape: ALL_SHAPES = {
    id: newLayoutId,
    tool: "FRAME",
    state: atom<ShapeState>({
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
    set(get(parentShape.state).children, [...filteredChildren, newLayoutShape]);
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

  // // Registrar para undo/redo con tipo GROUPING
  // set(NEW_UNDO_REDO, {
  //   type: "GROUPING",
  //   shapes: [newLayoutShape], // Estado DESPUÉS (el layout con los hijos)
  //   prevShapes: prevShapes, // Estado ANTES (los elementos individuales)
  // });
});

// ----------- COPY SHAPES -------------- //

export const EVENT_COPY_START_SHAPES = atom(
  null,
  (get, set, initial_args: { x: number; y: number }) => {
    const rootShapes = get(PLANE_SHAPES_ATOM) ?? [];
    const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM) ?? [];

    if (rootShapes.length === 0 || selectedIds.length === 0) return [];

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
      IS_ROOT = false
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

      const x = get(state.x);
      const y = get(state.y);
      const inheritedX = getInheritedOffset(parentId).x;
      const inheritedY = getInheritedOffset(parentId).y;

      return {
        id: newId,
        x: atom(IS_ROOT ? initial_args.x - x - inheritedX : x),
        y: atom(IS_ROOT ? initial_args.y - y - inheritedY : y),
        offsetX: atom(IS_ROOT ? initial_args.x - x : 0),
        offsetY: atom(IS_ROOT ? initial_args.y - y : 0),
        offsetCopyX: atom(IS_ROOT ? initial_args.x - x - inheritedX : 0),
        offsetCopyY: atom(IS_ROOT ? initial_args.y - y - inheritedY : 0),
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
        parentId: atom<string | null>(parentId),
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
    set(CREATE_SHAPE_ATOM, {
      ...newShape,
      x: newShape.copyX,
      y: newShape.copyY,
    });
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

    const children = get(FIND_SHAPE.state).children;
    set(children, [
      ...get(children),
      {
        id: args?.id,
        tool: args?.tool,
        state: atom<ShapeState>(args),
        pageId: get(PAGE_ID_ATOM),
      },
    ]);

    // const newElement = {
    //   ...get(FIND_SHAPE.state),
    //   children: atom(),
    // };

    // set(FIND_SHAPE.state, newElement);
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
