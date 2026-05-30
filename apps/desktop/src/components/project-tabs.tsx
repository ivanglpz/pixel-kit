import type { LocalProjectRecord } from "@pixelkit/core";
import { FolderOpen, Home, LogOut } from "lucide-react";

type ProjectTabsProps = {
  currentProjectId: string;
  projects: LocalProjectRecord[];
  onOpenHome: VoidFunction;
  onOpenProject: (projectId: string) => void;
  onSignOut: VoidFunction;
};

export const ProjectTabs = ({
  currentProjectId,
  projects,
  onOpenHome,
  onOpenProject,
  onSignOut,
}: ProjectTabsProps) => {
  return (
    <header className="grid h-12 grid-cols-[40px_1fr_88px] items-center gap-3 border-b border-neutral-800 bg-neutral-950 px-3 text-white">
      <button
        type="button"
        onClick={onOpenHome}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-neutral-950 transition-colors hover:bg-neutral-200"
        aria-label="Go to local projects"
      >
        <Home size={18} />
      </button>

      <div className="flex h-full items-center gap-2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((project) => {
          const isCurrent = project.id === currentProjectId;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project.id)}
              className={[
                "grid h-9 min-w-0 max-w-[220px] grid-cols-[16px_1fr] items-center gap-2 rounded-md px-3 text-left text-sm transition-colors",
                isCurrent
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
              ].join(" ")}
              title={project.name}
            >
              <FolderOpen size={15} />
              <span className="truncate">{project.name}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className="flex h-8 items-center justify-center gap-2 rounded-md border border-neutral-700 px-3 text-sm text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-900 hover:text-white"
      >
        <LogOut size={14} />
        <span>Sign out</span>
      </button>
    </header>
  );
};
