export const desktopPaths = {
  root: "/",
  login: "/login",
  projects: "/projects",
  project: "/project/:id",
  projectById: (projectId: string) => `/project/${encodeURIComponent(projectId)}`,
} as const;
