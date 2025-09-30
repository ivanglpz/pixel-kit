import { IShape, IShapeChildren } from "@/editor/shapes/type.shape";
import { atom, PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import {
  cloneDeep,
  CreateShapeSchema,
  UpdateShapeDimension,
} from "../helpers/shape-schema";
import { capitalize } from "../utils/capitalize";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "./currentItem";
import { DRAW_START_CONFIG_ATOM } from "./drawing";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, PAGE_ID_ATOM } from "./pages";
import {
  RESET_SHAPES_IDS_ATOM,
  SHAPE_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "./shape";
import TOOL_ATOM, { IShapesKeys } from "./tool";
import { NEW_UNDO_REDO } from "./undo-redo";

export type WithInitialValue<Value> = {
  init: Value;
};
export type ALL_SHAPES = {
  id: string;
  tool: IShapesKeys;
  // pageId: string | null;
  state: PrimitiveAtom<IShape> & WithInitialValue<IShape>;
};

export type ALL_SHAPES_CHILDREN = Omit<ALL_SHAPES, "state"> & {
  state: IShapeChildren;
};
const TOOLS_BOX_BASED = ["FRAME", "IMAGE", "TEXT"];

const TOOLS_DRAW_BASED = ["DRAW"];
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
  const shapesSelected = get(SHAPE_IDS_ATOM);

  for (const element of shapesSelected) {
    if (element.parentId) {
      const FIND_SHAPE = currentShapes.find((w) => w.id === element.parentId);

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
  (get, set, id: string): ALL_SHAPES_CHILDREN[] => {
    const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
    const FIND_SHAPE = PLANE_SHAPES.find((e) => e.id === id);
    if (!FIND_SHAPE) return [];

    const sanitizemap = (shape: ALL_SHAPES): ALL_SHAPES_CHILDREN => {
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
  set(NEW_UNDO_REDO, {
    type: "DELETE",
    shapes: currentShapes,
  });
});

// ===== Funciones de movimiento actualizadas =====

export const MOVE_SHAPES_BY_ID = atom(null, (get, set, args: string) => {
  const currentShapes = get(PLANE_SHAPES_ATOM);
  const shapesSelected = get(SHAPE_IDS_ATOM);
  const selectedShapes = currentShapes.filter((w) =>
    shapesSelected.some((e) => e.id === w.id)
  );
  const FIND_SHAPE = currentShapes.find((s) => s.id === args);
  if (!FIND_SHAPE) return;

  // Guardar estado anterior para undo/redo
  const prevShapes = [...selectedShapes];

  // recrea un árbol fresco con atom nuevos
  const cloneShapeRecursive = (
    shape: ALL_SHAPES,
    parentId: string
  ): ALL_SHAPES => {
    return {
      id: shape.id,
      // pageId: shape.pageId,
      tool: shape.tool,
      state: atom<IShape>({
        ...get(shape.state),
        parentId,
        children: atom(
          get(get(shape.state).children).map((c) =>
            cloneShapeRecursive(c, shape.id)
          )
        ),
      }),
    };
  };

  const result = selectedShapes.map((s) =>
    cloneShapeRecursive(s, get(FIND_SHAPE.state).id)
  );

  // agregar nuevos hijos con referencia fresca
  set(FIND_SHAPE.state, {
    ...get(FIND_SHAPE.state),
    children: atom([...get(get(FIND_SHAPE.state).children), ...result]),
  });

  // remover de donde estaban antes
  for (const element of shapesSelected) {
    if (element.parentId) {
      const parent = currentShapes.find((r) => r.id === element.parentId);
      if (!parent) continue;
      set(parent.state, {
        ...get(parent.state),
        children: atom(
          get(get(parent.state).children).filter((u) => u.id !== element.id)
        ),
      });
    } else {
      set(
        ALL_SHAPES_ATOM,
        get(ALL_SHAPES_ATOM).filter((e) => e.id !== element.id)
      );
    }
  }

  // Registrar la acción MOVE para undo/redo

  set(NEW_UNDO_REDO, {
    type: "MOVE",
    shapes: result,
    prevShapes: prevShapes,
  });
});

export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
  const SELECTED = get(SHAPE_IDS_ATOM);
  const selectedShapes = PLANE_SHAPES.filter((w) =>
    SELECTED.some((e) => e.id === w.id)
  );

  // Guardar estado anterior para undo/redo
  const prevShapes = [...selectedShapes];

  const cloneShapeRecursive = (shape: ALL_SHAPES): ALL_SHAPES => {
    return {
      id: shape.id,
      // pageId: shape.pageId,
      tool: shape.tool,
      state: atom<IShape>({
        ...get(shape.state),
        parentId: null,
        children: atom(get(get(shape.state).children).map(cloneShapeRecursive)),
      }),
    };
  };

  const result = selectedShapes.map(cloneShapeRecursive);

  // quitar de sus padres
  for (const element of SELECTED) {
    if (element.parentId) {
      const parent = PLANE_SHAPES.find((r) => r.id === element.parentId);
      if (!parent) continue;
      set(parent.state, {
        ...get(parent.state),
        children: atom(
          get(get(parent.state).children).filter((u) => u.id !== element.id)
        ),
      });
    }
  }

  // añadir al root con átomos frescos
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), ...result]);

  // Registrar la acción MOVE para undo/redo
  set(NEW_UNDO_REDO, {
    type: "MOVE",
    shapes: result,
    prevShapes: prevShapes,
  });
});

