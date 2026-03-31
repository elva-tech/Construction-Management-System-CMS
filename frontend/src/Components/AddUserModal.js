import React, { useState, useEffect } from 'react';

const AddUserModal = ({ isOpen, onClose, onAdd, projects = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    authorisation: '',
    projects: [],
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Auto-generate username and password when name and role are filled
  useEffect(() => {
    if (
      formData.name.trim() &&
      formData.authorisation &&
      !formData.username &&
      !formData.password
    ) {
      // Generate username from name (lowercase, no spaces)
      const generatedUsername = formData.name.toLowerCase().replace(/\s+/g, '');
      // Generate a simple password (in production, this should be more secure)
      const generatedPassword = `${generatedUsername}123`;

      setFormData((prev) => ({
        ...prev,
        username: generatedUsername,
        password: generatedPassword,
      }));
    }
  }, [formData.name, formData.authorisation]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Enter Full Name';
    if (!formData.email.trim()) newErrors.email = 'Enter Email Address';
    if (!formData.phone.trim()) newErrors.phone = 'Enter Phone Number';
    if (!formData.authorisation) newErrors.authorisation = 'Select Role';
    if (!formData.projects || formData.projects.length === 0) newErrors.projects = 'Select at least one project';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }

    // Phone validation (basic)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Prepare user data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        role: formData.authorisation.toLowerCase(),
        projects: formData.projects,
        status: 'active'
      };

      onAdd(userData);

      // Store user-project mapping in localStorage for immediate UI updates
      if (formData.authorisation === 'Supervisor') {
        let supervisorProjects = {};
        try {
          supervisorProjects = JSON.parse(localStorage.getItem('supervisorProjects')) || {};
        } catch (e) { supervisorProjects = {}; }
        formData.projects.forEach(projectName => {
          supervisorProjects[projectName] = formData.name;
        });
        localStorage.setItem('supervisorProjects', JSON.stringify(supervisorProjects));
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        authorisation: '',
        projects: [],
        username: '',
        password: ''
      });
      setErrors({});
      onClose();
    }
  };

  const allProjectNames = projects.map((proj) => proj.name);
  const isAllSelected = formData.projects.length === allProjectNames.length;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.name ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.name || 'Full Name'}
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.email ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.email || 'Email Address'}
            />
          </div>
          <div>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.phone ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.phone || 'Phone Number'}
            />
          </div>
          <div>
            <select
              name="authorisation"
              value={formData.authorisation}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.authorisation ? 'border-red-400 bg-red-50 text-red-400' : ''}`}
            >
              <option value="" disabled>{errors.authorisation || 'Select Role'}</option>
              <option value="Supervisor">Project Supervisor</option>
              <option value="Client">Project Client</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 border mb-2"
              onClick={() => setShowProjectsDropdown((prev) => !prev)}
            >
              {showProjectsDropdown ? 'Hide Projects' : 'Select Projects'}
            </button>
            {showProjectsDropdown && (
              <div className="border rounded p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="all-projects"
                    checked={isAllSelected}
                    onChange={e => {
                      setFormData({
                        ...formData,
                        projects: e.target.checked ? allProjectNames : []
                      });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="all-projects" className="text-sm text-gray-700 select-none">All Projects</label>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {projects.map((proj) => (
                    <div key={proj.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`project-${proj.id}`}
                        checked={formData.projects.includes(proj.name)}
                        onChange={e => {
                          let newSelected;
                          if (e.target.checked) {
                            newSelected = [...formData.projects, proj.name];
                          } else {
                            newSelected = formData.projects.filter(p => p !== proj.name);
                          }
                          setFormData({ ...formData, projects: newSelected });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`project-${proj.id}`} className="text-sm text-gray-700 select-none">{proj.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border p-2 rounded bg-gray-50 ${errors.username ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.username || 'Username (auto-generated)'}
            />
            <p className="text-xs text-gray-500 mt-1">Username is auto-generated but can be modified</p>
          </div>
          <div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border p-2 rounded bg-gray-50 ${errors.password ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.password || 'Password (auto-generated)'}
            />
            <p className="text-xs text-gray-500 mt-1">Password is auto-generated but can be modified</p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 