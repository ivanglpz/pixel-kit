const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pixelkitDesktop", {
  auth: {
    login: (credentials) => ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
    getSession: () => ipcRenderer.invoke("auth:getSession"),
  },
  projects: {
    list: (userId) => ipcRenderer.invoke("projects:list", userId),
    get: (projectId) => ipcRenderer.invoke("projects:get", projectId),
    create: (input) => ipcRenderer.invoke("projects:create", input),
    updateSnapshot: (input) =>
      ipcRenderer.invoke("projects:updateSnapshot", input),
    delete: (projectId) => ipcRenderer.invoke("projects:delete", projectId),
  },
  assets: {
    list: (projectId) => ipcRenderer.invoke("assets:list", projectId),
    save: (input) => ipcRenderer.invoke("assets:save", input),
    delete: (assetId) => ipcRenderer.invoke("assets:delete", assetId),
    savePreview: (input) => ipcRenderer.invoke("assets:savePreview", input),
  },
  sync: {
    pushProject: (projectId) => ipcRenderer.invoke("sync:pushProject", projectId),
    pullProject: (remoteProjectId) =>
      ipcRenderer.invoke("sync:pullProject", remoteProjectId),
  },
});
