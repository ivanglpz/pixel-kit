import { IProject } from "@/db/schemas/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SET_PROJECTS_FROM_TABS } from "./projects";

export const TABS_ID = "tabs_app";

export const TABS_PERSIST_ATOM = atomWithStorage<IProject[]>(TABS_ID, []);

export const GET_PROJECTS = (): IProject[] => {
  const response = localStorage.getItem(TABS_ID);
  if (!response) return [];
  return JSON.parse(response);
};
export const ADD_TAB_ATOM = atom(null, (get, set, args: IProject) => {
  const FIND_TAB = get(TABS_PERSIST_ATOM);
  if (FIND_TAB.some((e) => e._id === args?._id)) return;

  set(TABS_PERSIST_ATOM, [...FIND_TAB, args]);
  set(SET_PROJECTS_FROM_TABS);
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
    set(SET_PROJECTS_FROM_TABS);
  }
);
