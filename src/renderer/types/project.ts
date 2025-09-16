export interface VideoProject {
  id: string;
  name: string;
  description?: string;
  projectPath: string;
  createdAt: Date;
  lastModified: Date;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  duration?: number;
  audioSettings: {
    sampleRate: number;
    channels: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  projectPath: string;
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
}

export const DEFAULT_RESOLUTIONS = [
  { name: '1920x1080 (Full HD)', width: 1920, height: 1080 },
  { name: '1280x720 (HD)', width: 1280, height: 720 },
  { name: '3840x2160 (4K)', width: 3840, height: 2160 },
  { name: '1080x1920 (Vertical)', width: 1080, height: 1920 },
] as const;

export const DEFAULT_FRAME_RATES = [24, 30, 60] as const;