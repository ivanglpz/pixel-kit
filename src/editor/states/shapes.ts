import { IShape } from "@/editor/shapes/type.shape";
import { Atom, atom } from "jotai";
import { IKeyMethods } from "./tool";

type IOBCElement = {
  id: string;
  tool: IKeyMethods;
  state: Atom<IShape>;
};

const SHAPES_ATOM = atom([] as IOBCElement[]);

export const CLEAR_SHAPES_ATOM = atom(null, (get, set) => {
  set(SHAPES_ATOM, []);
});

export const DELETE_SHAPE_ATOM = atom(
  null,
  (get, set, args: { id: string }) => {
    set(
      SHAPES_ATOM,
      get(SHAPES_ATOM).filter((e) => e?.id !== args?.id)
    );
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
    },
  ]);
});

export default SHAPES_ATOM;
