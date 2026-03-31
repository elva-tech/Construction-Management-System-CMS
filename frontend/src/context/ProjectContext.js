import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ProjectContext = createContext();

// Create a provider component
export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load selected project from localStorage on initial render
  useEffect(() => {
    const loadProject = () => {
      try {
        const projectData = localStorage.getItem('selectedProject');
        if (projectData) {
          setSelectedProject(JSON.parse(projectData));
        }
      } catch (error) {
        console.error('Error loading project data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, []);

  // Function to select a project
  const selectProject = (project) => {
    setSelectedProject(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
  };

  // Function to clear the selected project
  const clearSelectedProject = () => {
    setSelectedProject(null);
    localStorage.removeItem('selectedProject');
  };

  // Context value
  const value = {
    selectedProject,
    selectProject,
    clearSelectedProject,
    isLoading
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
