import { Button } from "@/components/ui/button";
import { Input as InputShadcn } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/editor/components/input";
import {
  type IPROJECT,
  BUILD_PROJECS_FROM_TABS,
  PROJECT_ID_ATOM,
  PROJECTS_ATOM,
  REMOVE_PROJECT_TAB_ATOM,
} from "@/editor/states/projects";
import { START_TIMER_ATOM } from "@/editor/states/timer";
import { GET_TABS_BY_USER, TABS_PERSIST_ATOM } from "@/editor/states/tabs";
import { userAtom } from "@/jotai/user";
import {
  ProjectTabsShell,
  type ProjectTabContextMenuEntry,
  type ProjectTabItem,
} from "@pixelkit/editor";
import { copyToClipboard } from "@/utils/clipboard";
import { getDefaultStore, useAtom, useAtomValue, useSetAtom } from "jotai";
import { css } from "@stylespixelkit/css";
import { Clipboard } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, type ReactNode } from "react";
import { Profile } from "./Profile";

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p
    className={css({
      fontSize: "sm",
      fontWeight: 600,
    })}
  >
    {children}
  </p>
);

const TabNameSection = ({ project }: { project: IPROJECT }) => {
  const [text, setText] = useAtom(project.name);
  const start = useSetAtom(START_TIMER_ATOM);

  return (
    <div className="flex flex-col gap-1">
      <SectionLabel>Name</SectionLabel>
      <Input.withPause>
        <InputShadcn
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            start();
          }}
        />
      </Input.withPause>
    </div>
  );
};

const TabPublicSection = ({ project }: { project: IPROJECT }) => {
  const [isPublic, setIsPublic] = useAtom(project.ISPUBLIC);
  const start = useSetAtom(START_TIMER_ATOM);

  return (
    <div className="flex items-center justify-between gap-4">
      <SectionLabel>Public</SectionLabel>
      <Switch
        checked={isPublic}
        onCheckedChange={() => {
          setIsPublic(!isPublic);
          start();
        }}
      />
    </div>
  );
};

const TabUrlSection = ({ project }: { project: IPROJECT }) => {
  const isPublic = useAtomValue(project.ISPUBLIC);
  const url = useMemo(
    () => `${window.location.origin}/project/${project.ID}`,
    [project.ID],
  );

  if (!isPublic) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <SectionLabel>URL</SectionLabel>
      <div className="flex flex-row gap-2">
        <Input.withPause>
          <InputShadcn readOnly value={`${window.location.host}/project/${project.ID}`} />
        </Input.withPause>
        <Button
          variant="default"
          className="flex w-10 items-center justify-center"
          onClick={() => {
            copyToClipboard({ text: url });
          }}
        >
          <Clipboard size={14} />
        </Button>
      </div>
    </div>
  );
};

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

  const getContextMenuOptions = (tab: ProjectTabItem): ProjectTabContextMenuEntry[] => {
    const project = listProjects.find((item) => item.ID === tab.id);

    if (!project) {
      return [];
    }

    return [
      {
        id: "name",
        render: () => <TabNameSection project={project} />,
      },
      {
        id: "public",
        render: () => <TabPublicSection project={project} />,
      },
      {
        id: "url",
        render: () => <TabUrlSection project={project} />,
      },
    ];
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
      getContextMenuOptions={getContextMenuOptions}
      rightSlot={<Profile />}
    />
  );
};
