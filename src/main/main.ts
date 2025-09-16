import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Set application menu
const template: Electron.MenuItemConstructorOptions[] = [
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
          app.quit();
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
    label: app.getName(),
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

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// IPC Handlers
ipcMain.handle('project:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Project Location'
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('project:createFolder', async (_, basePath: string, projectName: string) => {
  const projectPath = path.join(basePath, projectName);

  try {
    // Create project directory
    await fs.promises.mkdir(projectPath, { recursive: true });

    // Create subdirectories
    await fs.promises.mkdir(path.join(projectPath, 'assets'), { recursive: true });
    await fs.promises.mkdir(path.join(projectPath, 'exports'), { recursive: true });
    await fs.promises.mkdir(path.join(projectPath, 'cache'), { recursive: true });

    return projectPath;
  } catch (error) {
    throw new Error(`Failed to create project folder: ${error}`);
  }
});

ipcMain.handle('project:save', async (_, projectData) => {
  const projectFile = path.join(projectData.projectPath, 'project.json');

  try {
    await fs.promises.writeFile(projectFile, JSON.stringify(projectData, null, 2));
  } catch (error) {
    throw new Error(`Failed to save project: ${error}`);
  }
});

ipcMain.handle('project:open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
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
  } catch (error) {
    throw new Error(`Failed to open project: ${error}`);
  }
});

ipcMain.handle('project:load', async (_, projectPath: string) => {
  const projectFile = path.join(projectPath, 'project.json');

  try {
    const projectData = await fs.promises.readFile(projectFile, 'utf-8');
    return JSON.parse(projectData);
  } catch (error) {
    throw new Error(`Failed to load project: ${error}`);
  }
});
