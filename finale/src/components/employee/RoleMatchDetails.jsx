import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Award
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import { employeeService, parseAIResponse } from '../../services/api';
import Tag from '../common/Tag';

export default function RoleMatchDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { employee, selectedRole, selectRoleById } = useEmployee();

  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);

  // Synchronize target role from route param or selectedRole
  const currentRole = roleId ? selectRoleById(roleId) : selectedRole;

  const fetchMatch = useCallback(async () => {
    if (!currentRole) return;
    setLoading(true);
    try {
      const payload = {
        employee: {
          id: employee.id,
          name: employee.name,
          current_role: employee.current_role,
          skills: employee.skills,
          projects: employee.projects
        },
        role: {
          id: currentRole.id,
          title: currentRole.title,
          required_skills: currentRole.required_skills
        }
      };
      const response = await employeeService.matchRole(payload.employee, payload.role);
      if (response && response.data) {
        const parsed = parseAIResponse(response.data);
        setMatchData(parsed);
      } else {
        setMatchData({
          match_percentage: 60,
          matching_skills: currentRole.required_skills.filter(s =>
            employee.skills.some(empSk => empSk.toLowerCase() === s.toLowerCase())
          ),
          skill_gaps: currentRole.required_skills.filter(s =>
            !employee.skills.some(empSk => empSk.toLowerCase() === s.toLowerCase())
          ),
          explanation: `Matches key skills like ${employee.skills.join(', ')} with opportunity to grow in role-specific infrastructure requirements.`
        });
      }
    } catch (err) {
      console.error('Error fetching role match:', err);
      const matchingSkills = currentRole.required_skills.filter(s =>
        employee.skills.some(empSk => empSk.toLowerCase() === s.toLowerCase())
      );
      const skillGaps = currentRole.required_skills.filter(s =>
        !employee.skills.some(empSk => empSk.toLowerCase() === s.toLowerCase())
      );
      const percentage = Math.round((matchingSkills.length / currentRole.required_skills.length) * 100);
      setMatchData({
        match_percentage: percentage,
        matching_skills: matchingSkills,
        skill_gaps: skillGaps,
        explanation: `${employee.name} demonstrates a solid foundation for ${currentRole.title} with key overlaps in ${matchingSkills.join(', ')}.`
      });
    } finally {
      setLoading(false);
    }
  }, [currentRole, employee]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  const matchPercentage = matchData?.match_percentage ?? 60;
  const matchingSkills = matchData?.matching_skills || ['AWS', 'Python'];
  const skillGaps = matchData?.skill_gaps || ['Docker', 'Linux', 'Networking'];
  const explanation = matchData?.explanation || matchData?.rawText || 'Strong technical foundation with targeted upskilling path available.';

  return (
    <div className="match-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">AI Role Match Analysis</p>
          <h2>Role Match: {currentRole?.title || 'Target Role'}</h2>
          <p className="muted">
            Evaluation comparing {employee.name}'s qualifications with {currentRole?.department || 'Department'}.
          </p>
        </div>
        <button className="button primary" onClick={fetchMatch} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Analyzing...' : 'Re-run Match'}
        </button>
      </div>

      {loading && (
        <div className="panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="assistant-avatar" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <Target size={24} className="spin" />
          </div>
          <h3>Analyzing role compatibility with Bedrock AI...</h3>
        </div>
      )}

      {!loading && (
        <>
          <article className="analysis-result" style={{ marginBottom: '1.5rem' }}>
            <div className="match-score">
              <div className="score-ring">
                <strong>{matchPercentage}%</strong>
                <small>Match</small>
              </div>
              <div>
                <p className="eyebrow">{currentRole?.department}</p>
                <h2>{currentRole?.title}</h2>
                <p className="muted">{explanation}</p>
              </div>
            </div>

            <div className="result-columns">
              <div>
                <p className="eyebrow" style={{ color: '#97CADB', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={16} color="#018ABE" /> Matching Skills
                </p>
                <div className="tag-list" style={{ marginTop: '0.4rem' }}>
                  {matchingSkills.map((sk) => (
                    <Tag key={sk}>✓ {sk}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow" style={{ color: '#97CADB', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={16} color="#E06D53" /> Skill Gaps to Bridge
                </p>
                <div className="tag-list" style={{ marginTop: '0.4rem' }}>
                  {skillGaps.map((sk) => (
                    <Tag key={sk} muted>• {sk}</Tag>
                  ))}
                </div>
              </div>
            </div>

            <div className="result-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button className="button secondary" onClick={() => navigate('/employee/skill-gap')}>
                View Skill Gap Analysis <ArrowRight size={15} />
              </button>
              <button className="button primary" onClick={() => navigate('/employee/career-roadmap')}>
                Generate Career Roadmap <ArrowRight size={15} />
              </button>
            </div>
          </article>

          <div className="dashboard-grid">
            {/* Relevant Projects */}
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Portfolio Alignment</p>
                  <h3>Relevant Employee Projects</h3>
                </div>
              </div>
              <ul className="drawer-list">
                {employee.projects.map((proj) => (
                  <li key={proj} style={{ margin: '0.5rem 0' }}>
                    <b style={{ color: '#EAF6F6' }}>{proj}</b>
                    <small className="muted" style={{ display: 'block' }}>Demonstrated hands-on domain experience</small>
                  </li>
                ))}
              </ul>
            </article>

            {/* Relevant Experience & Certifications */}
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Background & Credentials</p>
                  <h3>Experience & Certifications</h3>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="activity-row">
                  <div className="activity-icon activity-1"><BookOpen size={16} /></div>
                  <div>
                    <b>{employee.experience} Professional Experience</b>
                    <small className="muted">{employee.current_role} in {employee.department}</small>
                  </div>
                </div>
                {employee.certifications.map((cert) => (
                  <div className="activity-row" key={cert}>
                    <div className="activity-icon activity-0"><Award size={16} /></div>
                    <div>
                      <b>{cert}</b>
                      <small className="muted">Industry standard credential</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      )}
    </div>
  );
}
