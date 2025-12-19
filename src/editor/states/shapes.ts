import { Align, FontWeight, VerticalAlign } from "@/editor/shapes/type.shape";
import { atom, Getter, PrimitiveAtom, Setter } from "jotai";
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
import TOOL_ATOM, { IKeyTool, IShapeTool } from "./tool";

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IShapeTool;
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

/* =========================
   Helpers (pure / reusable)
   ========================= */

type XY = { x: number; y: number };
type Bounds = { width: number; height: number; startX: number; startY: number };

const DEFAULT_BOUNDS: Bounds = {
  width: 1000,
  height: 1000,
  startX: 0,
  startY: 0,
};

const asAtom = <T>(value: T) => atom(value);

const flattenShapes =
  (get: Getter) =>
  (nodes: ALL_SHAPES[]): ALL_SHAPES[] => {
    const walk = (acc: ALL_SHAPES[], node: ALL_SHAPES): ALL_SHAPES[] => {
      const children = get(get(node.state).children);
      const nextAcc = acc.concat([{ ...node }]);
      return children.length === 0
        ? nextAcc
        : children.reduce((a, c) => walk(a, c), nextAcc);
    };
    return nodes.reduce<ALL_SHAPES[]>((acc, n) => walk(acc, n), []);
  };

const computeStageBounds =
  (get: Getter) =>
  (shapes: ALL_SHAPES[]): Bounds => {
    if (shapes.length === 0) return DEFAULT_BOUNDS;

    const initial = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    };

    const { minX, minY, maxX, maxY } = shapes.reduce((acc, shape) => {
      const st = get(shape.state);
      const x = get(st.x);
      const y = get(st.y);
      const width = get(st.width);
      const height = get(st.height);

      return {
        minX: Math.min(acc.minX, x),
        minY: Math.min(acc.minY, y),
        maxX: Math.max(acc.maxX, x + width),
        maxY: Math.max(acc.maxY, y + height),
      };
    }, initial);

    return {
      width: maxX - minX,
      height: maxY - minY,
      startX: minX,
      startY: minY,
    };
  };

const buildLookup = (shapes: ALL_SHAPES[]) =>
  new Map(shapes.map((s) => [s.id, s] as const));

const computeAncestorOffset =
  (get: Getter) =>
  (lookup: Map<string, ALL_SHAPES>) =>
  (id: string | null | undefined): XY => {
    if (!id) return { x: 0, y: 0 };

    let current = lookup.get(id);
    let totalX = 0;
    let totalY = 0;

    while (current) {
      const st = get(current.state);
      totalX += get(st.x);
      totalY += get(st.y);

      const parentId = get(st.parentId);
      current = parentId ? lookup.get(parentId) : undefined;
    }

    return { x: totalX, y: totalY };
  };

const isDescendantOf =
  (get: Getter) =>
  (candidateAncestor: ALL_SHAPES, childId: string): boolean => {
    const children = get(get(candidateAncestor.state).children);
    if (children.some((c) => c.id === childId)) return true;
    return children.some((c) => isDescendantOf(get)(c, childId));
  };

const detachShapeFromTree =
  (get: Getter) =>
  (set: Setter) =>
  (rootAtom: typeof ALL_SHAPES_ATOM) =>
  (plane: ALL_SHAPES[]) =>
  (shape: ALL_SHAPES): void => {
    const st = get(shape.state);
    const parentId = get(st.parentId);

    if (parentId) {
      const parent = plane.find((p) => p.id === parentId);
      if (!parent) return;

      const parentChildrenAtom = get(parent.state).children;
      set(
        parentChildrenAtom,
        get(parentChildrenAtom).filter((c) => c.id !== shape.id)
      );
      return;
    }

    set(
      rootAtom,
      get(rootAtom).filter((s) => s.id !== shape.id)
    );
  };

