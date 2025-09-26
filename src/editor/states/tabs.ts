import { IProject } from "@/db/schemas/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const TABS_PERSIST_ATOM = atomWithStorage<IProject[]>("tabs_app", []);

export const ADD_TAB_ATOM = atom(null, (get, set, args: IProject) => {
  const FIND_TAB = get(TABS_PERSIST_ATOM);
  if (FIND_TAB.some((e) => e._id === args?._id)) return;

  set(TABS_PERSIST_ATOM, [...FIND_TAB, args]);
});

export const UPDATE_TAB_ATOM = atom(
  null,
  (get, set, args: Pick<IProject, "_id" | "name" | "data">) => {
    set(
      TABS_PERSIST_ATOM,
      get(TABS_PERSIST_ATOM).map((el) =>
        el._id === args._id ? { ...el, ...args } : el
      )
    );
  }
);
