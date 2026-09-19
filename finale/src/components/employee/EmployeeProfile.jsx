import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Building,
  BookOpen,
  Edit3,
  Save,
  X,
  Sparkles
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import Tag from '../common/Tag';

export default function EmployeeProfile() {
  const { employee, updateEmployee } = useEmployee();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: employee.name,
    current_role: employee.current_role,
    department: employee.department,
    experience: employee.experience,
    skillsStr: employee.skills.join(', '),
    projectsStr: employee.projects.join('\n'),
    certificationsStr: employee.certifications.join(', ')
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateEmployee({
      name: formData.name,
      current_role: formData.current_role,
      department: formData.department,
      experience: formData.experience,
      skills: formData.skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      projects: formData.projectsStr.split('\n').map((p) => p.trim()).filter(Boolean),
      certifications: formData.certificationsStr.split(',').map((c) => c.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  const initials = employee.name
    ? employee.name.split(' ').map((n) => n[0]).join('')
    : 'KM';

  return (
    <div className="profile-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Employee Profile</p>
          <h2>My Talent & Professional Profile</h2>
          <p className="muted">
            Manage your personal work details, skills, certifications, and project portfolio.
          </p>
        </div>
        <button className="button primary" onClick={() => setIsEditing(true)}>
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <article className="panel full-profile-card">
        <div className="drawer-hero" style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(214, 232, 238, 0.15)' }}>
          <div className="avatar avatar-large">{initials}</div>
          <div>
            <p className="eyebrow">{employee.id} · {employee.department}</p>
            <h2>{employee.name}</h2>
            <p>{employee.current_role} · {employee.experience} experience</p>
          </div>
        </div>

        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {/* Work & Info */}
          <div className="drawer-section">
            <p className="eyebrow" style={{ color: '#97CADB' }}>Personal & Work Information</p>
            <ul className="drawer-list" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.4rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <User size={16} className="muted" /> <span><b>Employee ID:</b> {employee.id}</span>
              </li>
              <li style={{ padding: '0.4rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Briefcase size={16} className="muted" /> <span><b>Role:</b> {employee.current_role}</span>
              </li>
              <li style={{ padding: '0.4rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Building size={16} className="muted" /> <span><b>Department:</b> {employee.department}</span>
              </li>
              <li style={{ padding: '0.4rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <BookOpen size={16} className="muted" /> <span><b>Experience:</b> {employee.experience}</span>
              </li>
            </ul>
          </div>

          {/* Current Skills */}
          <div className="drawer-section">
            <p className="eyebrow" style={{ color: '#97CADB' }}>Verified Core Skills</p>
            <div className="tag-list" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
              {employee.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="drawer-section">
            <p className="eyebrow" style={{ color: '#97CADB' }}>Key Projects</p>
            <ul className="drawer-list">
              {employee.projects.map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div className="drawer-section">
            <p className="eyebrow" style={{ color: '#97CADB' }}>Certifications & Learning</p>
            <ul className="drawer-list">
              {employee.certifications.length > 0 ? (
                employee.certifications.map((cert) => <li key={cert}>{cert}</li>)
              ) : (
                <li className="muted">No certifications added yet</li>
              )}
            </ul>
          </div>
        </div>

        {/* AI Profile Summary */}
        <div className="drawer-summary" style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(1, 138, 190, 0.1)', borderRadius: '10px', border: '1px solid rgba(1, 138, 190, 0.25)' }}>
          <p className="eyebrow" style={{ color: '#97CADB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={15} /> AI Profile Intelligence Summary
          </p>
          <p style={{ marginTop: '0.4rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
            <b>{employee.name}</b> demonstrates strong expertise in {employee.skills.slice(0, 3).join(', ')}. Proven capability through project contributions in <i>{employee.projects[0]}</i>. Highly suited for cloud engineering and backend architectural positions.
          </p>
        </div>
      </article>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-wrap" onClick={() => setIsEditing(false)}>
          <article className="profile-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close icon-button" onClick={() => setIsEditing(false)}>
              <X size={18} />
            </button>

            <div className="profile-hero">
              <div>
                <p className="eyebrow">Profile Editor</p>
                <h2>Edit Profile Information</h2>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>
                  <span className="eyebrow">Full Name</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem' }}
                  />
                </label>
                <label>
                  <span className="eyebrow">Current Role</span>
                  <input
                    type="text"
                    value={formData.current_role}
                    onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                    required
                    style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>
                  <span className="eyebrow">Department</span>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem' }}
                  />
                </label>
                <label>
                  <span className="eyebrow">Experience</span>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required
                    style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem' }}
                  />
                </label>
              </div>

              <label>
                <span className="eyebrow">Skills (comma separated)</span>
                <input
                  type="text"
                  value={formData.skillsStr}
                  onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                  style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem' }}
                />
              </label>

              <label>
                <span className="eyebrow">Projects (one per line)</span>
                <textarea
                  rows={3}
                  value={formData.projectsStr}
                  onChange={(e) => setFormData({ ...formData, projectsStr: e.target.value })}
                  style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem', background: '#02457A', color: '#fff', border: '1px solid #97CADB', borderRadius: '6px' }}
                />
              </label>

              <label>
                <span className="eyebrow">Certifications (comma separated)</span>
                <input
                  type="text"
                  value={formData.certificationsStr}
                  onChange={(e) => setFormData({ ...formData, certificationsStr: e.target.value })}
                  style={{ width: '100%', marginTop: '0.3rem', padding: '0.5rem 0.8rem' }}
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="button secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="button primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </article>
        </div>
      )}
    </div>
  );
}
