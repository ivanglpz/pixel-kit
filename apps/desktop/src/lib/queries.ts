import { useQuery } from "@tanstack/react-query";
import { getDesktopApi } from "./desktop-api";
import { desktopQueryKeys } from "./query-keys";

export const useDesktopSession = () =>
  useQuery({
    queryKey: desktopQueryKeys.session,
    queryFn: () => getDesktopApi().auth.getSession(),
    retry: false,
  });

export const useDesktopProject = (projectId?: string) =>
  useQuery({
    queryKey: projectId
      ? desktopQueryKeys.project(projectId)
      : ["desktop", "project", "missing"],
    queryFn: () => getDesktopApi().projects.get(projectId!),
    enabled: Boolean(projectId),
    retry: false,
  });

export const useDesktopProjects = (userId?: string) =>
  useQuery({
    queryKey: userId
      ? desktopQueryKeys.projects(userId)
      : ["desktop", "projects", "missing"],
    queryFn: () => getDesktopApi().projects.list(userId!),
    enabled: Boolean(userId),
    retry: false,
  });
