import type { LocalProjectRecord } from "@pixelkit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getDesktopApi } from "../lib/desktop-api";
import { desktopQueryKeys } from "../lib/query-keys";
import { useDesktopProjects, useDesktopSession } from "../lib/queries";
import { desktopPaths } from "../routes/paths";
import { FullscreenState } from "../components/fullscreen-state";

export const ProjectsScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useDesktopSession();
  const userId = sessionQuery.data?.user.userId;
  const projectsQuery = useDesktopProjects(userId);
  const [projectName, setProjectName] = useState("Untitled project");
  const [remoteProjectId, setRemoteProjectId] = useState("");
  const [message, setMessage] = useState("");

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("User session is required");
      }

      return getDesktopApi().projects.create({
        name: projectName,
        userId,
      });
    },
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({
        queryKey: desktopQueryKeys.projects(userId!),
      });
      navigate(desktopPaths.projectById(project.id));
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Create failed");
    },
  });

  const pullProjectMutation = useMutation({
    mutationFn: async () => {
      return getDesktopApi().sync.pullProject(remoteProjectId.trim());
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: desktopQueryKeys.projects(userId!),
      });
      setMessage(
        result.status === "conflict"
          ? "Remote project pulled; local edits were preserved as a copy."
          : "Remote project pulled.",
      );
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Pull failed");
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => getDesktopApi().auth.logout(),
    onSuccess: async () => {
      queryClient.setQueryData(desktopQueryKeys.session, null);
      await queryClient.invalidateQueries({ queryKey: desktopQueryKeys.session });
      navigate(desktopPaths.login, { replace: true });
    },
  });

  const handlePushProject = async (projectId: string) => {
    try {
      const result = await getDesktopApi().sync.pushProject(projectId);
      await queryClient.invalidateQueries({
        queryKey: desktopQueryKeys.projects(userId!),
      });
      setMessage(
        result.status === "conflict"
          ? "Remote changed too; local edits were preserved as a copy."
          : "Project pushed.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Push failed");
    }
  };

  if (sessionQuery.isPending || projectsQuery.isPending) {
    return <FullscreenState message="Loading projects..." />;
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
    return <FullscreenState message="Session not found" />;
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

  const projects = projectsQuery.data ?? [];

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">PixelKit Desktop</p>
            <h1 className="text-2xl font-semibold">Local projects</h1>
          </div>
          <button
            className="h-9 rounded border border-neutral-700 px-3 text-sm"
            onClick={() => signOutMutation.mutate()}
          >
            Sign out
          </button>
        </header>

        <section className="flex gap-2">
          <input
            className="h-10 flex-1 rounded border border-neutral-700 bg-neutral-900 px-3"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
          <button
            className="h-10 rounded bg-white px-4 font-medium text-neutral-950 disabled:opacity-60"
            onClick={() => createProjectMutation.mutate()}
            disabled={createProjectMutation.isPending}
          >
            Create
          </button>
        </section>

        <section className="flex gap-2">
          <input
            className="h-10 flex-1 rounded border border-neutral-700 bg-neutral-900 px-3"
            placeholder="Remote project id"
            value={remoteProjectId}
            onChange={(event) => setRemoteProjectId(event.target.value)}
          />
          <button
            className="h-10 rounded border border-neutral-700 px-4 font-medium disabled:opacity-60"
            onClick={() => pullProjectMutation.mutate()}
            disabled={!remoteProjectId.trim() || pullProjectMutation.isPending}
          >
            Pull remote
          </button>
        </section>

        {message ? <p className="text-sm text-neutral-400">{message}</p> : null}

        <section className="grid gap-3">
          {projects.map((project: LocalProjectRecord) => (
            <article
              key={project.id}
              className="flex items-center justify-between gap-4 rounded border border-neutral-800 bg-neutral-900 p-4"
            >
              <button
                className="flex-1 text-left"
                onClick={() => navigate(desktopPaths.projectById(project.id))}
              >
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-neutral-400">
                  {project.syncStatus} · revision {project.revision}
                  {project.remoteId ? ` · remote ${project.remoteId}` : ""}
                </p>
              </button>
              <button
                className="h-9 rounded border border-neutral-700 px-3 text-sm disabled:opacity-40"
                disabled={!project.remoteId}
                onClick={() => void handlePushProject(project.id)}
              >
                Push
              </button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
};
