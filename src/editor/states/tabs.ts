import { IProject } from "@/db/schemas/types";
import { userAtom } from "@/jotai/user";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { BUILD_PROJECS_FROM_TABS } from "./projects";

export const TABS_ID = "tabs_app";

export type TabsProps = Omit<IProject, "data" | "name"> & { userId: string };

export const TABS_PERSIST_ATOM = atomWithStorage<TabsProps[]>(TABS_ID, []);

export const GET_TABS_BY_USER = atom((get) => {
  const tabs = get(TABS_PERSIST_ATOM);
  const user = get(userAtom);
  return tabs.filter((e) => e.userId === user?.data?.user?.userId);
});

export const ADD_TAB_ATOM = atom(null, (get, set, args: IProject) => {
  const FIND_TAB = get(TABS_PERSIST_ATOM);
  if (FIND_TAB.some((e) => e._id === args?._id)) return;

  const user = get(userAtom);

  set(TABS_PERSIST_ATOM, [
    ...FIND_TAB,
    { ...args, userId: user?.data?.user?.userId || "" },
  ]);
  set(BUILD_PROJECS_FROM_TABS);
});
