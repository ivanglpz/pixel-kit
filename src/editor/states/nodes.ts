import { atom } from "jotai";
import SHAPES_ATOM, { SHAPES_NODES } from "./shapes";

export const NODE_ATOM = atom<SHAPES_NODES | null>(null);

export const CHANGE_SHAPE_NODE_ATOM = atom(
  null,
  (get, set, args: { id: string }) => {
    const nodes = get(SHAPES_ATOM);
    const changeNode = get(NODE_ATOM);
    if (!changeNode) return;

    // Flatten recursivo
    function flatten(nodes: SHAPES_NODES[]): SHAPES_NODES[] {
      return nodes.flatMap((node) => {
        const children = get(node.childrens);
        return [node, ...flatten(children)];
      });
    }

    const allNodes = flatten(nodes);

    // 1. Filtrar solo GROUPS
    const allGroups = allNodes.filter((node) => node.tool === "GROUP");

    // 2. Eliminar el changeNode de cualquier grupo que lo tenga como hijo
    allGroups.forEach((group) => {
      const children = get(group.childrens);
      const filtered = children.filter((child) => child.id !== changeNode.id);
      if (filtered.length !== children.length) {
        set(group.childrens, filtered);
      }
    });

    // 3. Buscar el nuevo grupo destino
    const targetGroup = allGroups.find((g) => g.id === args.id);
    if (!targetGroup) return;

    // 4. Insertar el nodo dentro del grupo destino
    const currentChildren = get(targetGroup.childrens);
    set(targetGroup.childrens, [...currentChildren, changeNode]);

    // 5. Eliminar el nodo de la raíz
    set(
      SHAPES_ATOM,
      nodes.filter((n) => n.id !== changeNode.id)
    );

    // 6. Resetear selección
    set(NODE_ATOM, null);
  }
);
