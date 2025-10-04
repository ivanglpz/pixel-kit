import { IProject } from "@/db/schemas/types";
import { userAtom } from "@/jotai/user";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SET_PROJECTS_FROM_TABS } from "./projects";

export const TABS_ID = "tabs_app";

export type TabsProps = Omit<IProject, "data"> & { userId: string };

export const TABS_PERSIST_ATOM = atomWithStorage<TabsProps[]>(TABS_ID, []);

export const GET_PROJECTS_BY_USER = atom((get) => {
  const response = localStorage.getItem(TABS_ID);
  if (!response) return [];

  const projects = JSON.parse(response) as TabsProps[];

  const user = get(userAtom);
  return projects.filter((e) => e.userId === user?.data?.user?.userId);
});

export const ADD_TAB_ATOM = atom(null, (get, set, args: IProject) => {
  const FIND_TAB = get(TABS_PERSIST_ATOM);
  if (FIND_TAB.some((e) => e._id === args?._id)) return;

  const user = get(userAtom);

  set(TABS_PERSIST_ATOM, [
    ...FIND_TAB,
    { ...args, userId: user?.data?.user?.userId || "" },
  ]);
  set(SET_PROJECTS_FROM_TABS);
});

export const UPDATE_TAB_ATOM = atom(
  null,
  (get, set, args: Pick<IProject, "_id" | "name">) => {
    set(
      TABS_PERSIST_ATOM,
      get(TABS_PERSIST_ATOM).map((el) =>
        el._id === args._id ? { ...el, ...args } : el
      )
    );
    // set(SET_PROJECTS_FROM_TABS);
  }
);
