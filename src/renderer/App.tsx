import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import CreateProject from './components/CreateProject';
import { CreateProjectData, VideoProject } from './types/project';

type AppState = 'welcome' | 'create-project' | 'editor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);

  const handleProjectCreate = async (projectData: CreateProjectData) => {
    try {
      // Create the project folder structure
      const projectPath = await window.electronAPI.createProjectFolder(
        projectData.projectPath,
        projectData.name
      );

      // Create the full project object
      const newProject: VideoProject = {
        id: Date.now().toString(), // Simple ID generation
        name: projectData.name,
        description: projectData.description,
        projectPath,
        createdAt: new Date(),
        lastModified: new Date(),
        settings: {
          resolution: projectData.resolution,
          frameRate: projectData.frameRate,
          audioSettings: {
            sampleRate: 48000,
            channels: 2,
          },
        },
      };

      // Save the project file
      await window.electronAPI.saveProject(newProject);

      // Set as current project and switch to editor
      setCurrentProject(newProject);
      setCurrentState('editor');
    } catch (error) {
      throw new Error(`Failed to create project: ${error}`);
    }
  };

  const handleOpenProject = async () => {
    try {
      const projectData = await window.electronAPI.openProject();
      if (projectData) {
        setCurrentProject(projectData);
        setCurrentState('editor');
      }
    } catch (error) {
      console.error('Failed to open project:', error);
    }
  };

  // Navigation based on current state
  if (currentState === 'welcome') {
    return (
      <WelcomeScreen
        onCreateProject={() => setCurrentState('create-project')}
        onOpenProject={handleOpenProject}
        recentProjects={[]} // TODO: Implement recent projects storage
      />
    );
  }

  if (currentState === 'create-project') {
    return (
      <CreateProject
        onProjectCreate={handleProjectCreate}
        onBack={() => setCurrentState('welcome')}
      />
    );
  }

  // Main editor interface (placeholder for now)
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">{currentProject.name}</h1>
          <p className="text-zinc-400">
            {currentProject.settings.resolution.width}x{currentProject.settings.resolution.height} • {currentProject.settings.frameRate}fps
          </p>
        </header>

        <div className="bg-zinc-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Project Created Successfully!</h2>
          <p className="text-zinc-400 mb-4">
            Your project has been created at: <br />
            <code className="text-zinc-300">{currentProject.projectPath}</code>
          </p>
          <p className="text-zinc-500">
            Editor interface coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;