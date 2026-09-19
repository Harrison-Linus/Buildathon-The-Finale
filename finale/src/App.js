import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, ArrowRight, Bell, BriefcaseBusiness, BrainCircuit, CheckCircle2, ChevronRight, Cloud, FileSearch, LayoutDashboard, LogOut, Menu, MessageSquare, Moon, Search, Settings, Sparkles, Sun, Target, TrendingUp, Users, X, UserCheck } from 'lucide-react';
import './App.css';
import { employees as localEmployees, roles as localRoles, skillGaps } from './data/mockData';
import { hrService } from './services/api';
import StatCard from './components/common/StatCard';
import StatusBadge from './components/common/StatusBadge';

// Employee Portal Imports
import { EmployeeProvider } from './context/EmployeeContext';
import EmployeeShell from './components/employee/EmployeeShell';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import EmployeeProfile from './components/employee/EmployeeProfile';
import AISkillProfile from './components/employee/AISkillProfile';
import InternalOpportunities from './components/employee/InternalOpportunities';
import RoleMatchDetails from './components/employee/RoleMatchDetails';
import SkillGapAnalysis from './components/employee/SkillGapAnalysis';
import CareerRoadmap from './components/employee/CareerRoadmap';
import AICareerAssistant from './components/employee/AICareerAssistant';

