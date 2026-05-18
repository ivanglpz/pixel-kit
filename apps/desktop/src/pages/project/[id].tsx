import PixelEditor from "@pixelkit/editor";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import type { LocalProjectRecord, ProjectDocument } from "@pixelkit/core";
import { getDesktopApi } from "../../lib/desktop-api";
import { localProjectToDocument } from "../../lib/project-document";
import {
  createDesktopAssetAdapter,
  createDesktopSaveAdapter,
} from "../../lib/editor-adapters";

export default function DesktopProjectEditor() {
  const router = useRouter();
  const projectId = router.query.id as string | undefined;
  const [project, setProject] = useState<ProjectDocument | null>(null);
  const [message, setMessage] = useState("");
  const saveAdapter = useMemo(() => createDesktopSaveAdapter(), []);
  const assetAdapter = useMemo(() => createDesktopAssetAdapter(), []);

  useEffect(() => {
    if (!projectId) return;

    getDesktopApi()
      .projects.get(projectId)
      .then((localProject: LocalProjectRecord | null) => {
        if (!localProject) {
          setMessage("Project not found");
          return;
        }

        setProject(localProjectToDocument(localProject));
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Project failed to load");
      });
  }, [projectId]);

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
    <main className="h-screen w-screen overflow-hidden">
      <PixelEditor
        projectId={projectId}
        initialProject={project}
        saveAdapter={saveAdapter}
        assetAdapter={assetAdapter}
      />
    </main>
  );
}
