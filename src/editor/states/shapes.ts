import { IShape } from "@/editor/shapes/type.shape";
import { Atom, atom, PrimitiveAtom } from "jotai";
import { IKeyMethods } from "./tool";

export type WithInitialValue<Value> = {
  init: Value;
};
export type SHAPES_NODES = {
  id: string;
  tool: IKeyMethods;
  state: Atom<IShape>;
  childrens: PrimitiveAtom<SHAPES_NODES[]> & WithInitialValue<SHAPES_NODES[]>;
};

const SHAPES_ATOM = atom([] as SHAPES_NODES[]);

export const CLEAR_SHAPES_ATOM = atom(null, (get, set) => {
  set(SHAPES_ATOM, []);
});

export const DELETE_SHAPE_ATOM = atom(
  null,
  (get, set, args: { id: string }) => {
    function deleteRecursive(nodes: SHAPES_NODES[]): SHAPES_NODES[] {
      return nodes
        .map((node) => {
          const children = get(node.childrens);
          const newChildren = deleteRecursive(children);
          if (children.length !== newChildren.length) {
            set(node.childrens, newChildren);
          }
          return node;
        })
        .filter((node) => node.id !== args.id);
    }

    const currentShapes = get(SHAPES_ATOM);
    const newShapes = deleteRecursive(currentShapes);
    set(SHAPES_ATOM, newShapes);
  }
);

export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: IShape) => {
  if (!args || !args?.id) return;

  set(SHAPES_ATOM, [
    ...get(SHAPES_ATOM),
    {
      id: args?.id,
      tool: args?.tool,
      state: atom(args),
      childrens: atom<SHAPES_NODES[]>([]),
    },
  ]);
});

export default SHAPES_ATOM;
