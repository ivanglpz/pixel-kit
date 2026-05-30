import type { ProjectDocument } from "@pixelkit/core";
import PixelEditor from "@pixelkit/editor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ProjectTabs } from "../components/project-tabs";
import { FullscreenState } from "../components/fullscreen-state";
import { getDesktopApi } from "../lib/desktop-api";
import {
  createDesktopAssetAdapter,
  createDesktopSaveAdapter,
} from "../lib/editor-adapters";
import { localProjectToDocument } from "../lib/project-document";
import { desktopQueryKeys } from "../lib/query-keys";
import {
  useDesktopProject,
  useDesktopProjects,
  useDesktopSession,
} from "../lib/queries";
import { desktopPaths } from "../routes/paths";

export const ProjectEditorScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const sessionQuery = useDesktopSession();
  const userId = sessionQuery.data?.user.userId;
  const projectsQuery = useDesktopProjects(userId);
  const projectQuery = useDesktopProject(id);
  const saveAdapter = useMemo(() => createDesktopSaveAdapter(), []);
  const assetAdapter = useMemo(() => createDesktopAssetAdapter(), []);

  const signOutMutation = useMutation({
    mutationFn: () => getDesktopApi().auth.logout(),
    onSuccess: async () => {
      queryClient.setQueryData(desktopQueryKeys.session, null);
      await queryClient.invalidateQueries({ queryKey: desktopQueryKeys.session });
      navigate(desktopPaths.login, { replace: true });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("User session is required");
      }

      return getDesktopApi().projects.create({
        name: "Untitled project",
        userId,
      });
    },
  });

  if (!id) {
    return <Navigate to={desktopPaths.projects} replace />;
  }

  if (sessionQuery.isPending || projectQuery.isPending || projectsQuery.isPending) {
    return <FullscreenState message="Loading project..." />;
  }

  if (sessionQuery.error) {
    return (
      <FullscreenState
        message={
          sessionQuery.error instanceof Error
            ? sessionQuery.error.message
            : "Session failed to load"
        }
      />
    );
  }

  if (!sessionQuery.data) {
    return <Navigate to={desktopPaths.login} replace state={{ from: desktopPaths.projectById(id) }} />;
  }

  if (projectQuery.error) {
    return (
      <FullscreenState
        message={
          projectQuery.error instanceof Error
            ? projectQuery.error.message
            : "Project failed to load"
        }
      />
    );
  }

  if (!projectQuery.data) {
    return <FullscreenState message="Project not found" />;
  }

  if (projectsQuery.error) {
    return (
      <FullscreenState
        message={
          projectsQuery.error instanceof Error
            ? projectsQuery.error.message
            : "Projects failed to load"
        }
      />
    );
  }

  const currentUserId = sessionQuery.data.user.userId;
  const project: ProjectDocument = localProjectToDocument(projectQuery.data);

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-950">
      <ProjectTabs
        currentProjectId={id}
        userId={currentUserId}
        projects={projectsQuery.data ?? []}
        onOpenHome={() => navigate(desktopPaths.projects)}
        onOpenProject={(projectId) => navigate(desktopPaths.projectById(projectId))}
        onCreateProject={async () => {
          const project = await createProjectMutation.mutateAsync();
          await queryClient.invalidateQueries({
            queryKey: desktopQueryKeys.projects(currentUserId),
          });
          navigate(desktopPaths.projectById(project.id));

          return project.id;
        }}
        onSignOut={() => signOutMutation.mutate()}
      />
      <div className="min-h-0 flex-1">
        <PixelEditor
          projectId={id}
          initialProject={project}
          saveAdapter={saveAdapter}
          assetAdapter={assetAdapter}
        />
      </div>
    </main>
  );
};
