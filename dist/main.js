"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
let mainWindow = null;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 20, y: 20 },
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Set application menu
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Project',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    // TODO: Implement new project functionality
                },
            },
            {
                label: 'Open Project',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    // TODO: Implement open project functionality
                },
            },
            { type: 'separator' },
            {
                label: 'Exit',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    electron_1.app.quit();
                },
            },
        ],
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    },
];
if (process.platform === 'darwin') {
    template.unshift({
        label: electron_1.app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    });
}
const menu = electron_1.Menu.buildFromTemplate(template);
electron_1.Menu.setApplicationMenu(menu);
// IPC Handlers
electron_1.ipcMain.handle('project:selectFolder', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Select Project Location'
    });
    return result.canceled ? null : result.filePaths[0];
});
electron_1.ipcMain.handle('project:createFolder', async (_, basePath, projectName) => {
    const projectPath = path.join(basePath, projectName);
    try {
        // Create project directory
        await fs.promises.mkdir(projectPath, { recursive: true });
        // Create subdirectories
        await fs.promises.mkdir(path.join(projectPath, 'assets'), { recursive: true });
        await fs.promises.mkdir(path.join(projectPath, 'exports'), { recursive: true });
        await fs.promises.mkdir(path.join(projectPath, 'cache'), { recursive: true });
        return projectPath;
    }
    catch (error) {
        throw new Error(`Failed to create project folder: ${error}`);
    }
});
electron_1.ipcMain.handle('project:save', async (_, projectData) => {
    const projectFile = path.join(projectData.projectPath, 'project.json');
    try {
        await fs.promises.writeFile(projectFile, JSON.stringify(projectData, null, 2));
    }
    catch (error) {
        throw new Error(`Failed to save project: ${error}`);
    }
});
electron_1.ipcMain.handle('project:open', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Video Editor Projects', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        title: 'Open Project File'
    });
    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    const projectFile = result.filePaths[0];
    try {
        const projectData = await fs.promises.readFile(projectFile, 'utf-8');
        return JSON.parse(projectData);
    }
    catch (error) {
        throw new Error(`Failed to open project: ${error}`);
    }
});
electron_1.ipcMain.handle('project:load', async (_, projectPath) => {
    const projectFile = path.join(projectPath, 'project.json');
    try {
        const projectData = await fs.promises.readFile(projectFile, 'utf-8');
        return JSON.parse(projectData);
    }
    catch (error) {
        throw new Error(`Failed to load project: ${error}`);
    }
});
