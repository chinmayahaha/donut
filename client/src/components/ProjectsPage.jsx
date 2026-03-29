import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
const token = localStorage.getItem('token');

useEffect(() => {
  if (!token) {
    navigate('/');
    return;
  }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('${import.meta.env.VITE_API_URL}/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      setError(err.message);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'planning' });

  const handleCreateProject = async () => {
    try {
      await axios.post('${import.meta.env.VITE_API_URL}/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', description: '', status: 'planning' });
      setShowModal(false);
      navigate(0);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-white shadow w-64 flex-none">
        {/* Content will be added here */}
      </aside>

      {/* Main Content */}
      <main className="grow p-8">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !projects.length && (
          <div className="text-center py-10">No projects yet. Create your first one.</div>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white shadow p-4 rounded-lg flex items-center space-x-4 relative">
                <div className="flex-grow overflow-hidden">
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-gray-500">{project.description}</p>
                  <div className="mt-2">
                    {project.status === 'planning' && <span className="bg-gray-200 px-2 py-1 rounded">Planning</span>}
                    {project.status === 'active' && <span className="bg-green-100 px-2 py-1 rounded">Active</span>}
                    {project.status === 'on-hold' && <span className="bg-yellow-100 px-2 py-1 rounded">On-Hold</span>}
                    {project.status === 'completed' && <span className="bg-blue-100 px-2 py-1 rounded">Completed</span>}
                    {project.status === 'archived' && <span className="bg-red-100 px-2 py-1 rounded">Archived</span>}
                  </div>
                  <p className="mt-2 text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Button */}
        <button onClick={() => setShowModal(true)} className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white">
          Create Project
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center px-8 py-10">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create Project</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On-Hold</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center justify-between w-full">
                  <button type="submit" onClick={handleCreateProject} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white">
                    Create
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