const attachShapesToTarget =
  (get: Getter) =>
  (set: Setter) =>
  (targetShape: ALL_SHAPES) =>
  (incoming: ALL_SHAPES[]): void => {
    const targetChildrenAtom = get(targetShape.state).children;
    const existing = get(targetChildrenAtom);
    const existingIds = new Set(existing.map((c) => c.id));

    const toAppend = incoming.filter(
      (s) => !existingIds.has(s.id) && s.id !== targetShape.id
    );
    set(targetChildrenAtom, existing.concat(toAppend));
  };

const relocateShapeTree =
  (get: Getter) =>
  (set: Setter) =>
  (
    shape: ALL_SHAPES,
    newParentId: string | null,
    offset: XY,
    adjustSelf: boolean
  ): ALL_SHAPES => {
    const st = get(shape.state);
    const baseX = get(st.x);
    const baseY = get(st.y);

    const nextX = adjustSelf ? baseX - offset.x : baseX;
    const nextY = adjustSelf ? baseY - offset.y : baseY;

    set(st.x, nextX);
    set(st.y, nextY);
    set(st.parentId, newParentId);

    const children = get(st.children);
    children.forEach((child) =>
      relocateShapeTree(get)(set)(child, shape.id, offset, false)
    );

    return shape;
  };

/* =========================
   Atoms (names protected)
   ========================= */

export const ALL_SHAPES_ATOM = atom(
  (get) => get(get(CURRENT_PAGE).SHAPES.LIST),
  (get, set, newTool: ALL_SHAPES[]) => {
    set(get(CURRENT_PAGE).SHAPES.LIST, newTool);
  }
);

export const GET_STAGE_BOUNDS_ATOM = atom(null, (get) => {
  return computeStageBounds(get)(get(ALL_SHAPES_ATOM));
});

export const PLANE_SHAPES_ATOM = atom((get) => {
  return flattenShapes(get)(get(ALL_SHAPES_ATOM));
});

export const DELETE_SHAPES_ATOM = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selected = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selected.length === 0) return;

  selected.forEach((sel) => {
    if (sel.parentId) {
      const parent = plane.find((s) => s.id === sel.parentId);
      if (!parent) return;

      set(flexLayoutAtom, { id: parent.id });

      const childrenAtom = get(parent.state).children;
      const nextChildren = get(childrenAtom).filter((c) => c.id !== sel.id);
      set(childrenAtom, nextChildren);

      set(flexLayoutAtom, { id: sel.parentId });
      return;
    }

    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM).filter((s) => s.id !== sel.id)
    );
  });

  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;
  set(SHAPE_IDS_, []);
});

export const DELETE_ALL_SHAPES_ATOM = atom(null, (get, set) => {
  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;
  set(SHAPE_IDS_, []);
  set(ALL_SHAPES_ATOM, []);
});

// ===== Movement =====

export const MOVE_SHAPES_BY_ID = atom(null, (get, set, targetId: string) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selectedRefs.length === 0) return;

  const selectedIdSet = new Set(selectedRefs.map((r) => r.id));
  const selectedShapes = plane.filter((s) => selectedIdSet.has(s.id));

  const targetShape = plane.find((s) => s.id === targetId);
  if (!targetShape) return;

  if (selectedIdSet.has(targetShape.id)) return;

  const targetChildren = get(get(targetShape.state).children);
  const targetChildrenSet = new Set(targetChildren.map((c) => c.id));

  const invalidMove = selectedShapes.some((shape) =>
    isDescendantOf(get)(shape, targetShape.id)
  );
  if (invalidMove) return;

  // Detach each selected from its current container unless it is already under target
  const shouldDetach = (shape: ALL_SHAPES) =>
    !targetChildrenSet.has(shape.id) && shape.id !== targetShape.id;

  const detacher = detachShapeFromTree(get)(set)(ALL_SHAPES_ATOM)(plane);
  selectedShapes.filter(shouldDetach).forEach(detacher);

  const lookup = buildLookup(plane);
  const targetOffset = computeAncestorOffset(get)(lookup)(targetId);

  const relocated = selectedShapes.map((shape) =>
    relocateShapeTree(get)(set)(shape, targetShape.id, targetOffset, true)
  );

  attachShapesToTarget(get)(set)(targetShape)(relocated);

  const updatedRefs = selectedRefs.map((ref) => ({
    ...ref,
    parentId: targetShape.id,
  }));

  set(UPDATE_SHAPES_IDS_ATOM, updatedRefs);
});

