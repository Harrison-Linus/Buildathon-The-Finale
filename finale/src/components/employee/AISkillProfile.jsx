import React, { useState, useEffect, useCallback } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Zap,
  Target
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import { employeeService, parseAIResponse } from '../../services/api';

export default function AISkillProfile() {
  const { employee, aiSkillAnalysis, setAiSkillAnalysis } = useEmployee();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: employee.name,
        current_role: employee.current_role,
        experience: employee.experience,
        skills: employee.skills,
        projects: employee.projects,
        certifications: employee.certifications
      };
      const response = await employeeService.analyzeSkills(payload);
      if (response && response.data) {
        const parsed = parseAIResponse(response.data);
        setAiSkillAnalysis(parsed);
      } else {
        setAiSkillAnalysis({ rawText: "Analysis completed successfully." });
      }
    } catch (err) {
      console.error('Error analyzing skills:', err);
      setError('Unable to analyze your profile right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [employee, setAiSkillAnalysis]);

  useEffect(() => {
    if (!aiSkillAnalysis) {
      runAnalysis();
    }
  }, [aiSkillAnalysis, runAnalysis]);

  const parsed = aiSkillAnalysis;

  const explicitSkills = parsed?.explicit_skills || [
    { name: 'Python', level: 90 },
    { name: 'AWS', level: 85 },
    { name: 'React', level: 80 },
    { name: 'SQL', level: 75 }
  ];

  const transferableSkills = parsed?.transferable_skills || [
    'Backend Development',
    'Cloud Application Development',
    'Problem Solving',
    'System Design'
  ];

  const strengths = parsed?.strengths || [
    'Solid foundation in modern web development and serverless architecture',
    'Proven ability to deploy production cloud solutions on AWS',
    'Strong analytical capabilities with data structures and REST services'
  ];

  const potentialRoles = parsed?.potential_future_roles || [
    'Cloud Engineer',
    'Backend Developer',
    'DevOps Engineer'
  ];

  const skillGaps = parsed?.skill_gaps;
  const recommendedLearning = parsed?.recommended_learning;
  const careerRoadmap = parsed?.career_roadmap;

  return (
    <div className="skills-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">AI Skill Intelligence</p>
          <h2>AI Skill Profile Analysis</h2>
          <p className="muted">
            Bedrock AI evaluation of your explicit technical skills, hidden transferable capabilities, and growth trajectory.
          </p>
        </div>
        <button className="button primary" onClick={runAnalysis} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Analyzing...' : 'Re-analyze Skills'}
        </button>
      </div>

      {loading && (
        <div className="panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="assistant-avatar" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <BrainCircuit size={24} className="spin" />
          </div>
          <h3>Analyzing your skills with Bedrock AI...</h3>
          <p className="muted" style={{ maxWidth: '450px', margin: '0.5rem auto 0' }}>
            Extracting core technical proficiencies, contextual experience, and transferable competencies from your profile.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="panel" style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} color="#EF4444" />
            <div>
              <b style={{ color: '#EF4444' }}>Skill Analysis Error</b>
              <p className="muted" style={{ fontSize: '0.9rem' }}>{error}</p>
            </div>
          </div>
          <button className="button secondary" onClick={runAnalysis} style={{ marginTop: '1rem' }}>
            Retry Analysis
          </button>
        </div>
      )}

      {!loading && (
        <div className="dashboard-grid">
          {/* Explicit Skills Visualization */}
          <article className="panel skill-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Direct Proficiencies</p>
                <h3>Explicit Technical Skills</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
              {Array.isArray(explicitSkills) ? (
                explicitSkills.map((sk) => {
                  const skillName = typeof sk === 'string' ? sk : sk.name || sk.skill;
                  const skillLevel = typeof sk === 'object' && sk.level ? sk.level : 80;
                  return (
                    <div key={skillName} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <b style={{ color: '#EAF6F6' }}>{skillName}</b>
                        <span style={{ color: '#97CADB', fontWeight: 600 }}>{skillLevel}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: '10px', background: 'rgba(214, 232, 238, 0.15)' }}>
                        <i style={{ width: `${skillLevel}%`, background: 'linear-gradient(90deg, #018ABE, #97CADB)' }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>{String(explicitSkills)}</p>
              )}
            </div>
          </article>

          {/* Transferable Capabilities */}
          <article className="panel department-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Cross-Functional Strengths</p>
                <h3>Transferable Skills</h3>
              </div>
            </div>

            <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Skills inferred from your project portfolio and engineering experience:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.isArray(transferableSkills) &&
                transferableSkills.map((item) => (
                  <div key={typeof item === 'string' ? item : item.name || JSON.stringify(item)} className="activity-row">
                    <div className="activity-icon activity-0"><Zap size={16} /></div>
                    <div>
                      <b style={{ color: '#EAF6F6' }}>{typeof item === 'string' ? item : item.name || JSON.stringify(item)}</b>
                      <small className="muted" style={{ display: 'block' }}>High adaptability across engineering roles</small>
                    </div>
                  </div>
                ))}
            </div>
          </article>

          {/* AI Strengths & Insights */}
          <article className="panel gaps-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">AI Evaluation</p>
                <h3>Core Strengths</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {Array.isArray(strengths) ? (
                strengths.map((str, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={18} color="#018ABE" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.88rem', lineHeight: '1.4' }}>{str}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem' }}>{String(strengths)}</p>
              )}
            </div>
          </article>

          {/* Potential Future Roles */}
          <article className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Growth Trajectory</p>
                <h3>Potential Future Roles</h3>
              </div>
            </div>

            <div className="tag-list" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {Array.isArray(potentialRoles) &&
                potentialRoles.map((role) => (
                  <span
                    key={typeof role === 'string' ? role : role.title || JSON.stringify(role)}
                    className="tag"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'rgba(1, 138, 190, 0.2)', color: '#EAF6F6' }}
                  >
                    <Target size={14} style={{ marginRight: '4px' }} /> {typeof role === 'string' ? role : role.title || JSON.stringify(role)}
                  </span>
                ))}
            </div>

            {/* Additional AI Fields if returned in response */}
            {skillGaps && (
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(214, 232, 238, 0.15)' }}>
                <p className="eyebrow" style={{ color: '#E06D53' }}>Identified Skill Gaps</p>
                <p style={{ fontSize: '0.85rem', color: '#D6E8EE' }}>
                  {Array.isArray(skillGaps) ? skillGaps.join(', ') : String(skillGaps)}
                </p>
              </div>
            )}

            {recommendedLearning && (
              <div style={{ marginTop: '0.75rem' }}>
                <p className="eyebrow" style={{ color: '#97CADB' }}>Recommended Learning</p>
                <p style={{ fontSize: '0.85rem', color: '#D6E8EE' }}>
                  {Array.isArray(recommendedLearning) ? recommendedLearning.join(', ') : String(recommendedLearning)}
                </p>
              </div>
            )}

            {careerRoadmap && (
              <div style={{ marginTop: '0.75rem' }}>
                <p className="eyebrow" style={{ color: '#97CADB' }}>Career Growth Path</p>
                <p style={{ fontSize: '0.85rem', color: '#D6E8EE' }}>
                  {typeof careerRoadmap === 'string' ? careerRoadmap : JSON.stringify(careerRoadmap)}
                </p>
              </div>
            )}

            {parsed?.rawText && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(214, 232, 238, 0.15)' }}>
                <p className="eyebrow" style={{ color: '#97CADB' }}>Raw AI Analysis Text</p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: '#D6E8EE', whiteSpace: 'pre-wrap' }}>
                  {parsed.rawText}
                </div>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
