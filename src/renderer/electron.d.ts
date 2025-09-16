declare global {
  interface Window {
    electronAPI: {
      platform: string;
      openFile: () => Promise<any>;
      saveFile: (data: any) => Promise<any>;
      selectProjectFolder: () => Promise<string | null>;
      createProjectFolder: (path: string, name: string) => Promise<string>;
      saveProject: (projectData: any) => Promise<void>;
      openProject: () => Promise<any | null>;
      loadProject: (projectPath: string) => Promise<any>;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
    };
  }
}

export {};