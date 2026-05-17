import { atom } from "jotai";
import { flexLayoutAtom } from "../shapes/layout-flex";
import { cloneShapeJson, cloneShapeRecursive } from "./projects";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, {
  buildLookup,
  cloneStateRecursive,
  computeAncestorOffset,
  PLANE_SHAPES_ATOM,
  SHAPE_BASE_CHILDREN,
} from "./shapes";

type ClipboardProps = {
  mode: "COPY" | "CUT";
  shapes: SHAPE_BASE_CHILDREN[];
};

export const CLIPBOARD_ATOM = atom<ClipboardProps | null>(null);

export const SET_CLIPBOARD_ATOM = atom(
  null,
  (get, set, args: ClipboardProps["mode"]) => {
    const planeShapes = get(PLANE_SHAPES_ATOM);
    const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);

    const selected = planeShapes
      .filter((shape) => selectedIds.some((s) => s.id === shape.id))
      .map((shape) => cloneShapeJson(get)(shape));

    if (selected.length === 0) {
      set(CLIPBOARD_ATOM, null);
      return;
    }

    set(CLIPBOARD_ATOM, {
      shapes: selected,
      mode: args,
    });
  },
);

export const PASTE_FROM_CLIPBOARD_ATOM = atom(null, (get, set) => {
  const clipboard = get(CLIPBOARD_ATOM);
  const PLANE = get(PLANE_SHAPES_ATOM);
  if (!clipboard) return;
  if (clipboard.mode === "CUT") {
    const SHAPES = clipboard.shapes?.map((e) =>
      cloneShapeRecursive(e, { parentIdNull: true }),
    );
    set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), ...SHAPES]);
    set(CLIPBOARD_ATOM, null);
  }
  if (clipboard.mode === "COPY") {
    const SHAPES = clipboard.shapes?.map((e) =>
      cloneShapeRecursive(e, { parentIdNull: false }),
    );
    const lookup = buildLookup(SHAPES);
    const offsetOf = computeAncestorOffset(get)(lookup);

    SHAPES.forEach((shape) => {
      const newShape = cloneStateRecursive(get, offsetOf, { x: 0, y: 0 })(
        shape,
        get(get(shape.state).parentId),
        true,
      );

      const FIND_SHAPE = PLANE.find((e) => e?.id === get(newShape?.parentId));

      if (FIND_SHAPE) {
        const children = get(FIND_SHAPE.state).children;
        set(children, [
          ...get(children),
          { id: newShape.id, state: atom(newShape) },
        ]);
        set(flexLayoutAtom, { id: get(newShape?.parentId) });
      } else {
        set(ALL_SHAPES_ATOM, [
          ...get(ALL_SHAPES_ATOM),
          { id: newShape.id, state: atom(newShape) },
        ]);
      }
    });

    set(CLIPBOARD_ATOM, null);
  }
});
