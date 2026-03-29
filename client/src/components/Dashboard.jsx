import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://donut-wd2v.onrender.com';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    axios.get(`${API}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: '⬡', path: '/dashboard', active: true },
    { label: 'Projects', icon: '◈', path: '/projects' },
    { label: 'Subscriptions', icon: '◇', path: '/subscriptions' },
    { label: 'Settings', icon: '⚙', path: '/settings' },
  ];

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const planningProjects = projects.filter(p => p.status === 'planning').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070f; }
        .dash-root {
          display: flex;
          min-height: 100vh;
          background: #07070f;
          font-family: 'Syne', sans-serif;
          color: #fff;
        }
        .sidebar {
          width: 220px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: fixed;
          top: 0; left: 0; bottom: 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px;
          margin-bottom: 40px;
        }
        .brand-icon {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #00ffb4, #0078ff);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .brand-name { font-size: 16px; font-weight: 800; color: #fff; }
        .nav-section-label {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          font-family: 'JetBrains Mono', monospace;
          padding: 0 8px;
          margin-bottom: 8px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.15s;
          margin-bottom: 2px;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.8);
        }
        .nav-item.active {
          background: rgba(0,255,180,0.08);
          color: #00ffb4;
          border: 1px solid rgba(0,255,180,0.12);
        }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .sidebar-bottom {
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 16px;
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          margin-bottom: 8px;
        }
        .avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #00ffb4, #0078ff);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #07070f;
          flex-shrink: 0;
        }
        .user-info { overflow: hidden; }
        .user-name { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 10px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; }
        .logout-btn {
          width: 100%;
          padding: 9px 12px;
          background: rgba(255,60,60,0.06);
          border: 1px solid rgba(255,60,60,0.1);
          border-radius: 8px;
          color: rgba(255,100,100,0.7);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .logout-btn:hover {
          background: rgba(255,60,60,0.1);
          color: #ff6b6b;
        }
        .main {
          margin-left: 220px;
          flex: 1;
          padding: 40px 48px;
          max-width: 1200px;
        }
        .page-header {
          margin-bottom: 40px;
        }
        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }
        .page-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.1); }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }
        .stat-card.green::before { background: linear-gradient(90deg, transparent, #00ffb4, transparent); }
        .stat-card.blue::before { background: linear-gradient(90deg, transparent, #0078ff, transparent); }
        .stat-card.purple::before { background: linear-gradient(90deg, transparent, #8b5cf6, transparent); }
        .stat-label {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 12px;
        }
        .stat-value {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-value.green { color: #00ffb4; }
        .stat-value.blue { color: #0078ff; }
        .stat-change {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          font-family: 'JetBrains Mono', monospace;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 2px;
          font-family: 'JetBrains Mono', monospace;
        }
        .view-all {
          font-size: 12px;
          color: #00ffb4;
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .projects-table {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          overflow: hidden;
        }
        .table-row {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        .table-head {
          display: flex;
          padding: 10px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .table-head span {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          font-family: 'JetBrains Mono', monospace;
        }
        .col-name { flex: 1; }
        .col-status { width: 120px; }
        .col-date { width: 120px; text-align: right; }
        .proj-name { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); }
        .proj-desc { font-size: 12px; color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }
        .badge.planning { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); }
        .badge.active { background: rgba(0,255,180,0.1); color: #00ffb4; border: 1px solid rgba(0,255,180,0.15); }
        .badge.on-hold { background: rgba(255,200,0,0.08); color: #ffc800; }
        .badge.completed { background: rgba(0,120,255,0.1); color: #0078ff; }
        .badge.archived { background: rgba(255,60,60,0.08); color: #ff6b6b; }
        .badge::before { content: '●'; font-size: 8px; }
        .empty-state {
          padding: 48px;
          text-align: center;
        }
        .empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.3; }
        .empty-text { font-size: 14px; color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace; }
        .new-proj-btn {
          padding: 8px 16px;
          background: rgba(0,255,180,0.08);
          border: 1px solid rgba(0,255,180,0.15);
          border-radius: 8px;
          color: #00ffb4;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .new-proj-btn:hover {
          background: rgba(0,255,180,0.12);
          transform: translateY(-1px);
        }
        .date-text { font-size: 12px; color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <div className="dash-root">
        {/* Sidebar */}
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
              <div className="user-info">
                <div className="user-name">{user.name || 'User'}</div>
                <div className="user-role">{user.role || 'member'}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>⎋ Logout</button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="page-header">
            <h1 className="page-title">Welcome back, {user.name?.split(' ')[0] || 'there'}</h1>
            <p className="page-subtitle">$ dashboard --overview</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-label">Total Projects</div>
              <div className="stat-value green">{loading ? '—' : projects.length}</div>
              <div className="stat-change">all time</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Active</div>
              <div className="stat-value blue">{loading ? '—' : activeProjects}</div>
              <div className="stat-change">in progress</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Planning</div>
              <div className="stat-value">{loading ? '—' : planningProjects}</div>
              <div className="stat-change">in queue</div>
            </div>
          </div>

          <div className="section-header">
            <span className="section-title">Recent Projects</span>
            <button className="new-proj-btn" onClick={() => navigate('/projects')}>+ New Project</button>
          </div>

          <div className="projects-table">
            <div className="table-head">
              <span className="col-name">Project</span>
              <span className="col-status">Status</span>
              <span className="col-date">Created</span>
            </div>
            {loading ? (
              <div className="empty-state"><div className="empty-text">Loading...</div></div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◈</div>
                <div className="empty-text">No projects yet. Create your first one.</div>
              </div>
            ) : (
              projects.slice(0, 8).map(p => (
                <div className="table-row" key={p._id}>
                  <div className="col-name">
                    <div className="proj-name">{p.title}</div>
                    {p.description && <div className="proj-desc">{p.description.slice(0, 50)}{p.description.length > 50 ? '...' : ''}</div>}
                  </div>
                  <div className="col-status">
                    <span className={`badge ${p.status}`}>{p.status}</span>
                  </div>
                  <div className="col-date">
                    <span className="date-text">{new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
