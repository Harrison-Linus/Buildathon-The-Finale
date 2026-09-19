import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';

export default function InternalOpportunities() {
  const { roles, setSelectedRole, employee } = useEmployee();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All departments');
  const navigate = useNavigate();

  const filteredRoles = roles.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.department.toLowerCase().includes(query.toLowerCase()) ||
      r.required_skills.join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesDept = department === 'All departments' || r.department === department;
    return matchesSearch && matchesDept;
  });

  const handleViewMatch = (role) => {
    setSelectedRole(role);
    navigate(`/employee/role-match/${role.id}`);
  };

  const departments = ['All departments', ...new Set(roles.map((r) => r.department))];

  return (
    <div className="opportunities-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Internal Mobility</p>
          <h2>Internal Roles & Project Opportunities</h2>
          <p className="muted">
            Explore open roles across teams, review skill requirements, and analyze your AI match percentage.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <label className="search-input">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, department, or required skills..."
          />
        </label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button className="button filter-button">
          <Filter size={16} /> {filteredRoles.length} Roles Found
        </button>
      </div>

      {/* Opportunities Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredRoles.map((role) => {
          const matchingCount = role.required_skills.filter((sk) =>
            employee.skills.some((empSk) => empSk.toLowerCase() === sk.toLowerCase())
          ).length;

          return (
            <article
              key={role.id}
              className="panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                padding: '1.25rem',
                border: '1px solid rgba(151, 203, 219, 0.2)',
                background: 'rgba(2, 69, 122, 0.12)',
                borderRadius: '12px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="eyebrow" style={{ color: '#97CADB', fontSize: '0.72rem' }}>{role.department}</span>
                    <h3 style={{ fontSize: '1.15rem', color: '#EAF6F6', margin: '0.2rem 0 0.5rem' }}>{role.title}</h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '12px',
                      background: 'rgba(1, 138, 190, 0.2)',
                      color: '#97CADB',
                      border: '1px solid rgba(1, 138, 190, 0.3)',
                      fontWeight: 600
                    }}
                  >
                    {matchingCount}/{role.required_skills.length} Skills Match
                  </span>
                </div>

                <p className="muted" style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: '0.5rem 0 1rem' }}>
                  {role.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <p className="eyebrow" style={{ fontSize: '0.7rem', color: '#97CADB', marginBottom: '0.4rem' }}>
                    Required Skills:
                  </p>
                  <div className="tag-list" style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
                    {role.required_skills.map((skill) => {
                      const isMatched = employee.skills.some(
                        (empSk) => empSk.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <span
                          key={skill}
                          className={isMatched ? 'tag' : 'tag muted-tag'}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            border: isMatched ? '1px solid #018ABE' : '1px dashed rgba(214, 232, 238, 0.3)'
                          }}
                        >
                          {isMatched && <CheckCircle2 size={12} style={{ marginRight: '3px' }} />}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                className="button primary"
                onClick={() => handleViewMatch(role)}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                View Match Analysis <ArrowRight size={15} />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
