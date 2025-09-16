import React, { useState } from 'react';
import { CreateProjectData, DEFAULT_RESOLUTIONS, DEFAULT_FRAME_RATES } from '../types/project';

interface CreateProjectProps {
  onProjectCreate: (projectData: CreateProjectData) => void;
  onBack: () => void;
}

export default function CreateProject({ onProjectCreate, onBack }: CreateProjectProps) {
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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4" style={{ paddingTop: '60px' }}>
      <div className="max-w-md w-full bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700">
        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Create New Project</h1>
            <p className="text-zinc-400">Set up your video editing project</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent placeholder-zinc-400"
                placeholder="My Video Project"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent placeholder-zinc-400"
                placeholder="Brief description of your project"
              />
            </div>

            {/* Project Location */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Project Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.projectPath}
                  readOnly
                  className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-400"
                  placeholder="Select folder..."
                />
                <button
                  type="button"
                  onClick={handleSelectFolder}
                  className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  Browse
                </button>
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-zinc-300 mb-2">
                Resolution
              </label>
              <select
                id="resolution"
                value={`${formData.resolution.width}x${formData.resolution.height}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split('x').map(Number);
                  setFormData(prev => ({ ...prev, resolution: { width, height } }));
                }}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
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
              <label htmlFor="frameRate" className="block text-sm font-medium text-zinc-300 mb-2">
                Frame Rate
              </label>
              <select
                id="frameRate"
                value={formData.frameRate}
                onChange={(e) => setFormData(prev => ({ ...prev, frameRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
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
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-zinc-100 text-zinc-900 py-3 px-4 rounded-md hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isCreating ? 'Creating Project...' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}