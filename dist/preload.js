"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronAPI = {
    // Platform info
    platform: process.platform,
    // File operations
    openFile: () => electron_1.ipcRenderer.invoke('dialog:openFile'),
    saveFile: (data) => electron_1.ipcRenderer.invoke('dialog:saveFile', data),
    // Project operations
    selectProjectFolder: () => electron_1.ipcRenderer.invoke('project:selectFolder'),
    createProjectFolder: (path, name) => electron_1.ipcRenderer.invoke('project:createFolder', path, name),
    saveProject: (projectData) => electron_1.ipcRenderer.invoke('project:save', projectData),
    openProject: () => electron_1.ipcRenderer.invoke('project:open'),
    loadProject: (projectPath) => electron_1.ipcRenderer.invoke('project:load', projectPath),
    // App operations
    minimize: () => electron_1.ipcRenderer.invoke('app:minimize'),
    maximize: () => electron_1.ipcRenderer.invoke('app:maximize'),
    close: () => electron_1.ipcRenderer.invoke('app:close'),
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
