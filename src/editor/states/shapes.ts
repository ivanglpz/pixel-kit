import { IShape } from "@/editor/shapes/type.shape";
import { atom, PrimitiveAtom } from "jotai";
import { PAGE_ID_ATOM } from "./pages";
import { PROJECT_ATOM } from "./projects";
import { SHAPE_IDS_ATOM } from "./shape";
import { IKeyMethods } from "./tool";
import { NEW_UNDO_REDO } from "./undo-redo";

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IKeyMethods;
  pageId: string;
  state: PrimitiveAtom<IShape> & WithInitialValue<IShape>;
};

export const ALL_SHAPES_ATOM = atom(
  (get) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("Page  shapes is require");
    }
    return get(FIND_PAGE.SHAPE.LIST);
  },
  (get, set, newTool: ALL_SHAPES[]) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("Page  shapes is require");
    }
    set(FIND_PAGE.SHAPE.LIST, newTool);
    return;
  }
);

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
  const currentShapes = get(ALL_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);
});

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: IShape) => {
  if (!args || !args?.id) return;
  const newAllShape: ALL_SHAPES = {
    id: args?.id,
    tool: args?.tool,
    state: atom({
      ...args,
      children: atom(
        args?.children ? get(args.children) : ([] as ALL_SHAPES[])
      ),
    }),
    pageId: get(PAGE_ID_ATOM),
  };
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
  set(NEW_UNDO_REDO, {
    shapes: [newAllShape],
    type: "CREATE",
  });
});

export default ALL_SHAPES_ATOM;
