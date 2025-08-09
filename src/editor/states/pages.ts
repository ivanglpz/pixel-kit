import { atom, PrimitiveAtom } from "jotai";
import { MODE } from "../hooks/useConfiguration";
import { WithInitialValue } from "./shapes";

type IPage = {
  id: string;
  name: string;
  color: PrimitiveAtom<string> & WithInitialValue<string>;
  isVisible: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  type: MODE;
};
export const PAGES_ATOM = atom<IPage[]>([
  {
    id: "f860ad7b-27ac-491a-ba77-1a81f004dac1",
    name: "Page 1",
    color: atom("#f0f0f0"),
    isVisible: atom(true),
    type: "EDIT_IMAGE",
  },
  {
    id: "bc0631c9-e167-4cef-887c-4d6f9b4d8dc6",
    name: "Page 1",
    color: atom("#f0f0f0"),
    isVisible: atom(true),
    type: "FREE_DRAW",
  },
  {
    id: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
    name: "Page 1",
    color: atom("#f0f0f0"),
    isVisible: atom(true),
    type: "DESIGN_MODE",
  },
]);