export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selectedRefs.length === 0) return;

  const selectedIdSet = new Set(selectedRefs.map((r) => r.id));
  const selectedShapes = plane.filter((s) => selectedIdSet.has(s.id));

  const lookup = buildLookup(plane);
  const offsetOf = computeAncestorOffset(get)(lookup);

  const relocateToRoot = (shape: ALL_SHAPES): ALL_SHAPES => {
    const st = get(shape.state);
    const parentId = get(st.parentId);
    const offset = parentId ? offsetOf(parentId) : { x: 0, y: 0 };

    set(st.x, get(st.x) + offset.x);
    set(st.y, get(st.y) + offset.y);
    set(st.parentId, null);

    const children = get(st.children);
    children.forEach((child) => {
      relocateShapeTree(get)(set)(child, shape.id, { x: 0, y: 0 }, false);
    });

    return shape;
  };

  // Remove from previous parents
  selectedRefs.forEach((ref) => {
    if (!ref.parentId) return;

    const parent = plane.find((s) => s.id === ref.parentId);
    if (!parent) return;

    const parentChildrenAtom = get(parent.state).children;
    set(
      parentChildrenAtom,
      get(parentChildrenAtom).filter((c) => c.id !== ref.id)
    );
  });

  const relocated = selectedShapes.map(relocateToRoot);

  set(
    UPDATE_SHAPES_IDS_ATOM,
    selectedRefs.map((r) => ({ ...r, parentId: null }))
  );

  set(ALL_SHAPES_ATOM, get(ALL_SHAPES_ATOM).concat(relocated));
});

export const GROUP_SHAPES_IN_LAYOUT = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (selectedRefs.length === 0) return;

  const selectedIdSet = new Set(selectedRefs.map((r) => r.id));
  const selectedShapes = plane.filter((s) => selectedIdSet.has(s.id));
  if (selectedShapes.length === 0) return;

  const firstParentId = get(get(selectedShapes[0].state).parentId);
  const allSameParent = selectedShapes.every(
    (s) => get(get(s.state).parentId) === firstParentId
  );
  if (!allSameParent) return;

  const bbox = selectedShapes.reduce(
    (acc, shape) => {
      const st = get(shape.state);
      const x1 = get(st.x);
      const y1 = get(st.y);
      const x2 = x1 + (get(st.width) || 0);
      const y2 = y1 + (get(st.height) || 0);

      return {
        minX: Math.min(acc.minX, x1),
        minY: Math.min(acc.minY, y1),
        maxX: Math.max(acc.maxX, x2),
        maxY: Math.max(acc.maxY, y2),
      };
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  const newLayoutId = uuidv4();
  const newLayout = CreateShapeSchema({
    tool: "FRAME",
    x: atom(bbox.minX),
    y: atom(bbox.minY),
    width: atom(bbox.maxX - bbox.minX),
    height: atom(bbox.maxY - bbox.minY),
    label: atom("LAYOUT"),
    isLayout: atom(false),
    id: newLayoutId,
    parentId: atom(firstParentId),
  });

  const reparentIntoLayout = (
    shape: ALL_SHAPES,
    parentId: string
  ): ALL_SHAPES => {
    const st = get(shape.state);

    set(st.x, get(st.x) - bbox.minX);
    set(st.y, get(st.y) - bbox.minY);
    set(st.parentId, parentId);

    get(st.children).forEach((c) => reparentIntoLayout(c, shape.id));
    return shape;
  };

  const layoutChildren = selectedShapes.map((s) =>
    reparentIntoLayout(s, newLayoutId)
  );

  const newLayoutShape: ALL_SHAPES = {
    id: newLayoutId,
    tool: "FRAME",
    state: atom<ShapeState>({ ...newLayout, children: atom(layoutChildren) }),
  };

  if (firstParentId) {
    const parent = plane.find((s) => s.id === firstParentId);
    if (!parent) return;

    const parentChildrenAtom = get(parent.state).children;
    const filtered = get(parentChildrenAtom).filter(
      (c) => !selectedIdSet.has(c.id)
    );
    set(parentChildrenAtom, filtered.concat([newLayoutShape]));
  } else {
    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM)
        .filter((s) => !selectedIdSet.has(s.id))
        .concat([newLayoutShape])
    );
  }

  set(RESET_SHAPES_IDS_ATOM);
  set(UPDATE_SHAPES_IDS_ATOM, [{ id: newLayoutId, parentId: firstParentId }]);
});

