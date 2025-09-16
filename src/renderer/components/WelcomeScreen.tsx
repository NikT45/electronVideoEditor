import React from 'react';

interface WelcomeScreenProps {
  onCreateProject: () => void;
  onOpenProject: () => void;
  recentProjects?: Array<{
    name: string;
    path: string;
    lastModified: Date;
  }>;
}

export default function WelcomeScreen({ onCreateProject, onOpenProject, recentProjects = [] }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4" style={{ paddingTop: '60px' }}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">Video Editor</h1>
          <p className="text-xl text-zinc-400">Create amazing videos with professional tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-6">Get Started</h2>

            {/* Create New Project */}
            <button
              onClick={onCreateProject}
              className="w-full bg-zinc-100 text-zinc-900 p-6 rounded-xl hover:bg-zinc-200 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-zinc-300 p-3 rounded-lg group-hover:bg-zinc-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Create New Project</h3>
                  <p className="text-zinc-600">Start a fresh video editing project</p>
                </div>
              </div>
            </button>

            {/* Open Existing Project */}
            <button
              onClick={onOpenProject}
              className="w-full bg-zinc-800 border-2 border-zinc-700 text-zinc-100 p-6 rounded-xl hover:border-zinc-600 hover:bg-zinc-750 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-zinc-700 p-3 rounded-lg group-hover:bg-zinc-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Open Existing Project</h3>
                  <p className="text-zinc-400">Continue working on a saved project</p>
                </div>
              </div>
            </button>
          </div>

          {/* Right Column - Recent Projects */}
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-6">Recent Projects</h2>

            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.slice(0, 5).map((project, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 hover:bg-zinc-750 transition-colors"
                    onClick={() => {
                      // TODO: Open specific project
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-zinc-100">{project.name}</h3>
                        <p className="text-sm text-zinc-400 truncate">{project.path}</p>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {project.lastModified.toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center">
                <div className="text-zinc-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-zinc-400">No recent projects</p>
                <p className="text-sm text-zinc-500 mt-1">Your recent projects will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">
            Ready to create something amazing? Start with a new project or continue where you left off.
          </p>
        </div>
      </div>
    </div>
  );
}
