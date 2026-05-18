import { useEffect, useState } from "react";
import type { AuthSession } from "@pixelkit/platform";
import type { LocalProjectRecord } from "@pixelkit/core";
import { getDesktopApi } from "../lib/desktop-api";

export default function DesktopHome() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [projects, setProjects] = useState<LocalProjectRecord[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projectName, setProjectName] = useState("Untitled project");
  const [remoteProjectId, setRemoteProjectId] = useState("");
  const [message, setMessage] = useState("");

  const loadProjects = async (nextSession: AuthSession | null) => {
    if (!nextSession) {
      setProjects([]);
      return;
    }

    setProjects(await getDesktopApi().projects.list(nextSession.user.userId));
  };

  useEffect(() => {
    getDesktopApi()
      .auth.getSession()
      .then((cachedSession) => {
        setSession(cachedSession);
        return loadProjects(cachedSession);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  const handleLogin = async () => {
    try {
      const nextSession = await getDesktopApi().auth.login({ email, password });
      setSession(nextSession);
      await loadProjects(nextSession);
      setMessage("Session cached for offline use.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleCreateProject = async () => {
    if (!session) return;

    const project = await getDesktopApi().projects.create({
      name: projectName,
      userId: session.user.userId,
    });
    setProjects((current) => [project, ...current]);
    window.location.href = `/project/${project.id}`;
  };

  const handlePullRemoteProject = async () => {
    if (!session || !remoteProjectId.trim()) return;

    try {
      const result = await getDesktopApi().sync.pullProject(
        remoteProjectId.trim(),
      );
      await loadProjects(session);
      setMessage(
        result.status === "conflict"
          ? "Remote project pulled; local edits were preserved as a copy."
          : "Remote project pulled.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pull failed");
    }
  };

  const handlePushProject = async (projectId: string) => {
    if (!session) return;

    try {
      const result = await getDesktopApi().sync.pushProject(projectId);
      await loadProjects(session);
      setMessage(
        result.status === "conflict"
          ? "Remote changed too; local edits were preserved as a copy."
          : "Project pushed.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Push failed");
    }
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
        <section className="w-full max-w-sm flex flex-col gap-4">
          <header>
            <p className="text-sm text-neutral-400">PixelKit Desktop</p>
            <h1 className="text-2xl font-semibold">Sign in</h1>
          </header>
          <input
            className="h-10 rounded bg-neutral-900 border border-neutral-700 px-3"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="h-10 rounded bg-neutral-900 border border-neutral-700 px-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            className="h-10 rounded bg-white text-neutral-950 font-medium"
            onClick={handleLogin}
          >
            Sign in
          </button>
          {message ? <p className="text-sm text-neutral-400">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <section className="mx-auto max-w-5xl flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">PixelKit Desktop</p>
            <h1 className="text-2xl font-semibold">Local projects</h1>
          </div>
          <button
            className="h-9 rounded border border-neutral-700 px-3 text-sm"
            onClick={async () => {
              await getDesktopApi().auth.logout();
              setSession(null);
              setProjects([]);
            }}
          >
            Sign out
          </button>
        </header>

        <section className="flex gap-2">
          <input
            className="h-10 flex-1 rounded bg-neutral-900 border border-neutral-700 px-3"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
          <button
            className="h-10 rounded bg-white text-neutral-950 px-4 font-medium"
            onClick={handleCreateProject}
          >
            Create
          </button>
        </section>

        <section className="flex gap-2">
          <input
            className="h-10 flex-1 rounded bg-neutral-900 border border-neutral-700 px-3"
            placeholder="Remote project id"
            value={remoteProjectId}
            onChange={(event) => setRemoteProjectId(event.target.value)}
          />
          <button
            className="h-10 rounded border border-neutral-700 px-4 font-medium"
            onClick={handlePullRemoteProject}
          >
            Pull remote
          </button>
        </section>

        {message ? <p className="text-sm text-neutral-400">{message}</p> : null}

        <section className="grid gap-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded border border-neutral-800 bg-neutral-900 p-4 flex items-center justify-between gap-4"
            >
              <button
                className="flex-1 text-left"
                onClick={() => {
                  window.location.href = `/project/${project.id}`;
                }}
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
                onClick={() => handlePushProject(project.id)}
              >
                Push
              </button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