// ----------- COPY SHAPES -------------- //

export const EVENT_COPY_START_SHAPES = atom(
  null,
  (get, set, initial_args: { x: number; y: number }) => {
    const plane = get(PLANE_SHAPES_ATOM) ?? [];
    const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM) ?? [];

    if (plane.length === 0 || selectedIds.length === 0) return [];

    const selectedSet = new Set(selectedIds.map((s) => s.id));
    const lookup = buildLookup(plane);
    const offsetOf = computeAncestorOffset(get)(lookup);

    const shapesSelected = plane.filter((s) => selectedSet.has(s.id));

    const cloneStateRecursive = (
      shape: ALL_SHAPES,
      parentId: string | null,
      isRoot: boolean
    ): ShapeState => {
      const state = get(shape.state);
      const newId = uuidv4();

      const originalChildren = get(state.children) ?? [];
      const clonedChildren: ALL_SHAPES[] = originalChildren.map((child) => {
        const childState = cloneStateRecursive(child, newId, false);
        return {
          ...child,
          id: childState.id,
          tool: childState.tool as IShapeTool,
          pageId: get(PAGE_ID_ATOM),
          state: atom(childState),
        } as ALL_SHAPES;
      });

      const x = get(state.x);
      const y = get(state.y);
      const inherited = offsetOf(parentId);

      const rootX = initial_args.x - x - inherited.x;
      const rootY = initial_args.y - y - inherited.y;

      const offsetX = initial_args.x - x;
      const offsetY = initial_args.y - y;

      return {
        id: newId,
        x: asAtom(isRoot ? rootX : x),
        y: asAtom(isRoot ? rootY : y),
        offsetX: asAtom(isRoot ? offsetX : 0),
        offsetY: asAtom(isRoot ? offsetY : 0),
        offsetCopyX: asAtom(isRoot ? rootX : 0),
        offsetCopyY: asAtom(isRoot ? rootY : 0),

        tool: state.tool,

        align: asAtom<Align>(get(state.align)),
        copyX: asAtom(get(state.copyX)),
        copyY: asAtom(get(state.copyY)),
        image: asAtom(get(state.image)),
        verticalAlign: asAtom<VerticalAlign>(get(state.verticalAlign)),

        paddingBottom: asAtom(get(state.paddingBottom)),
        paddingTop: asAtom(get(state.paddingTop)),
        borderBottomLeftRadius: asAtom(get(state.borderBottomLeftRadius)),
        isAllPadding: asAtom(get(state.isAllPadding)),
        borderBottomRightRadius: asAtom(get(state.borderBottomRightRadius)),
        borderTopLeftRadius: asAtom(get(state.borderTopLeftRadius)),
        borderTopRightRadius: asAtom(get(state.borderTopRightRadius)),
        paddingLeft: asAtom(get(state.paddingLeft)),
        paddingRight: asAtom(get(state.paddingRight)),
        padding: asAtom(get(state.padding)),

        maxHeight: asAtom(get(state.maxHeight)),
        maxWidth: asAtom(get(state.maxWidth)),
        minHeight: asAtom(get(state.minHeight)),
        minWidth: asAtom(get(state.minWidth)),

        isLocked: asAtom(get(state.isLocked)),
        fillContainerHeight: asAtom(get(state.fillContainerHeight)),
        fillContainerWidth: asAtom(get(state.fillContainerWidth)),
        label: asAtom(get(state.label)),
        parentId: asAtom<string | null>(parentId),
        rotation: asAtom(get(state.rotation)),
        opacity: asAtom(get(state.opacity)),
        fillColor: asAtom(get(state.fillColor)),
        shadowColor: asAtom(get(state.shadowColor)),
        isLayout: asAtom(get(state.isLayout)),

        alignItems: asAtom<AlignItems>(get(state.alignItems)),
        flexDirection: asAtom<FlexDirection>(get(state.flexDirection)),
        flexWrap: asAtom<FlexWrap>(get(state.flexWrap)),
        justifyContent: asAtom<JustifyContent>(get(state.justifyContent)),
        gap: asAtom(get(state.gap)),

        strokeColor: asAtom(get(state.strokeColor)),
        visible: asAtom(get(state.visible)),
        height: asAtom(get(state.height)),
        width: asAtom(get(state.width)),
        points: asAtom<number[]>(get(state.points)),
        strokeWidth: asAtom(get(state.strokeWidth)),
        lineCap: asAtom<LineCap>(get(state.lineCap)),
        lineJoin: asAtom<LineJoin>(get(state.lineJoin)),
        shadowBlur: asAtom(get(state.shadowBlur)),
        shadowOffsetY: asAtom(get(state.shadowOffsetY)),
        shadowOffsetX: asAtom(get(state.shadowOffsetX)),
        shadowOpacity: asAtom(get(state.shadowOpacity)),
        isAllBorderRadius: asAtom(get(state.isAllBorderRadius)),
        borderRadius: asAtom(get(state.borderRadius)),
        dash: asAtom(get(state.dash)),

        fontStyle: asAtom(get(state.fontStyle)),
        textDecoration: asAtom(get(state.textDecoration)),
        fontWeight: asAtom<FontWeight>(get(state.fontWeight)),
        fontFamily: asAtom(get(state.fontFamily)),
        fontSize: asAtom(get(state.fontSize)),
        text: asAtom(get(state.text)),

        children: asAtom<ALL_SHAPES[]>(clonedChildren),
      };
    };

    const newShapes = shapesSelected.map((shape) =>
      cloneStateRecursive(shape, get(get(shape.state).parentId), true)
    );

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
    CURRENT_ITEMS.forEach((element) => {
      set(element.x, args.x - get(element.offsetCopyX));
      set(element.y, args.y - get(element.offsetCopyY));
      set(element.copyX, args.x - get(element.offsetX));
      set(element.copyY, args.y - get(element.offsetY));
    });
  }
);

