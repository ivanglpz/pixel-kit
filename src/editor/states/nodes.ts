import { atom } from "jotai";
import { SHAPE_ID_ATOM } from "./shape";
import ALL_SHAPES_ATOM from "./shapes";

export const CHANGE_SHAPE_NODE_ATOM = atom(
  null,
  (get, set, args: { endId: string }) => {
    const shapes = get(ALL_SHAPES_ATOM);
    const startId = get(SHAPE_ID_ATOM);
    const findStart = shapes?.find((e) => e?.id === startId);

    const findEnd = shapes?.find((i) => i?.id === args?.endId);

    if (!findEnd || !findStart) return;

    if (findStart?.id === findEnd?.id) return;
    if (findStart?.id === findEnd?.parentId) return;
    if (findEnd?.tool !== "GROUP") return;

    const shapeEnd = get(findEnd.state);
    const shapeStart = get(findStart.state);

    const relativeX = shapeStart.x - shapeEnd.x;
    const relativeY = shapeStart.y - shapeEnd.y;

    const newState = {
      ...shapeStart,
      parentId: shapeEnd?.id,
      x: relativeX,
      y: relativeY,
    };

    set(findStart?.state, newState);

    set(
      ALL_SHAPES_ATOM,
      shapes?.map((shape) =>
        shape?.id === findStart?.id
          ? { ...shape, parentId: newState?.parentId }
          : shape
      )
    );
  }
);

export const CHANGE_PARENTID_NODE_ATOM = atom(
  null,
  (get, set, args: { endId: string | null }) => {
    const shapes = get(ALL_SHAPES_ATOM);
    const startId = get(SHAPE_ID_ATOM);

    // 🔍 Encontramos el shape que estamos moviendo
    const findStart = shapes.find((e) => e.id === startId);
    if (!findStart) return;

    // ✅ Caso 1: Soltado fuera → parentId null
    if (args.endId === null) {
      set(findStart.state, { ...get(findStart.state), parentId: null });

      set(
        ALL_SHAPES_ATOM,
        shapes.map((shape) =>
          shape.id === findStart.id ? { ...shape, parentId: null } : shape
        )
      );

      return;
    }

    // ✅ Caso 2: Verificar si el endId existe y es GROUP
    const findEnd = shapes.find((i) => i.id === args.endId);
    if (!findEnd || findEnd.tool !== "GROUP") return;

    // ❌ Evitar relacionarse con uno mismo
    if (findStart.id === findEnd.id) return;

    // ✅ Actualizar solo el parentId
    set(findStart.state, {
      ...get(findStart.state),
      parentId: findEnd.id,
    });

    set(
      ALL_SHAPES_ATOM,
      shapes.map((shape) =>
        shape.id === findStart.id ? { ...shape, parentId: findEnd.id } : shape
      )
    );
  }
);
