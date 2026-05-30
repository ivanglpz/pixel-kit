import {
  BUILD_PROJECS_FROM_TABS,
  PROJECT_ID_ATOM,
  PROJECTS_ATOM,
  REMOVE_PROJECT_TAB_ATOM,
} from "@/editor/states/projects";
import { GET_TABS_BY_USER, TABS_PERSIST_ATOM } from "@/editor/states/tabs";
import { userAtom } from "@/jotai/user";
import {
  ProjectTabsShell,
  type ProjectTabItem,
} from "@pixelkit/editor";
import { getDefaultStore, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Profile } from "./Profile";

export const TabsProjects = () => {
  const router = useRouter();
  const listProjects = useAtomValue(PROJECTS_ATOM);
  const [selected, setSelected] = useAtom(PROJECT_ID_ATOM);
  const setDelete = useSetAtom(REMOVE_PROJECT_TAB_ATOM);
  const SET = useSetAtom(BUILD_PROJECS_FROM_TABS);
  useAtomValue(TABS_PERSIST_ATOM);
  const user = useAtomValue(userAtom);
  useAtomValue(GET_TABS_BY_USER);
  const store = getDefaultStore();

  const tabs = useMemo<ProjectTabItem[]>(
    () =>
      listProjects.map((project) => ({
        id: project.ID,
        label: store.get(project.name),
      })),
    [listProjects, store],
  );

  useEffect(() => {
    SET();
  }, [user.data?.user?.userId]);

  const handleCloseTab = (projectId: string) => {
    const currentIndex = listProjects.findIndex((project) => project.ID === projectId);
    const isSelectedTab = selected === projectId;
    const remaining = listProjects.filter((project) => project.ID !== projectId);

    setDelete(projectId);

    if (!isSelectedTab) return;

    const nextProject =
      remaining[Math.max(0, currentIndex - 1)] ?? remaining.at(0) ?? null;

    if (!nextProject) {
      setSelected(null);
      router.push("/app");
      return;
    }

    setSelected(nextProject.ID);
    router.push(`/app/project/${nextProject.ID}`);
  };

  return (
    <ProjectTabsShell
      tabs={tabs}
      activeTabId={selected ?? undefined}
      onGoHome={() => {
        router.push("/app");
      }}
      onSelectTab={(projectId) => {
        setSelected(projectId);
        router.push(`/app/project/${projectId}`);
      }}
      onCloseTab={handleCloseTab}
      onCreateTab={() => {
        router.push("/app/project/create");
      }}
      rightSlot={<Profile />}
    />
  );
};
