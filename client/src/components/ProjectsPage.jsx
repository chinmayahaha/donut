import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://donut-wd2v.onrender.com';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'planning' });
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    try {
      const res = await axios.post(`${API}/api/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([res.data, ...projects]);
      setFormData({ title: '', description: '', status: 'planning' });
      setShowModal(false);
      toast.success('Project created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: '⬡', path: '/dashboard' },
    { label: 'Projects', icon: '◈', path: '/projects', active: true },
    { label: 'Subscriptions', icon: '◇', path: '/subscriptions' },
    { label: 'Settings', icon: '⚙', path: '/settings' },
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const statusColors = {
    planning: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.08)' },
    active: { bg: 'rgba(0,255,180,0.08)', color: '#00ffb4', border: 'rgba(0,255,180,0.15)' },
    'on-hold': { bg: 'rgba(255,200,0,0.08)', color: '#ffc800', border: 'rgba(255,200,0,0.15)' },
    completed: { bg: 'rgba(0,120,255,0.08)', color: '#0078ff', border: 'rgba(0,120,255,0.15)' },
    archived: { bg: 'rgba(255,60,60,0.08)', color: '#ff6b6b', border: 'rgba(255,60,60,0.15)' },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070f; }
        .proj-root { display: flex; min-height: 100vh; background: #07070f; font-family: 'Syne', sans-serif; color: #fff; }
        .sidebar {
          width: 220px; flex-shrink: 0;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column;
          padding: 24px 16px;
          position: fixed; top: 0; left: 0; bottom: 0;
        }
        .brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px; margin-bottom: 40px; }
        .brand-icon {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #00ffb4, #0078ff);
          border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .brand-name { font-size: 16px; font-weight: 800; color: #fff; }
        .nav-section-label {
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.2); font-family: 'JetBrains Mono', monospace;
          padding: 0 8px; margin-bottom: 8px;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px; cursor: pointer;
          color: rgba(255,255,255,0.4); font-size: 14px; font-weight: 600;
          transition: all 0.15s; margin-bottom: 2px;
          border: none; background: none; width: 100%; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); }
        .nav-item.active { background: rgba(0,255,180,0.08); color: #00ffb4; border: 1px solid rgba(0,255,180,0.12); }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .sidebar-bottom { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; }
        .user-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 8px;
        }
        .avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #00ffb4, #0078ff);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #07070f; flex-shrink: 0;
        }
        .user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .user-role { font-size: 10px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; }
        .logout-btn {
          width: 100%; padding: 9px 12px;
          background: rgba(255,60,60,0.06); border: 1px solid rgba(255,60,60,0.1);
          border-radius: 8px; color: rgba(255,100,100,0.7);
          font-size: 13px; font-weight: 600; font-family: 'Syne', sans-serif;
          cursor: pointer; transition: all 0.15s; text-align: left;
        }
        .logout-btn:hover { background: rgba(255,60,60,0.1); color: #ff6b6b; }
        .main { margin-left: 220px; flex: 1; padding: 40px 48px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
        .page-title { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px; margin-bottom: 4px; }
        .page-subtitle { font-size: 13px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; }
        .create-btn {
          padding: 11px 20px;
          background: linear-gradient(135deg, #00ffb4, #00c896);
          border: none; border-radius: 8px;
          color: #07070f; font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .create-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,255,180,0.25); }
        .filter-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .filter-btn {
          padding: 6px 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; color: rgba(255,255,255,0.4);
          font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          cursor: pointer; transition: all 0.15s;
        }
        .filter-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
        .filter-btn.active { background: rgba(0,255,180,0.08); border-color: rgba(0,255,180,0.2); color: #00ffb4; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .proj-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 20px; transition: all 0.2s;
        }
        .proj-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .proj-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
        .proj-title { font-size: 15px; font-weight: 700; color: #fff; flex: 1; margin-right: 12px; }
        .proj-desc { font-size: 13px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; line-height: 1.5; margin-bottom: 16px; min-height: 20px; }
        .proj-footer { display: flex; align-items: center; justify-content: space-between; }
        .proj-date { font-size: 11px; color: rgba(255,255,255,0.2); font-family: 'JetBrains Mono', monospace; }
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          border: 1px solid transparent;
        }
        .badge::before { content: '●'; font-size: 7px; }
        .delete-btn {
          background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.1);
          border-radius: 6px; color: rgba(255,100,100,0.5);
          padding: 5px 10px; font-size: 12px; cursor: pointer;
          font-family: 'JetBrains Mono', monospace; transition: all 0.15s;
        }
        .delete-btn:hover { background: rgba(255,60,60,0.15); color: #ff6b6b; }
        .empty-state { padding: 80px 40px; text-align: center; }
        .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.2; }
        .empty-text { font-size: 14px; color: rgba(255,255,255,0.2); font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; }
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 20px;
        }
        .modal {
          background: #111118; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 36px; width: 100%; max-width: 480px; position: relative;
        }
        .modal::before {
          content: ''; position: absolute; top: 0; left: 40px; right: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,180,0.4), transparent);
        }
        .modal-title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 24px; }
        .modal-field { margin-bottom: 16px; }
        .modal-label {
          display: block; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; margin-bottom: 8px;
        }
        .modal-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
          padding: 11px 14px; color: #fff; font-size: 14px;
          font-family: 'JetBrains Mono', monospace; outline: none; transition: all 0.2s;
        }
        .modal-input:focus { border-color: rgba(0,255,180,0.4); background: rgba(0,255,180,0.03); }
        .modal-input::placeholder { color: rgba(255,255,255,0.2); }
        textarea.modal-input { resize: vertical; min-height: 80px; }
        .modal-footer { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }
        .modal-cancel {
          padding: 10px 20px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
          color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 600;
          font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.15s;
        }
        .modal-cancel:hover { background: rgba(255,255,255,0.07); }
        .modal-create {
          padding: 10px 24px; background: linear-gradient(135deg, #00ffb4, #00c896);
          border: none; border-radius: 8px;
          color: #07070f; font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .modal-create:hover { box-shadow: 0 6px 20px rgba(0,255,180,0.25); }
      `}</style>
      <div className="proj-root">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">🍩</div>
            <span className="brand-name">donut</span>
          </div>
          <div className="nav-section-label">Menu</div>
          {navItems.map(item => (
            <button key={item.label} className={`nav-item ${item.active ? 'active' : ''}`} onClick={() => navigate(item.path)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <div className="user-name">{user.name || 'User'}</div>
                <div className="user-role">{user.role || 'member'}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/'); }}>⎋ Logout</button>
          </div>
        </aside>

        <main className="main">
          <div className="page-header">
            <div>
              <h1 className="page-title">Projects</h1>
              <p className="page-subtitle">$ projects --list</p>
            </div>
            <button className="create-btn" onClick={() => setShowModal(true)}>+ New Project</button>
          </div>

          <div className="filter-bar">
            {['all', 'active', 'planning', 'on-hold', 'completed', 'archived'].map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state"><div className="empty-text">Loading...</div></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <div className="empty-text">No projects found.</div>
              <button className="create-btn" style={{marginTop:'16px'}} onClick={() => setShowModal(true)}>+ Create first project</button>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => {
                const sc = statusColors[p.status] || statusColors.planning;
                return (
                  <div className="proj-card" key={p._id}>
                    <div className="proj-card-header">
                      <div className="proj-title">{p.title}</div>
                      <span className="badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{p.status}</span>
                    </div>
                    <div className="proj-desc">{p.description || 'No description'}</div>
                    <div className="proj-footer">
                      <span className="proj-date">{new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <button className="delete-btn" onClick={() => handleDelete(p._id)}>delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <h3 className="modal-title">New Project</h3>
              <div className="modal-field">
                <label className="modal-label">Title</label>
                <input className="modal-input" type="text" placeholder="My awesome project"
                  value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Description</label>
                <textarea className="modal-input" placeholder="What's this project about?"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Status</label>
                <select className="modal-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="modal-create" onClick={handleCreate}>Create →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;
