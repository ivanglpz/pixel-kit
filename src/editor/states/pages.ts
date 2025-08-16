import { atom, PrimitiveAtom } from "jotai";
import { MODE, MODE_ATOM } from "../hooks/useConfiguration";
import { PROJECT_ATOM } from "./projects";
import { WithInitialValue } from "./shapes";

export type IPage = {
  id: string;
  name: PrimitiveAtom<string> & WithInitialValue<string>;
  color: PrimitiveAtom<string> & WithInitialValue<string>;
  isVisible: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  type: MODE;
};
export const PAGES_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).PAGE.LIST),
  (_get, _set, newTool: IPage[]) => {
    const toolAtom = _get(PROJECT_ATOM).PAGE.LIST;
    _set(toolAtom, newTool);
  }
);

export const PAGE_ID_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).PAGE.ID),
  (_get, _set, newTool: string) => {
    const toolAtom = _get(PROJECT_ATOM).PAGE.ID;
    _set(toolAtom, newTool);
  }
);

export const RESET_PAGE_ID_ATOM = atom(null, (get, set) => {
  const mode = get(MODE_ATOM);
  const pages = get(PAGES_ATOM);
  const page = pages.find((p) => p.type === mode);
  if (!page) {
    throw new Error(`No page found for mode: ${mode}`);
  }
  set(PAGE_ID_ATOM, page.id);
});

export const PAGES_BY_TYPE_ATOM = atom((get) => {
  const mode = get(MODE_ATOM);
  const pages = get(PAGES_ATOM);
  return pages.filter((p) => p.type === mode);
});

export const NEW_PAGE = atom(null, (get, set) => {
  const mode = get(MODE_ATOM);

  const pages = get(PAGES_ATOM);
  const pagesByType = pages.filter((p) => p.type === mode);
  const newPage: IPage = {
    id: crypto.randomUUID(),
    name: atom(`Page ${pagesByType.length + 1}`),
    color: atom("#f0f0f0"),
    isVisible: atom(true),
    type: mode,
  };
  set(PAGES_ATOM, [...pages, newPage]);
});

export const DELETE_PAGE = atom(null, (get, set, id: string) => {
  const pages = get(PAGES_ATOM);
  if (pages.length === 1) return; // at least one page
  set(
    PAGES_ATOM,
    pages.filter((p) => p.id !== id)
  );
});
