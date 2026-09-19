import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  BriefcaseBusiness,
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Award,
  Zap,
  Code
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import StatCard from '../common/StatCard';

export default function EmployeeDashboard() {
  const { employee, selectedRole, roles, setSelectedRole } = useEmployee();
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    navigate(`/employee/role-match/${role.id}`);
  };

  return (
    <>
      <div className="notice">
        <Sparkles size={17} />
        <span>
          Welcome back, <b>{employee.name}</b>! Your target career path is set to <b>{selectedRole.title}</b>.
        </span>
      </div>

      <div className="section-header">
        <div>
          <p className="eyebrow">Personal Talent Portal</p>
          <h2>Employee Intelligence Dashboard</h2>
          <p className="muted">
            Overview of your skills, career progression, transferable capabilities, and AI-recommended internal roles.
          </p>
        </div>
        <button className="button primary" onClick={() => navigate('/employee/skills')}>
          <BrainCircuit size={16} /> Run AI Skill Analysis
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="stats-grid">
        <StatCard
          icon={BriefcaseBusiness}
          label="Current Position"
          value={employee.current_role}
          detail={`${employee.department} · ${employee.experience}`}
          accent="mint"
        />
        <StatCard
          icon={BrainCircuit}
          label="Skill Readiness"
          value="85%"
          detail={`${employee.skills.length} core skills tracked`}
          accent="blue"
        />
        <StatCard
          icon={Target}
          label="Target Career Goal"
          value={selectedRole.title}
          detail={selectedRole.department}
          accent="peach"
        />
        <StatCard
          icon={TrendingUp}
          label="Internal Opportunities"
          value={`${roles.length} Available`}
          detail="Matched against your profile"
          accent="rose"
        />
      </div>

      {/* Dashboard Main Grid */}
      <div className="dashboard-grid">
        {/* Top Skills & Readiness */}
        <article className="panel skill-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Competency profile</p>
              <h3>Top Core Skills & Proficiency</h3>
            </div>
            <NavLink to="/employee/skills" className="text-link">
              Full analysis <ArrowRight size={15} />
            </NavLink>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {[
              { name: 'Python', level: 90, tone: 'high' },
              { name: 'AWS', level: 85, tone: 'high' },
              { name: 'React', level: 80, tone: 'medium' },
              { name: 'SQL', level: 75, tone: 'medium' }
            ].map((s) => (
              <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <b style={{ color: 'var(--text-color, #EAF6F6)' }}>{s.name}</b>
                  <span className="muted">{s.level}%</span>
                </div>
                <div className="progress-bar" style={{ height: '8px', background: 'rgba(214, 232, 238, 0.2)' }}>
                  <i style={{ width: `${s.level}%`, background: 'linear-gradient(90deg, #018ABE, #97CADB)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(214, 232, 238, 0.15)' }}>
            <p className="eyebrow" style={{ fontSize: '0.72rem', marginBottom: '0.5rem' }}>Transferable Skills</p>
            <div className="tag-list">
              <span className="tag muted-tag">Backend Development</span>
              <span className="tag muted-tag">Cloud Application Dev</span>
              <span className="tag muted-tag">Problem Solving</span>
              <span className="tag muted-tag">System Design</span>
            </div>
          </div>
        </article>

        {/* Quick Navigation Cards */}
        <article className="panel department-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Quick Workflows</p>
              <h3>Employee Career Tools</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {[
              { title: 'AI Skill Profile', desc: 'Discover explicit & transferable skills with Bedrock AI', path: '/employee/skills', icon: BrainCircuit, color: '#018ABE' },
              { title: 'Explore Opportunities', desc: 'Browse internal open positions and project matches', path: '/employee/opportunities', icon: BriefcaseBusiness, color: '#97CADB' },
              { title: 'Skill Gap Analysis', desc: 'Identify missing skills for your target role', path: '/employee/skill-gap', icon: Zap, color: '#02457A' },
              { title: 'Career Roadmap', desc: 'Interactive step-by-step career path timeline', path: '/employee/career-roadmap', icon: TrendingUp, color: '#001B48' },
              { title: 'AI Career Assistant', desc: 'Chat with AI for career guidance and skill advice', path: '/employee/assistant', icon: MessageSquare, color: '#018ABE' }
            ].map((tool) => (
              <div
                key={tool.title}
                onClick={() => navigate(tool.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(214, 232, 238, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="activity-row"
              >
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: `${tool.color}22`, color: tool.color }}>
                  <tool.icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: '0.88rem', display: 'block' }}>{tool.title}</b>
                  <small className="muted" style={{ fontSize: '0.75rem' }}>{tool.desc}</small>
                </div>
                <ArrowRight size={15} className="muted" />
              </div>
            ))}
          </div>
        </article>

        {/* Recommended Internal Roles */}
        <article className="panel gaps-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Matched Opportunities</p>
              <h3>Top Recommended Roles</h3>
            </div>
            <NavLink to="/employee/opportunities" className="text-link">
              View all ({roles.length}) <ArrowRight size={15} />
            </NavLink>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {roles.slice(0, 3).map((r) => (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(2, 69, 122, 0.15)',
                  border: '1px solid rgba(151, 203, 219, 0.2)'
                }}
              >
                <div>
                  <b style={{ fontSize: '0.92rem', display: 'block', color: '#EAF6F6' }}>{r.title}</b>
                  <small className="muted" style={{ fontSize: '0.78rem' }}>{r.department}</small>
                  <div className="tag-list" style={{ marginTop: '0.4rem' }}>
                    {r.required_skills.slice(0, 3).map((sk) => (
                      <span className="tag" key={sk} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>{sk}</span>
                    ))}
                  </div>
                </div>

                <button className="button primary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }} onClick={() => handleSelectRole(r)}>
                  View Match <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </article>

        {/* Recent Projects & Certifications */}
        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Portfolio Summary</p>
              <h3>Projects & Certifications</h3>
            </div>
            <NavLink to="/employee/profile" className="text-link">Edit profile <ArrowRight size={15} /></NavLink>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p className="eyebrow" style={{ fontSize: '0.72rem', color: '#97CADB' }}>Key Projects</p>
            {employee.projects.map((proj) => (
              <div className="activity-row" key={proj}>
                <div className="activity-icon activity-0"><Code size={16} /></div>
                <div>
                  <b>{proj}</b>
                  <small className="muted">Active portfolio contribution</small>
                </div>
              </div>
            ))}

            <p className="eyebrow" style={{ fontSize: '0.72rem', color: '#97CADB', marginTop: '0.5rem' }}>Certifications</p>
            {employee.certifications.map((cert) => (
              <div className="activity-row" key={cert}>
                <div className="activity-icon activity-1"><Award size={16} /></div>
                <div>
                  <b>{cert}</b>
                  <small className="muted">Verified credential</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
