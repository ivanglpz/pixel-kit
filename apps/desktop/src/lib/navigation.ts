export const getDesktopProjectHref = (projectId: string) => {
  const encodedProjectId = encodeURIComponent(projectId);

  return window.location.protocol === "file:"
    ? `./project.html?id=${encodedProjectId}`
    : `/project?id=${encodedProjectId}`;
};

export const getDesktopHomeHref = () => {
  return window.location.protocol === "file:" ? "./index.html" : "/";
};

export const openDesktopProject = (projectId: string) => {
  window.location.href = getDesktopProjectHref(projectId);
};

export const openDesktopHome = () => {
  window.location.href = getDesktopHomeHref();
};
