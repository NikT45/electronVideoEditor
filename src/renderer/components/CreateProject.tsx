import React, { useState } from 'react';
import { CreateProjectData, DEFAULT_RESOLUTIONS, DEFAULT_FRAME_RATES } from '../types/project';

interface CreateProjectProps {
  onProjectCreate: (projectData: CreateProjectData) => void;
}

export default function CreateProject({ onProjectCreate }: CreateProjectProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    projectPath: '',
    resolution: DEFAULT_RESOLUTIONS[0],
    frameRate: DEFAULT_FRAME_RATES[1], // 30fps default
  });

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectFolder = async () => {
    try {
      const selectedPath = await window.electronAPI.selectProjectFolder();
      if (selectedPath) {
        setFormData(prev => ({ ...prev, projectPath: selectedPath }));
        setError(null);
      }
    } catch (err) {
      setError('Failed to select folder');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.projectPath) {
      setError('Please select a project location');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await onProjectCreate(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Create New Project</h1>
            <p className="text-zinc-600">Set up your video editing project</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                placeholder="My Video Project"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                placeholder="Brief description of your project"
              />
            </div>

            {/* Project Location */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Project Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.projectPath}
                  readOnly
                  className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-md text-zinc-600"
                  placeholder="Select folder..."
                />
                <button
                  type="button"
                  onClick={handleSelectFolder}
                  className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  Browse
                </button>
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-zinc-700 mb-2">
                Resolution
              </label>
              <select
                id="resolution"
                value={`${formData.resolution.width}x${formData.resolution.height}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split('x').map(Number);
                  setFormData(prev => ({ ...prev, resolution: { width, height } }));
                }}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {DEFAULT_RESOLUTIONS.map((res) => (
                  <option key={`${res.width}x${res.height}`} value={`${res.width}x${res.height}`}>
                    {res.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Frame Rate */}
            <div>
              <label htmlFor="frameRate" className="block text-sm font-medium text-zinc-700 mb-2">
                Frame Rate
              </label>
              <select
                id="frameRate"
                value={formData.frameRate}
                onChange={(e) => setFormData(prev => ({ ...prev, frameRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {DEFAULT_FRAME_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate} fps
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-zinc-900 text-white py-3 px-4 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating Project...' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}