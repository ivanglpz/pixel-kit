import {
  ProjectTabsShell,
  type ProjectTabItem,
} from "@pixelkit/editor";
import type { LocalProjectRecord } from "@pixelkit/core";
import { LogOut } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type ProjectTabsProps = {
  currentProjectId: string;
  userId: string;
  projects: LocalProjectRecord[];
  onOpenHome: VoidFunction;
  onOpenProject: (projectId: string) => void;
  onCreateProject: () => Promise<string | null>;
  onSignOut: VoidFunction;
};

const parseOpenTabs = (value: string | null): string[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((tabId): tabId is string => typeof tabId === "string");
  } catch {
    return [];
  }
};

const dedupe = (ids: string[]) => Array.from(new Set(ids));

export const ProjectTabs = ({
  currentProjectId,
  userId,
  projects,
  onOpenHome,
  onOpenProject,
  onCreateProject,
  onSignOut,
}: ProjectTabsProps) => {
  const [openTabIds, setOpenTabIds] = useState<string[]>([]);
  const storageKey = useMemo(() => `desktop_open_tabs:${userId}`, [userId]);

  const projectMap = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects],
  );

  const sanitizeTabIds = useCallback(
    (tabIds: string[]) =>
      dedupe(tabIds).filter((tabId) => projectMap.has(tabId)),
    [projectMap],
  );

  useEffect(() => {
    const storedTabIds = parseOpenTabs(localStorage.getItem(storageKey));
    const baseTabIds = currentProjectId
      ? [...storedTabIds, currentProjectId]
      : storedTabIds;
    const nextTabIds = sanitizeTabIds(baseTabIds);

    setOpenTabIds(nextTabIds);
  }, [currentProjectId, sanitizeTabIds, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(openTabIds));
  }, [openTabIds, storageKey]);

  const tabs = useMemo<ProjectTabItem[]>(
    () =>
      openTabIds.map((tabId) => {
        const project = projectMap.get(tabId);
        if (!project) return null;

        return {
          id: project.id,
          label: project.name,
        };
      }).filter((tab): tab is ProjectTabItem => tab !== null),
    [openTabIds, projectMap],
  );

  const handleCloseTab = (projectId: string) => {
    const currentIndex = openTabIds.findIndex((tabId) => tabId === projectId);
    if (currentIndex < 0) return;

    const nextTabIds = openTabIds.filter((tabId) => tabId !== projectId);
    setOpenTabIds(nextTabIds);

    if (projectId !== currentProjectId) return;

    const nextProjectId =
      nextTabIds[currentIndex - 1] ?? nextTabIds[currentIndex] ?? null;

    if (!nextProjectId) {
      onOpenHome();
      return;
    }

    onOpenProject(nextProjectId);
  };

  const handleCreateTab = async () => {
    const projectId = await onCreateProject();
    if (!projectId) return;

    setOpenTabIds((previous) => sanitizeTabIds([...previous, projectId]));
  };

  return (
    <ProjectTabsShell
      tabs={tabs}
      activeTabId={currentProjectId}
      onGoHome={onOpenHome}
      onSelectTab={onOpenProject}
      onCloseTab={handleCloseTab}
      onCreateTab={() => {
        void handleCreateTab();
      }}
      className="border-neutral-800 bg-neutral-950 text-white"
      rightSlot={
        <button
          type="button"
          onClick={onSignOut}
          className="flex h-8 items-center justify-center gap-2 rounded-md border border-neutral-700 px-3 text-sm text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-900 hover:text-white"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      }
    />
  );
};
