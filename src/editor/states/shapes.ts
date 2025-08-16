import { IShape } from "@/editor/shapes/type.shape";
import { atom, PrimitiveAtom } from "jotai";
import { PAGE_ID_ATOM } from "./pages";
import { PROJECT_ATOM } from "./projects";
import { IKeyMethods } from "./tool";

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IKeyMethods;
  parentId: string | null;
  pageId: string;
  state: PrimitiveAtom<IShape> & WithInitialValue<IShape>;
};

export const ALL_SHAPES_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).SHAPE.LIST),
  (_get, _set, newTool: ALL_SHAPES[]) => {
    const toolAtom = _get(PROJECT_ATOM).SHAPE.LIST;
    _set(toolAtom, newTool);
  }
);

export const ROOT_SHAPES_ATOM = atom((get) =>
  get(ALL_SHAPES_ATOM)?.filter(
    (e) => e?.parentId === null && e?.pageId === get(PAGE_ID_ATOM)
  )
);

export const CLEAR_SHAPES_ATOM = atom(null, (get, set) => {
  set(ALL_SHAPES_ATOM, []);
});

export const DELETE_SHAPE_ATOM = atom(
  null,
  (get, set, args: { id: string }) => {
    const currentShapes = get(ALL_SHAPES_ATOM);
    const shape = currentShapes.find((e) => e.id === args.id);
    if (!shape) return;

    // ✅ 1. Función recursiva para obtener todos los hijos en cascada
    const getAllChildrenIds = (
      parentId: string,
      shapes: ALL_SHAPES[]
    ): string[] => {
      const directChildren = shapes.filter((s) => s.parentId === parentId);
      if (directChildren.length === 0) return [];

      // Recorremos cada hijo, y si es GROUP también obtenemos sus hijos
      return directChildren.flatMap((child) => [
        child.id,
        ...getAllChildrenIds(child.id, shapes),
      ]);
    };

    // ✅ 2. Obtenemos todos los hijos en cascada (si es GROUP)
    const idsToDelete =
      shape.tool === "GROUP"
        ? [shape.id, ...getAllChildrenIds(shape.id, currentShapes)]
        : [shape.id];

    // ✅ 3. Filtramos
    const newShapes = currentShapes.filter((s) => !idsToDelete.includes(s.id));

    set(ALL_SHAPES_ATOM, newShapes);
  }
);

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: IShape) => {
  if (!args || !args?.id) return;

  set(ALL_SHAPES_ATOM, [
    ...get(ALL_SHAPES_ATOM),
    {
      id: args?.id,
      tool: args?.tool,
      state: atom(args),
      parentId: null,
      pageId: get(PAGE_ID_ATOM),
    },
  ]);
});

export default ALL_SHAPES_ATOM;
