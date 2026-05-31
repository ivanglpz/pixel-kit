import { atom, Getter, PrimitiveAtom, Setter } from "jotai";
import { ShapeBase } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, IShapeId } from "./pages";
import { PLANE_SHAPES_ATOM } from "./shapes/store";
import type { ALL_SHAPES } from "./shapes/types";
// import { ShapeSnapshot } from "./undo-redo";

const ROOT_PARENT_KEY = "__root__";

const filterListId = (id: string, parentId: string | null) => {
  return (e: IShapeId) => e?.id === id && e?.parentId === parentId;
};

const getShapeSelectionKey = ({ id, parentId }: IShapeId) =>
  `${parentId ?? ROOT_PARENT_KEY}:${id}`;

const getRuntimeShapeSelectionKey = (get: Getter, shape: ALL_SHAPES) =>
  getShapeSelectionKey({
    id: shape.id,
    parentId: get(get(shape.state).parentId),
  });

const buildShapeSelectionLookup = (get: Getter, shapes: ALL_SHAPES[]) =>
  new Map(
    shapes.map((shape) => [getRuntimeShapeSelectionKey(get, shape), shape]),
  );

const resolveSelectedShapeRefs = (
  selectedIds: IShapeId[],
  shapeLookup: Map<string, ALL_SHAPES>,
) =>
  selectedIds.reduce<ALL_SHAPES[]>((selectedShapes, selected) => {
    const shape = shapeLookup.get(getShapeSelectionKey(selected));
    return shape ? selectedShapes.concat(shape) : selectedShapes;
  }, []);

const asUpdateList = (args: ShapeUpdateAtomArgs) =>
  Array.isArray(args) ? args : [args];

const getLatestUpdatesByType = (updates: ShapeUpdateAtomProps[]) =>
  Array.from(
    updates
      .reduce(
        (latestUpdates, update) => latestUpdates.set(update.type, update),
        new Map<UpdatableKeys, ShapeUpdateAtomProps>(),
      )
      .values(),
  );

export const SELECTED_SHAPES_BY_IDS_ATOM = atom(
  (get) => {
    return get(get(CURRENT_PAGE).SHAPES.ID);
  },
  (get, _set, shape: IShapeId) => {
    const ids = get(CURRENT_PAGE).SHAPES.ID;
    const event = get(EVENT_ATOM);
    const listIds = get(ids);

    if (event === "MULTI_SELECT") {
      const findId = listIds?.some(filterListId(shape.id, shape.parentId));

      if (findId) {
        _set(ids, listIds?.filter(filterListId(shape.id, shape.parentId)));

        return;
      }
      _set(ids, [...listIds, shape]);
      return;
    }
    _set(ids, [shape]);
  },
);
export const UPDATE_SHAPES_IDS_ATOM = atom(
  null,
  (get, set, args: IShapeId[]) => {
    const ids = get(CURRENT_PAGE).SHAPES.ID;
    set(ids, args);
  },
);

export const RESET_SHAPES_IDS_ATOM = atom(null, (get, set) => {
  const SHAPE_IDS_ATOM = get(CURRENT_PAGE).SHAPES.ID;
  set(SHAPE_IDS_ATOM, []);
});

export const PLANE_SHAPE_SELECTION_LOOKUP_ATOM = atom((get) => {
  return buildShapeSelectionLookup(get, get(PLANE_SHAPES_ATOM));
});

export const SHAPE_SELECTED_REFS_ATOM = atom((get) => {
  return resolveSelectedShapeRefs(
    get(SELECTED_SHAPES_BY_IDS_ATOM),
    get(PLANE_SHAPE_SELECTION_LOOKUP_ATOM),
  );
});

export const SHAPE_SELECTED_ATOM = atom((get) => {
  const shapes = get(SHAPE_SELECTED_REFS_ATOM).map((shape) => get(shape.state));

  return {
    shape: shapes.at(0) || null,
    shapes,
    count: shapes.length,
  };
});

export type UpdatableKeys = keyof Omit<
  ShapeState,
  "id" | "tool" | "children" | "parentId"
>;

export type ShapeUpdateAtomProps<K extends UpdatableKeys = UpdatableKeys> = {
  type: K;
  value: ShapeBase[K];
};

export type ShapeUpdateBatchResult = {
  didUpdate: boolean;
  layoutParentIds: string[];
  updatedCount: number;
};

type ShapeUpdateAtomArgs = ShapeUpdateAtomProps | ShapeUpdateAtomProps[];

type NormalizedShapeUpdate = ShapeUpdateAtomProps & {
  affectsParentLayout: boolean;
};

export const LAYOUT_AFFECTING_CHILD_KEYS = new Set<UpdatableKeys>([
  "x",
  "y",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "fillContainerWidth",
  "fillContainerHeight",
]);

export const shouldApplyParentLayout = (type: UpdatableKeys) =>
  LAYOUT_AFFECTING_CHILD_KEYS.has(type);

const normalizeShapeUpdates = (
  args: ShapeUpdateAtomArgs,
): NormalizedShapeUpdate[] =>
  getLatestUpdatesByType(asUpdateList(args)).map((update) => ({
    ...update,
    affectsParentLayout: shouldApplyParentLayout(update.type),
  }));

const createShapeUpdateResult = (): ShapeUpdateBatchResult => ({
  didUpdate: false,
  layoutParentIds: [],
  updatedCount: 0,
});

export const SHAPE_UPDATE_BATCH_ATOM = atom(
  null,
  (get: Getter, set: Setter, args: ShapeUpdateAtomArgs) => {
    const updates = normalizeShapeUpdates(args);
    const result = createShapeUpdateResult();

    if (updates.length === 0) return result;

    const layoutParentIds = new Set<string>();
    const selectedShapes = get(SHAPE_SELECTED_REFS_ATOM);

    for (const shapeRef of selectedShapes) {
      const shape = get(shapeRef.state);

      for (const { type, value, affectsParentLayout } of updates) {
        const target = shape[type] as PrimitiveAtom<unknown> | undefined;
        if (!target || Object.is(get(target), value)) continue;

        set(target, value);
        result.didUpdate = true;
        result.updatedCount += 1;

        if (affectsParentLayout) {
          const parentId = get(shape.parentId);
          if (parentId) layoutParentIds.add(parentId);
        }
      }
    }

    result.layoutParentIds = Array.from(layoutParentIds);
    return result;
  },
);

export const SHAPE_UPDATE_ATOM = atom(
  null,
  <K extends UpdatableKeys>(
    get: Getter,
    set: Setter,
    args: ShapeUpdateAtomProps<K>,
  ) => {
    return set(SHAPE_UPDATE_BATCH_ATOM, args);
  },
);
