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
  children: PrimitiveAtom<ALL_SHAPES[]> & WithInitialValue<ALL_SHAPES[]>;
};

export const ALL_SHAPES_ATOM = atom(
  // (get) => get(get(PROJECT_ATOM)..LIST),
  // (_get, _set, newTool: ALL_SHAPES[]) => {
  //   const toolAtom = _get(PROJECT_ATOM).SHAPE.LIST;
  //   _set(toolAtom, newTool);
  // }
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
        get(node.children).length > 0
          ? getAllShapes(get(node.children) as ALL_SHAPES[])
          : [];
      return [{ ...node }, ...children];
    });

  return getAllShapes(get(ALL_SHAPES_ATOM));
});

export const DELETE_SHAPES_ATOM = atom(null, (get, set) => {
  const currentShapes = get(ALL_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);
  // const shape = currentShapes.find((e) => e.id === args.id);
  // if (!shape) return;

  // // ✅ 1. Función recursiva para obtener todos los hijos en cascada
  // const getAllChildren = (
  //   parentId: string,
  //   shapes: ALL_SHAPES[]
  // ): ALL_SHAPES[] => {
  //   const directChildren = shapes.filter((s) => s.parentId === parentId);
  //   if (directChildren.length === 0) return [];

  //   return directChildren.flatMap((child) => [
  //     child,
  //     ...getAllChildren(child.id, shapes),
  //   ]);
  // };

  // ✅ 2. Obtenemos todos los shapes a eliminar
  // const shapesToDelete =
  //   shape.tool === "GROUP"
  //     ? [shape, ...getAllChildren(shape.id, currentShapes)]
  //     : [shape];

  // ✅ 3. Guardamos en el undo/redo ANTES de eliminar
  // set(NEW_UNDO_REDO, {
  //   type: "DELETE",
  //   shapes: shapesToDelete.map((s) => ({
  //     ...s,
  //     // Importante: en vez del atom guardamos el valor plano del estado
  //     state: get(s.state),
  //   })),
  // });

  // // ✅ 4. Filtramos para actualizar ALL_SHAPES_ATOM
  // const idsToDelete = shapesToDelete.map((s) => s.id);
  // const newShapes = currentShapes.filter((s) => !idsToDelete.includes(s.id));

  // set(ALL_SHAPES_ATOM, newShapes);
});

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: IShape) => {
  if (!args || !args?.id) return;

  const newAllShape: ALL_SHAPES = {
    id: args?.id,
    tool: args?.tool,
    state: atom(args),
    pageId: get(PAGE_ID_ATOM),
    children: atom([] as ALL_SHAPES[]),
  };
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
  set(NEW_UNDO_REDO, {
    shapes: [newAllShape],
    type: "CREATE",
  });
});

export default ALL_SHAPES_ATOM;