export const EVENT_COPY_FINISH_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

  CURRENT_ITEMS.forEach((newShape) => {
    set(CREATE_SHAPE_ATOM, {
      ...newShape,
      x: newShape.copyX,
      y: newShape.copyY,
    });
  });

  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS.map((e) => ({ id: e.id, parentId: get(e.parentId) }))
    );
  });

  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});

// ----------- DOWN SHAPES -------------- //

export const EVENT_DOWN_START_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const tool = get(TOOL_ATOM);

    if (TOOLS_BOX_BASED.includes(tool as FirstArrayKeys)) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: tool as ShapeBase["tool"],
          x: atom(x),
          y: atom(y),
          label: atom<string>(tool),
        }),
      ]);
    }

    if (TOOLS_ICON_BASED.includes(tool as SecondArrayKeys)) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: tool as IShapeTool,
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
      const drawConfig = get(DRAW_START_CONFIG_ATOM);

      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: tool as IShapeTool,
          points: atom<number[]>([x, y, x, y]),
          label: atom(capitalize(tool)),
          align: atom(get(drawConfig.align)),
          id: uuidv4(),
          x: atom(get(drawConfig.x)),
          y: atom(get(drawConfig.y)),
          fillColor: atom(get(drawConfig.fillColor)),
          strokeColor: atom(get(drawConfig.strokeColor)),
          offsetX: atom(0),
          copyX: atom(0),
          copyY: atom(0),
          offsetCopyX: atom(0),
          offsetCopyY: atom(0),
          offsetY: atom(0),
          image: atom({
            width: 1200,
            height: 1200,
            name: "default.png",
            src: "/placeholder.svg",
          } as ShapeImage),
          verticalAlign: atom<VerticalAlign>("top"),
          paddingBottom: atom(10),
          paddingTop: atom(10),
          borderBottomLeftRadius: atom(0),
          isAllPadding: atom(true),
          borderBottomRightRadius: atom(0),
          borderTopLeftRadius: atom(0),
          borderTopRightRadius: atom(0),
          paddingLeft: atom(0),
          paddingRight: atom(0),
          padding: atom(0),
          maxHeight: atom(0),
          maxWidth: atom(0),
          minHeight: atom(0),
          minWidth: atom(0),
          shadowColor: atom(get(drawConfig.shadowColor)),
          isLocked: atom(false),
          fillContainerHeight: atom(false),
          fillContainerWidth: atom(false),
          parentId: atom<string | null>(null),
          rotation: atom(0),
          opacity: atom(1),
          isLayout: atom(false),
          alignItems: atom<AlignItems>("flex-start"),
          flexDirection: atom<FlexDirection>("row"),
          flexWrap: atom<FlexWrap>("nowrap"),
          justifyContent: atom<JustifyContent>("flex-start"),
          gap: atom(0),
          visible: atom(true),
          height: atom(100),
          width: atom(100),
          strokeWidth: atom(get(drawConfig.strokeWidth)),
          lineCap: atom<LineCap>(get(drawConfig.lineCap)),
          lineJoin: atom<LineJoin>(get(drawConfig.lineJoin)),
          shadowBlur: atom(get(drawConfig.shadowBlur)),
          shadowOffsetY: atom(get(drawConfig.shadowOffsetY)),
          shadowOffsetX: atom(get(drawConfig.shadowOffsetX)),
          shadowOpacity: atom(get(drawConfig.shadowOpacity)),
          isAllBorderRadius: atom(true),
          borderRadius: atom(0),
          dash: atom(get(drawConfig.dash)),
          fontStyle: atom("Roboto"),
          textDecoration: atom("none"),
          fontWeight: atom<FontWeight>("normal"),
          fontFamily: atom("Roboto"),
          fontSize: atom(24),
          text: atom("Hello World"),
          children: atom<ALL_SHAPES[]>([]),
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

    CURRENT_ITEMS.forEach((item) => {
      const newHeight = isNotNegative(y - Number(get(item.y)));
      const newWidth = isNotNegative(x - Number(get(item.x)));

      if (TOOLS_BOX_BASED.includes(item.tool as FirstArrayKeys)) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_ICON_BASED.includes(item.tool as SecondArrayKeys)) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_DRAW_BASED.includes(item.tool as DrawBasedTools)) {
        set(item.points, get(item.points).concat(x, y));
      }
    });
  }
);

export const EVENT_DOWN_FINISH_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

  CURRENT_ITEMS.forEach((newShape) => {
    set(CREATE_SHAPE_ATOM, newShape);
  });

  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS.map((e) => ({ id: e.id, parentId: get(e.parentId) }))
    );
  });

  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});

// ----------- CREATE SHAPE -------------- //

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: ShapeState) => {
  if (!args || !args.id) return;

  if (get(args.parentId)) {
    const parentId = get(args.parentId);
    const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find((e) => e.id === parentId);
    if (!FIND_SHAPE) return;

    const childrenAtom = get(FIND_SHAPE.state).children;
    set(childrenAtom, [
      ...get(childrenAtom),
      {
        id: args.id,
        tool: args.tool,
        state: atom<ShapeState>(args),
        pageId: get(PAGE_ID_ATOM),
      },
    ]);

    set(flexLayoutAtom, { id: FIND_SHAPE.id });
    return;
  }

  const newAllShape: ALL_SHAPES = {
    id: args.id,
    tool: args.tool,
    state: atom<ShapeState>(args),
  };

  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
});

export default ALL_SHAPES_ATOM;
