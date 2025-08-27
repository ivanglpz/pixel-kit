import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import { EVENT_ATOM } from "./event";
import { IPageShapeIds, PAGE_ID_ATOM } from "./pages";
import { PROJECT_ATOM } from "./projects";
import ALL_SHAPES_ATOM from "./shapes";

export const SHAPE_IDS_ATOM = atom(
  (get) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("SHAPE_IDS_ATOM_GET: Page not found");
    }
    return get(FIND_PAGE.SHAPE.ID);
  },
  (get, _set, shape: IPageShapeIds) => {
    // const ids = get(PROJECT_ATOM).SHAPE.ID;
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("SHAPE_IDS_ATOM_SET: Page not found");
    }
    const ids = FIND_PAGE.SHAPE.ID;
    const event = get(EVENT_ATOM);
    const listIds = get(ids);

    if (event === "MULTI_SELECT") {
      const findId = listIds?.some(
        (e) => e?.id === shape.id && e?.parentId === shape.parentId
      );

      if (findId) {
        _set(
          ids,
          listIds?.filter(
            (e) => e?.id === shape.id && e?.parentId === shape.parentId
          )
        );

        return;
      }
      _set(ids, [...listIds, shape]);
      return;
    }

    _set(ids, [shape]);
  }
);
export const UPDATE_SHAPES_IDS_ATOM = atom(
  null,
  (get, set, args: IPageShapeIds[]) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("UPDATE_SHAPES_IDS_ATOM_GET: Page not found");
    }
    const ids = FIND_PAGE.SHAPE.ID;

    set(ids, args);
  }
);

export const REMOVE_SHAPE_ID_ATOM = atom(
  null,
  (get, set, args: IPageShapeIds) => {
    const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
    const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
    if (!FIND_PAGE) {
      throw new Error("REMOVE_SHAPE_ID_ATOM_GET: Page not found");
    }
    const ids = FIND_PAGE.SHAPE.ID;

    const listIds = get(FIND_PAGE.SHAPE.ID);

    set(
      ids,
      listIds?.filter((e) => e?.id === args.id && e?.parentId === args.parentId)
    );
  }
);
export const RESET_SHAPES_IDS_ATOM = atom(null, (get, set) => {
  const PAGES = get(get(PROJECT_ATOM).PAGE.LIST);
  const FIND_PAGE = PAGES.find((e) => e?.id === get(PAGE_ID_ATOM));
  if (!FIND_PAGE) {
    throw new Error("RESET_SHAPES_IDS_ATOM_GET: Page not found");
  }
});
export const SHAPE_SELECTED_ATOM = atom((get) => {
  const shapeSelected = get(SHAPE_IDS_ATOM).at(0);
  const shape = get(ALL_SHAPES_ATOM)?.find(
    (e) =>
      e?.id === shapeSelected?.id &&
      get(e?.state).parentId === shapeSelected.parentId
  );

  if (!shape || !shape.state) return null;

  return get(shape?.state);
});

export const GET_SELECTED_SHAPES_ATOM = atom((get) => {
  return () => {
    // const rootShapes = get(ALL_SHAPES_ATOM);
    // const selectedIds = get(SHAPE_IDS_ATOM);

    // if (!rootShapes) return [];

    // // Función para obtener todos los hijos de un grupo recursivamente
    // const getGroupChildren = (groupId: string): string[] => {
    //   const children = rootShapes
    //     .filter((shape) => get(shape?.state)?.parentId === groupId)
    //     .map((shape) => shape.id);

    //   // Recursivamente obtener hijos de grupos anidados
    //   const nestedChildren = children.flatMap((childId) => {
    //     const childShape = rootShapes.find((s) => s.id === childId);
    //     if (childShape && get(childShape.state)?.tool === "GROUP") {
    //       return getGroupChildren(childId);
    //     }
    //     return [];
    //   });

    //   return [...children, ...nestedChildren];
    // };

    // // Obtener todas las formas seleccionadas y sus dependencias
    // const allSelectedIds = new Set<string>();

    // selectedIds.forEach((id) => {
    //   const shape = rootShapes.find((s) => s.id === id);
    //   if (shape) {
    //     allSelectedIds.add(id);

    //     // Si es un grupo, agregar todos sus hijos
    //     if (get(shape.state)?.tool === "GROUP") {
    //       const children = getGroupChildren(id);
    //       children.forEach((childId) => allSelectedIds.add(childId));
    //     }
    //   }
    // });
    return [];
    // Filtrar y mapear las formas
    // return rootShapes
    //   .filter((shape) => allSelectedIds.has(shape.id))
    //   .map((shape) => get(shape.state));
  };
});

export const SHAPE_UPDATE_ATOM = atom(
  null,
  (get, set, args: Partial<IShape>) => {
    // const findShape = get(ALL_SHAPES_ATOM)?.find(
    //   (e) => e?.id === get(SHAPE_IDS_ATOM).at(0)
    // );
    // if (!findShape || !findShape.state) return null;
    // set(findShape?.state, { ...get(findShape.state), ...args });
  }
);
