import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BrainCircuit,
  BriefcaseBusiness,
  Activity,
  TrendingUp,
  MessageSquare,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';

const empNavItems = [
  ['/employee/dashboard', 'Dashboard', LayoutDashboard],
  ['/employee/profile', 'My Profile', User],
  ['/employee/skills', 'AI Skill Profile', BrainCircuit],
  ['/employee/opportunities', 'Opportunities', BriefcaseBusiness],
  ['/employee/skill-gap', 'Skill Gap', Activity],
  ['/employee/career-roadmap', 'Career Roadmap', TrendingUp],
  ['/employee/assistant', 'AI Career Assistant', MessageSquare]
];

export default function EmployeeShell({ children }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { employee, selectedRole } = useEmployee();

  const currentNav = empNavItems.find(item => location.pathname.startsWith(item[0]));
  const title = currentNav ? currentNav[1] : 'Employee Portal';

  useEffect(() => {
    document.title = `CompanyOS Employee Portal - ${title}`;
  }, [title]);

  const initials = employee.name
    ? employee.name.split(' ').map(n => n[0]).join('')
    : 'KM';

  return (
    <div className={darkMode ? 'app-shell theme-dark' : 'app-shell theme-light'}>
      <aside className={open ? 'sidebar is-open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-wordmark">
            <b>CompanyOS</b>
            <small>Employee Career Portal</small>
          </div>
          <button className="icon-button close-menu" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0.75rem 1.25rem', marginBottom: '0.5rem' }}>
          <button
            onClick={() => navigate('/')}
            className="button secondary"
            style={{ width: '100%', fontSize: '0.82rem', justifyContent: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} /> Switch to HR Portal
          </button>
        </div>

        <nav>
          {empNavItems.map(([path, label, Icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'AI Career Assistant' && <span className="new-dot" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="target-role-badge" style={{ padding: '0.75rem 1rem', background: 'rgba(1, 138, 190, 0.12)', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid rgba(1, 138, 190, 0.25)' }}>
            <p className="eyebrow" style={{ fontSize: '0.68rem', marginBottom: '0.2rem', color: '#97CADB' }}>Target Career Role</p>
            <b style={{ fontSize: '0.85rem', color: '#EAF6F6' }}>{selectedRole ? selectedRole.title : 'Cloud Engineer'}</b>
          </div>
          <button className="nav-link sidebar-logout" type="button" onClick={() => navigate('/')}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div className="sidebar-user" onClick={() => navigate('/employee/profile')} style={{ cursor: 'pointer' }}>
            <div className="avatar">{initials}</div>
            <div>
              <b>{employee.name}</b>
              <small>{employee.current_role}</small>
            </div>
            <ChevronRight size={16} />
          </div>
        </div>
      </aside>

      <div className="backdrop" onClick={() => setOpen(false)} />

      <main className="main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <div>
            <p className="breadcrumb">Employee Portal / <span>{title}</span></p>
            <h1>{title}</h1>
          </div>

          <div className="top-actions">
            <button
              className="button secondary portal-switch-top"
              onClick={() => navigate('/')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.4rem' }}
            >
              <Award size={15} /> HR Portal
            </button>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setDarkMode(mode => !mode)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <div className="profile" onClick={() => navigate('/employee/profile')} style={{ cursor: 'pointer' }}>
              <div className="avatar avatar-light">{initials}</div>
              <div>
                <b>{employee.name}</b>
                <small>{employee.department}</small>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
