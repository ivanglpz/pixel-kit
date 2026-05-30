export const desktopQueryKeys = {
  session: ["desktop", "session"] as const,
  project: (projectId: string) => ["desktop", "project", projectId] as const,
  projects: (userId: string) => ["desktop", "projects", userId] as const,
};