export const EVENT_DOWN_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const drawConfig = get(DRAW_START_CONFIG_ATOM);
    const tool = get(TOOL_ATOM);
    if (TOOLS_BOX_BASED.includes(tool)) {
      const createStartElement = CreateShapeSchema({
        tool: tool as IShape["tool"],
        x,
        y,
        id: uuidv4(),
        label: capitalize(tool),
      });
      set(CREATE_CURRENT_ITEM_ATOM, [createStartElement]);
    }
    // if (TOOLS_LINE_BASED.includes(tool)) {
    //   const createStartElement = CreateShapeSchema({
    //     ...drawConfig,
    //     tool: tool as IShape["tool"],
    //     x: 0,
    //     y: 0,
    //     points: [x, y],
    //     id: uuidv4(),
    //     label: capitalize(tool),
    //   });
    //   set(CREATE_CURRENT_ITEM_ATOM, [createStartElement]);
    // }
    if (TOOLS_DRAW_BASED.includes(tool)) {
      const createStartElement = CreateShapeSchema({
        ...drawConfig,
        tool: tool as IShape["tool"],
        x: 0,
        y: 0,
        points: [x, y, x, y],
        id: uuidv4(),
        label: capitalize(tool),
      });
      set(CREATE_CURRENT_ITEM_ATOM, [createStartElement]);
    }
    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "CREATING");
  }
);
export const EVENT_DOWN_COPY = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const rootShapes = get(PLANE_SHAPES_ATOM);
    const selectedIds = get(SHAPE_IDS_ATOM);

    if (!rootShapes) return [];

    const shapesSelected = rootShapes.filter((shape) =>
      selectedIds.some((w) => w.id === shape.id)
    );

    //

    const recursiveCloneShape = (
      shape: ALL_SHAPES,
      parentId: string | null = null,
      offset?: { offsetX: number; offsetY: number }
    ): IShape => {
      const state = get(shape.state);
      const newId = uuidv4(); // Generamos un nuevo ID

      return {
        ...cloneDeep(state),
        ...offset,
        id: newId, // también en el state
        parentId, // el parentId que viene del nivel superior
        children: atom<ALL_SHAPES[]>(
          get(state.children)?.map((i) => {
            const newElement = recursiveCloneShape(i, newId);
            return {
              ...i,
              id: newElement.id,
              tool: newElement.tool,
              pageId: get(PAGE_ID_ATOM),
              state: atom(newElement),
            };
          })
        ),
      };
    };
    const newShapes = shapesSelected.map((shape) => {
      const offsetX = args.x - get(shape.state).x;
      const offsetY = args.y - get(shape.state).y;
      return recursiveCloneShape(shape, get(shape.state).parentId, {
        offsetX,
        offsetY,
      });
    });

    // for (const element of newShapes) {
    //   if (get(element.state).parentId) {
    //     const FIND_SHAPE = PLANE_SHAPES?.find(
    //       (w) => w.id === get(element.state).parentId
    //     );
    //     if (!FIND_SHAPE) continue;
    //     const children = get(FIND_SHAPE.state).children;
    //     set(children, [...get(children), element]);
    //   } else {
    //     set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), element]);
    //   }
    // }

    set(RESET_SHAPES_IDS_ATOM);
    set(CREATE_CURRENT_ITEM_ATOM, newShapes);
    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "COPYING");
    // return newShapes;
  }
);

export const EVENT_UP_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);
  for (const newShape of CURRENT_ITEMS) {
    set(CREATE_SHAPE_ATOM, newShape);
  }
  setTimeout(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS?.map((e) => ({
        id: e?.id,
        parentId: e?.parentId,
      }))
    );
  }, 10);
  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});

export const EVENT_COPYING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

    const items = CURRENT_ITEMS?.map((i) => {
      return {
        ...i,
        x: args.x - i.offsetX,
        y: args.y - i.offsetY,
      };
    });
    set(CURRENT_ITEM_ATOM, items);
  }
);

export const EVENT_MOVING_SHAPE = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

    const newShape = CURRENT_ITEMS.at(0);
    if (!newShape) return;

    if (TOOLS_BOX_BASED.includes(newShape.tool)) {
      const updateShape = UpdateShapeDimension(x, y, newShape);
      set(CURRENT_ITEM_ATOM, [updateShape]);
    }
    // if (TOOLS_LINE_BASED.includes(newShape.tool)) {
    //   const updateShape = UpdateShapeDimension(x, y, {
    //     ...newShape,
    //     points: [newShape?.points?.[0] ?? 0, newShape?.points?.[1] ?? 0, x, y],
    //   });
    //   set(CURRENT_ITEM_ATOM, [updateShape]);
    // }
    if (TOOLS_DRAW_BASED.includes(newShape.tool)) {
      const updateShape = UpdateShapeDimension(x, y, {
        ...newShape,
        points: newShape.points?.concat([x, y]),
      });
      set(CURRENT_ITEM_ATOM, [updateShape]);
    }
  }
);

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: IShape) => {
  if (!args || !args?.id) return;

  if (args.parentId) {
    const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find(
      (e) => e.id === args.parentId
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
          state: atom({
            ...args,
            children: atom(
              args?.children ? get(args.children) : ([] as ALL_SHAPES[])
            ),
          }),
          pageId: get(PAGE_ID_ATOM),
        },
      ]),
    };

    set(FIND_SHAPE.state, newElement);
    set(NEW_UNDO_REDO, {
      shapes: [
        {
          ...FIND_SHAPE,
          state: atom(newElement),
          // pageId: get(PAGE_ID_ATOM),
        },
      ],
      type: "CREATE",
    });
    return;
  }

  const result = args?.children ? get(args?.children) : [];

  const newAllShape: ALL_SHAPES = {
    id: args?.id,
    tool: args?.tool,
    state: atom({
      ...args,
      children: atom(result),
    }),
    // pageId: get(PAGE_ID_ATOM),
  };
  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
  set(NEW_UNDO_REDO, {
    shapes: [newAllShape],
    type: "CREATE",
  });
});

export default ALL_SHAPES_ATOM;