const navItems = [['/', 'Overview', LayoutDashboard], ['/talent', 'Talent Discovery', Users], ['/matching', 'Role Matching', Target], ['/gaps', 'Skill Gap Analysis', Activity], ['/roadmap', 'Career Roadmap', TrendingUp], ['/assistant', 'AI Talent Assistant', MessageSquare]];
const departmentData = [{ name: 'Engineering', value: 96 }, { name: 'Product', value: 42 }, { name: 'Design', value: 28 }, { name: 'Marketing', value: 38 }, { name: 'Finance', value: 44 }];
const skillData = [{ name: 'Python', value: 82 }, { name: 'JavaScript', value: 74 }, { name: 'React', value: 61 }, { name: 'SQL', value: 88 }, { name: 'AWS', value: 49 }, { name: 'Docker', value: 36 }];

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const title = navItems.find(item => item[0] === location.pathname)?.[1] || 'Overview';

  useEffect(() => {
    document.title = `CompanyOS HR Portal - ${title}`;
  }, [title]);

  return (
    <div className={darkMode ? 'app-shell theme-dark' : 'app-shell theme-light'}>
      <aside className={open ? 'sidebar is-open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-wordmark">
            <b>CompanyOS</b>
            <small>AI-Powered HR Intelligence</small>
          </div>
          <button className="icon-button close-menu" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0.75rem 1.25rem', marginBottom: '0.5rem' }}>
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="button primary"
            style={{ width: '100%', fontSize: '0.82rem', justifyContent: 'center', gap: '0.4rem' }}
          >
            <UserCheck size={15} /> Switch to Employee Portal
          </button>
        </div>

        <nav>
          {navItems.map(([path, label, Icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'AI Talent Assistant' && <span className="new-dot" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/settings" className="nav-link">
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button className="nav-link sidebar-logout" type="button">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div className="sidebar-user">
            <div className="avatar">JD</div>
            <div>
              <b>Jordan Davis</b>
              <small>HR Director</small>
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
            <p className="breadcrumb">CompanyOS HR / <span>{title}</span></p>
            <h1>{title}</h1>
          </div>
          <div className="top-actions">
            <button
              className="button primary"
              onClick={() => navigate('/employee/dashboard')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.4rem' }}
            >
              <UserCheck size={15} /> Employee Portal
            </button>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setDarkMode((mode) => !mode)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <label className="global-search">
              <Search size={17} />
              <input placeholder="Search employees, roles, skills, or ask AI..." />
            </label>
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={19} />
              <i />
            </button>
            <div className="profile">
              <div className="avatar avatar-light">JD</div>
              <div>
                <b>Jordan Davis</b>
                <small>HR Director</small>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, action }) { return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="muted">{description}</p>}</div>{action}</div>; }
function Tag({ children, muted }) { return <span className={muted ? 'tag muted-tag' : 'tag'}>{children}</span>; }
function PageNotice({ children }) { return <div className="notice"><Sparkles size={17} /> {children}</div>; }
function useData() { const [data, setData] = useState({ employees: localEmployees, roles: localRoles }); useEffect(() => { Promise.all([hrService.getEmployees(), hrService.getRoles()]).then(([employees, roles]) => setData({ employees, roles })).catch(() => {}); }, []); return data; }

function Overview() { return <><PageNotice><b>Good morning, Jordan.</b> Your organization has 37 skill gaps ready for review.</PageNotice><SectionHeader eyebrow="Organization overview" title="Make talent movement visible" description="A living view of the skills, opportunities, and momentum across your organization." action={<button className="button primary"><FileSearch size={16} /> Generate report</button>} /><div className="stats-grid"><StatCard icon={Users} label="Total employees" value="248" detail="↑ 12 this quarter" accent="mint" /><StatCard icon={BrainCircuit} label="Skills tracked" value="64" detail="↑ 8% from last month" accent="blue" /><StatCard icon={BriefcaseBusiness} label="Internal roles" value="18" detail="6 roles recently added" accent="peach" /><StatCard icon={Target} label="Identified skill gaps" value="37" detail="12 high priority" accent="rose" /></div><div className="dashboard-grid"><article className="panel skill-panel"><div className="panel-heading"><div><p className="eyebrow">Skill intelligence</p><h3>Workforce skill distribution</h3></div><select><option>All departments</option></select></div><ResponsiveContainer width="100%" height={250}><BarChart data={skillData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#D6E8EE" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#02457A', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#02457A', fontSize: 11 }} /><Tooltip cursor={{ fill: '#D6E8EE' }} /><Bar dataKey="value" fill="#018ABE" radius={[5, 5, 0, 0]} barSize={26} /></BarChart></ResponsiveContainer></article><article className="panel department-panel"><div className="panel-heading"><div><p className="eyebrow">People mix</p><h3>Employees by department</h3></div></div><div className="donut-wrap"><ResponsiveContainer width="52%" height={190}><PieChart><Pie data={departmentData} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={3}>{departmentData.map((item, index) => <Cell key={item.name} fill={['#018ABE', '#02457A', '#97CADB', '#001B48', '#D6E8EE'][index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="legend">{departmentData.map((item, index) => <div key={item.name}><i className={`legend-dot dot-${index}`} />{item.name}<b>{item.value}</b></div>)}</div></div></article><article className="panel gaps-panel"><div className="panel-heading"><div><p className="eyebrow">Needs attention</p><h3>Organization skill gaps</h3></div><NavLink to="/gaps" className="text-link">View analysis <ArrowRight size={15} /></NavLink></div><ResponsiveContainer width="100%" height={210}><AreaChart data={skillGaps} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="gapFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#001B48" stopOpacity={0.3} /><stop offset="100%" stopColor="#001B48" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#D6E8EE" /><XAxis dataKey="skill" axisLine={false} tickLine={false} tick={{ fill: '#02457A', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#02457A', fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="value" stroke="#001B48" fill="url(#gapFill)" strokeWidth={2} /></AreaChart></ResponsiveContainer></article><article className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">Live feed</p><h3>Recent activity</h3></div><button className="icon-button"><ArrowRight size={17} /></button></div>{['New employee skills analyzed', 'Role matching completed', 'Skill gap report generated', 'Career roadmap created'].map((item, i) => <div className="activity-row" key={item}><div className={`activity-icon activity-${i}`}><CheckCircle2 size={16} /></div><div><b>{item}</b><small>{['Maya Chen · 12 min ago', 'Arun Kumar → Cloud Engineer · 42 min ago', 'Engineering team · 2 hrs ago', 'Nora Williams · 3 hrs ago'][i]}</small></div><ChevronRight size={16} /></div>)}</article></div></>; }

function Talent() { const { employees } = useData(); const [query, setQuery] = useState(''); const [department, setDepartment] = useState('All departments'); const [selected, setSelected] = useState(null); const filtered = employees.filter(e => (e.name + e.currentRole + e.skills.join(' ')).toLowerCase().includes(query.toLowerCase()) && (department === 'All departments' || e.department === department)); return <><SectionHeader eyebrow="Discover potential" title="Talent discovery" description="Find the people behind the skills, including capabilities that do not show up on a CV." action={<button className="button secondary"><Users size={16} /> Export talent list</button>} /><div className="filter-bar"><label className="search-input"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, role, or skill" /></label><select value={department} onChange={e => setDepartment(e.target.value)}><option>All departments</option>{['Engineering', 'Product', 'Design', 'Marketing', 'Finance'].map(item => <option key={item}>{item}</option>)}</select><select><option>All experience</option><option>0–3 years</option><option>4–7 years</option><option>8+ years</option></select><button className="button filter-button"><Target size={16} /> More filters</button></div><article className="panel table-panel"><div className="table-caption"><div><h3>{filtered.length} people discovered</h3><p className="muted">Sorted by relevance</p></div><button className="icon-button"><Settings size={17} /></button></div><div className="table-scroll"><table><thead><tr><th>Employee</th><th>Current role</th><th>Experience</th><th>Core skills</th><th>Transferable skills</th><th>Potential roles</th><th /></tr></thead><tbody>{filtered.map(employee => <tr key={employee.id}><td><div className="person-cell"><div className="avatar avatar-color">{employee.name.split(' ').map(n => n[0]).join('')}</div><div><b>{employee.name}</b><small>{employee.id} · {employee.department}</small></div></div></td><td>{employee.currentRole}</td><td>{employee.experience} yrs</td><td><div className="tag-list">{employee.skills.slice(0, 2).map(skill => <Tag key={skill}>{skill}</Tag>)}{employee.skills.length > 2 && <Tag muted>+{employee.skills.length - 2}</Tag>}</div></td><td><div className="tag-list">{employee.transferableSkills.map(skill => <Tag key={skill} muted>{skill}</Tag>)}</div></td><td><b className="role-text">{employee.potentialRoles[0]}</b></td><td><button className="table-action" onClick={() => setSelected(employee)}>View profile <ArrowRight size={14} /></button></td></tr>)}</tbody></table></div></article>{selected && <div className="modal-wrap" onClick={() => setSelected(null)}><article className="profile-modal" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)}><X size={18} /></button><div className="profile-hero"><div className="avatar avatar-large">{selected.name.split(' ').map(n => n[0]).join('')}</div><div><p className="eyebrow">{selected.id} · {selected.department}</p><h2>{selected.name}</h2><p>{selected.currentRole} · {selected.experience} years experience</p></div></div><div className="modal-grid"><div><p className="eyebrow">Current skills</p><div className="tag-list">{selected.skills.map(s => <Tag key={s}>{s}</Tag>)}</div></div><div><p className="eyebrow">Transferable skills</p><div className="tag-list">{selected.transferableSkills.map(s => <Tag key={s} muted>{s}</Tag>)}</div></div><div><p className="eyebrow">Projects & certifications</p><p className="modal-copy">{selected.projects.join(', ')}{selected.certifications.length ? ` · ${selected.certifications.join(', ')}` : ''}</p></div><div><p className="eyebrow">AI summary</p><p className="modal-copy">A strong candidate for {selected.potentialRoles[0]} with a clear foundation and adjacent skills ready to be developed.</p></div></div><button className="button primary" onClick={() => setSelected(null)}>Explore internal matches <ArrowRight size={16} /></button></article></div>}</>; }

function AnalysisPage({ mode }) { const { employees, roles } = useData(); const [employeeId, setEmployeeId] = useState('EMP001'); const [roleId, setRoleId] = useState('ROLE001'); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false); const action = async () => { setLoading(true); try { setResult(mode === 'match' ? await hrService.matchRole(employeeId, roleId) : mode === 'gap' ? await hrService.skillGap(employeeId, roleId) : await hrService.roadmap(employeeId, roleId)); } catch { const employee = employees.find(e => e.id === employeeId); const role = roles.find(r => r.id === roleId); const matchingSkills = role.requiredSkills.filter(s => employee.skills.includes(s)); const missingSkills = role.requiredSkills.filter(s => !employee.skills.includes(s)); setResult(mode === 'match' ? { matchPercentage: Math.round(matchingSkills.length / role.requiredSkills.length * 100), matchingSkills, missingSkills, recommendation: 'Suitable with targeted upskilling', explanation: 'A strong foundation with focused opportunities to develop.' } : mode === 'gap' ? { matchingSkills, missingSkills: missingSkills.map((skill, index) => ({ skill, priority: index ? 'Medium' : 'High', recommendedAction: `Complete ${skill} fundamentals learning`, estimatedDuration: index ? '3 weeks' : '2 weeks' })) } : { progress: 20, steps: ['Learn Linux Fundamentals', 'Complete Docker Fundamentals', 'Learn AWS Networking', 'Complete a cloud-based project', 'Apply for the target internal role'].map((title, index) => ({ id: index + 1, title, type: index === 3 ? 'Project' : 'Course', duration: `${index + 1} weeks`, priority: 'High', status: index ? 'Not Started' : 'In Progress' })) }); } finally { setLoading(false); } }; const config = { match: ['Find the right next move', 'Role matching', 'Compare an employee’s current capabilities with an internal opportunity.'], gap: ['Make development actionable', 'Skill gap analysis', 'Turn the distance between today and a target role into a clear learning plan.'], roadmap: ['Create momentum', 'Career roadmap', 'Give employees a practical sequence of steps toward their next role.'] }[mode]; return <><SectionHeader eyebrow={config[0]} title={config[1]} description={config[2]} /><article className="panel control-panel"><div className="select-group"><label>Employee<select value={employeeId} onChange={e => setEmployeeId(e.target.value)}>{employees.map(e => <option key={e.id} value={e.id}>{e.name} · {e.currentRole}</option>)}</select></label><label>Target role<select value={roleId} onChange={e => setRoleId(e.target.value)}>{roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label><button className="button primary analyze-button" onClick={action}>{loading ? 'Analyzing...' : mode === 'roadmap' ? 'Generate roadmap' : 'Analyze match'} <ArrowRight size={16} /></button></div></article>{result && mode === 'match' && <article className="analysis-result"><div className="match-score"><div className="score-ring"><strong>{result.matchPercentage}%</strong><small>match</small></div><div><p className="eyebrow">Match analysis</p><h2>{result.recommendation}</h2><p className="muted">{result.explanation}</p></div></div><div className="result-columns"><div><p className="eyebrow">Matching skills</p><div className="tag-list">{result.matchingSkills.map(s => <Tag key={s}>{s}</Tag>)}</div></div><div><p className="eyebrow">Skills to develop</p><div className="tag-list">{result.missingSkills.map(s => <Tag key={s} muted>{s}</Tag>)}</div></div></div><div className="result-actions"><NavLink className="button secondary" to="/gaps">View skill gaps <ArrowRight size={15} /></NavLink><NavLink className="button primary" to="/roadmap">Generate career roadmap <ArrowRight size={15} /></NavLink></div></article>}{result && mode === 'gap' && <article className="panel gap-result"><div className="panel-heading"><div><p className="eyebrow">Development plan</p><h3>Capability comparison</h3></div><StatusBadge tone="high">{result.missingSkills.length} gaps found</StatusBadge></div><div className="gap-list"><div><p className="eyebrow">Already strong</p>{result.matchingSkills.map(s => <div className="gap-row" key={s}><CheckCircle2 size={17} /><b>{s}</b><StatusBadge tone="ready">Ready</StatusBadge></div>)}</div><div><p className="eyebrow">Recommended focus</p>{result.missingSkills.map(item => <div className="gap-row" key={item.skill}><Cloud size={17} /><div><b>{item.skill}</b><small>{item.recommendedAction} · {item.estimatedDuration}</small></div><StatusBadge tone={item.priority}>{item.priority}</StatusBadge></div>)}</div></div></article>}{result && mode === 'roadmap' && <article className="panel roadmap-panel"><div className="roadmap-progress"><div><p className="eyebrow">Roadmap progress</p><h3>Cloud Engineer readiness</h3></div><b>{result.progress}%</b></div><div className="progress-bar"><i style={{ width: `${result.progress}%` }} /></div><div className="timeline">{result.steps.map(step => <div className="timeline-step" key={step.id}><div className={`step-number ${step.status === 'In Progress' ? 'current' : ''}`}>{step.status === 'Completed' ? <CheckCircle2 size={16} /> : step.id}</div><div className="step-content"><div><p className="eyebrow">{step.type} · {step.duration}</p><h3>{step.title}</h3></div><StatusBadge tone={step.status}>{step.status}</StatusBadge></div></div>)}</div></article>}</>; }

function EmployeeProfileDrawer({ employee, onClose }) { const navigate = useNavigate(); useEffect(() => { const closeOnEscape = event => event.key === 'Escape' && onClose(); document.removeEventListener('keydown', closeOnEscape); return () => document.removeEventListener('keydown', closeOnEscape); }, [onClose]); if (!employee) return null; return <div className="profile-overlay" onClick={onClose}><aside className="employee-drawer" onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="employee-profile-title"><button className="icon-button drawer-close" onClick={onClose} aria-label="Close employee profile"><X size={19} /></button><div className="drawer-hero"><div className="avatar avatar-large">{employee.name.split(' ').map(name => name[0]).join('')}</div><div><p className="eyebrow">{employee.id} / {employee.department}</p><h2 id="employee-profile-title">{employee.name}</h2><p>{employee.currentRole} · {employee.experience} years experience</p></div></div><div className="drawer-section"><p className="eyebrow">Current skills</p><div className="tag-list">{employee.skills.map(skill => <Tag key={skill}>{skill}</Tag>)}</div></div><div className="drawer-section"><p className="eyebrow">Transferable skills</p><div className="tag-list">{employee.transferableSkills.map(skill => <Tag key={skill} muted>{skill}</Tag>)}</div></div><div className="drawer-section"><p className="eyebrow">Projects</p><ul className="drawer-list">{employee.projects.map(project => <li key={project}>{project}</li>)}</ul></div><div className="drawer-section"><p className="eyebrow">Certifications</p><ul className="drawer-list">{(employee.certifications.length ? employee.certifications : ['No certifications listed']).map(certification => <li key={certification}>{certification}</li>)}</ul></div><div className="drawer-section"><p className="eyebrow">Potential internal roles</p><div className="tag-list">{employee.potentialRoles.map(role => <Tag key={role}>{role}</Tag>)}</div></div><div className="drawer-summary"><p className="eyebrow">AI summary</p><p>{employee.name} shows a strong foundation for {employee.potentialRoles[0]}, with transferable strengths that can support a focused internal move.</p></div><button className="button primary drawer-profile-button" onClick={() => navigate(`/employees/${employee.id}`)}>View full profile <ArrowRight size={16} /></button></aside></div>; }

function renderAssistantText(text, employees, onEmployeeClick) { const matches = employees.filter(employee => text.includes(employee.name)); if (!matches.length) return text; const parts = []; let remaining = text; matches.sort((first, second) => remaining.indexOf(first.name) - remaining.indexOf(second.name)).forEach(employee => { const index = remaining.indexOf(employee.name); if (index < 0) return; if (index) parts.push(remaining.slice(0, index)); parts.push(<button className="employee-chip" key={employee.id} onClick={() => onEmployeeClick(employee.id)}>{employee.name}</button>); remaining = remaining.slice(index + employee.name.length); }); if (remaining) parts.push(remaining); return parts; }

function Assistant() { const { employees } = useData(); const [messages, setMessages] = useState([{ from: 'ai', text: 'Hi Jordan. I can help you explore people, roles, and skill priorities across the organization.' }]); const [value, setValue] = useState(''); const [selectedEmployee, setSelectedEmployee] = useState(null); const send = async text => { const message = text || value; if (!message.trim()) return; setValue(''); setMessages(current => [...current, { from: 'user', text: message }, { from: 'ai', text: 'Thinking through the talent data...' }]); try { const result = await hrService.chat(message); setMessages(current => [...current.slice(0, -1), { from: 'ai', text: result.response }]); } catch { setMessages(current => [...current.slice(0, -1), { from: 'ai', text: 'The assistant is ready to answer questions once the API is connected.' }]); } }; const suggestions = ['Which employees have AWS skills?', 'Who is suitable for the Cloud Engineer role?', 'What are the biggest skill gaps in Engineering?', 'Suggest a roadmap for Arun Kumar.']; return <><SectionHeader eyebrow="Your talent copilot" title="AI talent assistant" description="Ask questions in plain language and get grounded answers from your organization’s talent data." action={<button className="button secondary" onClick={() => setMessages([])}>Clear chat</button>} /><div className="assistant-layout"><article className="panel chat-panel"><div className="chat-head"><div className="assistant-avatar"><BrainCircuit size={20} /></div><div><h3>CompanyOS AI Talent Assistant</h3><p><i className="online-dot" /> Powered by CompanyOS · Mock intelligence layer</p></div></div><div className="messages">{messages.map((message, index) => <div className={`message ${message.from}`} key={`${message.text}-${index}`}><div className="message-avatar">{message.from === 'ai' ? <Sparkles size={14} /> : 'JD'}</div><div className="message-bubble">{renderAssistantText(message.text, employees, employeeId => setSelectedEmployee(employees.find(employee => employee.id === employeeId)))}</div></div>)}</div><div className="suggestions">{suggestions.map(suggestion => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>)}</div><form className="chat-input" onSubmit={event => { event.preventDefault(); send(); }}><input value={value} onChange={event => setValue(event.target.value)} placeholder="Ask about your talent data..." /><button className="button primary" aria-label="Send message"><ArrowRight size={17} /></button></form></article><aside className="assistant-aside"><div className="aside-icon"><Sparkles size={20} /></div><h3>Designed for better decisions</h3><p>Ask about hidden skills, internal mobility, or where to invest in learning next.</p><div className="assistant-stat"><b>64</b><span>skills in the knowledge graph</span></div><div className="assistant-stat"><b>18</b><span>open internal opportunities</span></div></aside></div><EmployeeProfileDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} /></>; }

function EmployeeProfilePage() { const { employeeId } = useParams(); const { employees } = useData(); const employee = employees.find(item => item.id === employeeId); const navigate = useNavigate(); if (!employee) return <div className="panel empty-profile"><h2>Employee not found</h2><button className="button secondary" onClick={() => navigate('/talent')}>Back to talent discovery</button></div>; return <div className="profile-page"><SectionHeader eyebrow="Employee profile" title={employee.name} description={`${employee.currentRole} in ${employee.department} · ${employee.experience} years experience`} action={<button className="button secondary" onClick={() => navigate('/talent')}>Back to talent discovery</button>} /><article className="panel full-profile-card"><div className="drawer-hero"><div className="avatar avatar-large">{employee.name.split(' ').map(name => name[0]).join('')}</div><div><p className="eyebrow">{employee.id}</p><h2>{employee.currentRole}</h2><p>{employee.department} · {employee.experience} years experience</p></div></div><div className="profile-grid"><div className="drawer-section"><p className="eyebrow">Current skills</p><div className="tag-list">{employee.skills.map(skill => <Tag key={skill}>{skill}</Tag>)}</div></div><div className="drawer-section"><p className="eyebrow">Transferable skills</p><div className="tag-list">{employee.transferableSkills.map(skill => <Tag key={skill} muted>{skill}</Tag>)}</div></div><div className="drawer-section"><p className="eyebrow">Projects</p><ul className="drawer-list">{employee.projects.map(project => <li key={project}>{project}</li>)}</ul></div><div className="drawer-section"><p className="eyebrow">Certifications</p><ul className="drawer-list">{employee.certifications.map(certification => <li key={certification}>{certification}</li>)}</ul></div></div><div className="drawer-summary"><p className="eyebrow">AI summary</p><p>{employee.name} shows a strong foundation for {employee.potentialRoles[0]}, with transferable strengths that can support a focused internal move.</p></div></article></div>; }

function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <Routes>
          {/* Employee Portal Routes */}
          <Route path="/employee" element={<EmployeeShell><EmployeeDashboard /></EmployeeShell>} />
          <Route path="/employee/dashboard" element={<EmployeeShell><EmployeeDashboard /></EmployeeShell>} />
          <Route path="/employee/profile" element={<EmployeeShell><EmployeeProfile /></EmployeeShell>} />
          <Route path="/employee/skills" element={<EmployeeShell><AISkillProfile /></EmployeeShell>} />
          <Route path="/employee/opportunities" element={<EmployeeShell><InternalOpportunities /></EmployeeShell>} />
          <Route path="/employee/role-match/:roleId" element={<EmployeeShell><RoleMatchDetails /></EmployeeShell>} />
          <Route path="/employee/role-match" element={<EmployeeShell><RoleMatchDetails /></EmployeeShell>} />
          <Route path="/employee/skill-gap" element={<EmployeeShell><SkillGapAnalysis /></EmployeeShell>} />
          <Route path="/employee/career-roadmap" element={<EmployeeShell><CareerRoadmap /></EmployeeShell>} />
          <Route path="/employee/assistant" element={<EmployeeShell><AICareerAssistant /></EmployeeShell>} />

          {/* HR Portal Routes (Harry's Work - Preserved) */}
          <Route path="/" element={<Shell><Overview /></Shell>} />
          <Route path="/talent" element={<Shell><Talent /></Shell>} />
          <Route path="/matching" element={<Shell><AnalysisPage mode="match" /></Shell>} />
          <Route path="/gaps" element={<Shell><AnalysisPage mode="gap" /></Shell>} />
          <Route path="/roadmap" element={<Shell><AnalysisPage mode="roadmap" /></Shell>} />
          <Route path="/assistant" element={<Shell><Assistant /></Shell>} />
          <Route path="/employees/:employeeId" element={<Shell><EmployeeProfilePage /></Shell>} />
          <Route path="*" element={<Shell><Overview /></Shell>} />
        </Routes>
      </EmployeeProvider>
    </BrowserRouter>
  );
}

export default App;
