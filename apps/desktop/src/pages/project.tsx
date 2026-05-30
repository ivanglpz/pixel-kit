import type { LocalProjectRecord, ProjectDocument } from "@pixelkit/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ProjectTabs } from "../components/project-tabs";
import { getDesktopApi } from "../lib/desktop-api";
import {
  createDesktopAssetAdapter,
  createDesktopSaveAdapter,
} from "../lib/editor-adapters";
import { openDesktopHome, openDesktopProject } from "../lib/navigation";
import { localProjectToDocument } from "../lib/project-document";

const PixelEditor = dynamic(() => import("@pixelkit/editor"), {
  ssr: false,
});

export default function DesktopProjectEditor() {
  const router = useRouter();
  const projectId = router.query.id as string | undefined;
  const [projects, setProjects] = useState<LocalProjectRecord[]>([]);
  const [project, setProject] = useState<ProjectDocument | null>(null);
  const [message, setMessage] = useState("");
  const saveAdapter = useMemo(() => createDesktopSaveAdapter(), []);
  const assetAdapter = useMemo(() => createDesktopAssetAdapter(), []);

  useEffect(() => {
    if (!projectId) return;

    Promise.all([
      getDesktopApi().auth.getSession(),
      getDesktopApi().projects.get(projectId),
    ])
      .then(async ([session, localProject]) => {
        if (!localProject) {
          setMessage("Project not found");
          return;
        }

        setProject(localProjectToDocument(localProject));
        setProjects(
          await getDesktopApi().projects.list(
            session?.user.userId ?? localProject.userId,
          ),
        );
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Project failed to load",
        );
      });
  }, [projectId]);

  const handleSignOut = async () => {
    await getDesktopApi().auth.logout();
    setProjects([]);
    openDesktopHome();
  };

  if (message) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>{message}</p>
      </main>
    );
  }

  if (!project || !projectId) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>Loading project...</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-950">
      <ProjectTabs
        currentProjectId={projectId}
        projects={projects}
        onOpenHome={openDesktopHome}
        onOpenProject={openDesktopProject}
        onSignOut={handleSignOut}
      />
      <div className="min-h-0 flex-1">
        <PixelEditor
          projectId={projectId}
          initialProject={project}
          saveAdapter={saveAdapter}
          assetAdapter={assetAdapter}
        />
      </div>
    </main>
  );
}
