import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  // Platform info
  platform: process.platform,

  // File operations
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: any) => ipcRenderer.invoke('dialog:saveFile', data),

  // Project operations
  selectProjectFolder: () => ipcRenderer.invoke('project:selectFolder'),
  createProjectFolder: (path: string, name: string) => ipcRenderer.invoke('project:createFolder', path, name),
  saveProject: (projectData: any) => ipcRenderer.invoke('project:save', projectData),
  openProject: () => ipcRenderer.invoke('project:open'),
  loadProject: (projectPath: string) => ipcRenderer.invoke('project:load', projectPath),

  // App operations
  minimize: () => ipcRenderer.invoke('app:minimize'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
  close: () => ipcRenderer.invoke('app:close'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;