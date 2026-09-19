import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Cloud,
  RefreshCw,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import { employeeService, parseAIResponse } from '../../services/api';
import StatusBadge from '../common/StatusBadge';

export default function SkillGapAnalysis() {
  const { employee, selectedRole, roles, setSelectedRole } = useEmployee();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [gapData, setGapData] = useState(null);

  const fetchSkillGap = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        employee: {
          id: employee.id,
          name: employee.name,
          current_role: employee.current_role,
          skills: employee.skills
        },
        role: {
          id: selectedRole.id,
          title: selectedRole.title,
          required_skills: selectedRole.required_skills
        }
      };
      const response = await employeeService.getSkillGap(payload.employee, payload.role);
      if (response && response.data) {
        const parsed = parseAIResponse(response.data);
        setGapData(parsed);
      } else {
        const missing = selectedRole.required_skills.filter(
          (s) => !employee.skills.some((empSk) => empSk.toLowerCase() === s.toLowerCase())
        );
        setGapData({
          target_role: selectedRole.title,
          missing_skills: missing,
          ai_learning_plan: 'Focus on Docker containers, Linux system administration, and AWS Cloud networking configurations.'
        });
      }
    } catch (err) {
      console.error('Error fetching skill gap:', err);
      const missing = selectedRole.required_skills.filter(
        (s) => !employee.skills.some((empSk) => empSk.toLowerCase() === s.toLowerCase())
      );
      setGapData({
        target_role: selectedRole.title,
        missing_skills: missing,
        ai_learning_plan: `Priority learning plan for ${selectedRole.title}: Master ${missing.join(', ')}.`
      });
    } finally {
      setLoading(false);
    }
  }, [employee, selectedRole]);

  useEffect(() => {
    fetchSkillGap();
  }, [fetchSkillGap]);

  const missingSkillsList = gapData?.missing_skills || ['Docker', 'Linux', 'Networking'];
  const learningPlan = gapData?.ai_learning_plan || gapData?.rawText || 'Complete recommended fundamentals courses and projects.';

  const matchingSkills = selectedRole.required_skills.filter((s) =>
    employee.skills.some((empSk) => empSk.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="gap-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Gap Intelligence</p>
          <h2>Skill Gap Analysis: {selectedRole.title}</h2>
          <p className="muted">
            Detailed breakdown comparing your current skills against required competencies for {selectedRole.title}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={selectedRole.id}
            onChange={(e) => {
              const r = roles.find((item) => item.id === e.target.value);
              if (r) setSelectedRole(r);
            }}
            style={{ padding: '0.45rem 0.8rem' }}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                Target: {r.title}
              </option>
            ))}
          </select>

          <button className="button primary" onClick={fetchSkillGap} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="assistant-avatar" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <Activity size={24} className="spin" />
          </div>
          <h3>Analyzing your skill gaps with Bedrock AI...</h3>
        </div>
      )}

      {!loading && (
        <>
          {/* Skill Level Visual Comparison Chart */}
          <article className="panel skill-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Visual Capability Comparison</p>
                <h3>Skill Level vs. Role Benchmark</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {selectedRole.required_skills.map((skill) => {
                const isMatched = employee.skills.some((empSk) => empSk.toLowerCase() === skill.toLowerCase());
                const val = isMatched ? 85 : skill === 'Docker' ? 30 : skill === 'Linux' ? 25 : 15;
                return (
                  <div key={skill} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <b style={{ color: '#EAF6F6' }}>
                        {skill} {isMatched ? '✓ (Current)' : '• (Gap)'}
                      </b>
                      <span className="muted" style={{ fontWeight: 600 }}>{val}% Proficiency</span>
                    </div>
                    <div className="progress-bar" style={{ height: '10px', background: 'rgba(214, 232, 238, 0.15)' }}>
                      <i
                        style={{
                          width: `${val}%`,
                          background: isMatched
                            ? 'linear-gradient(90deg, #018ABE, #97CADB)'
                            : 'linear-gradient(90deg, #E06D53, #F5A623)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Detailed Skill Breakdown */}
          <article className="panel gap-result" style={{ marginBottom: '1.5rem' }}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Capability Comparison</p>
                <h3>Actionable Skill Gaps</h3>
              </div>
              <StatusBadge tone="high">{missingSkillsList.length} Gaps Identified</StatusBadge>
            </div>

            <div className="gap-list">
              <div>
                <p className="eyebrow" style={{ color: '#97CADB' }}>Already Proficient</p>
                {matchingSkills.map((s) => (
                  <div className="gap-row" key={s}>
                    <CheckCircle2 size={17} color="#018ABE" />
                    <b>{s}</b>
                    <StatusBadge tone="ready">Verified</StatusBadge>
                  </div>
                ))}
              </div>

              <div>
                <p className="eyebrow" style={{ color: '#97CADB' }}>Recommended Learning Focus</p>
                {missingSkillsList.map((skItem, idx) => {
                  const skillName = typeof skItem === 'string' ? skItem : skItem.skill || String(skItem);
                  const priority = idx === 0 ? 'High' : 'Medium';
                  return (
                    <div className="gap-row" key={skillName}>
                      <Cloud size={17} color="#E06D53" />
                      <div>
                        <b>{skillName}</b>
                        <small className="muted" style={{ display: 'block' }}>
                          Recommended: Complete {skillName} fundamentals & hands-on lab
                        </small>
                      </div>
                      <StatusBadge tone={priority}>{priority}</StatusBadge>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* AI Learning Plan */}
          <article className="panel" style={{ padding: '1.5rem', background: 'rgba(1, 138, 190, 0.1)', border: '1px solid rgba(1, 138, 190, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Sparkles size={20} color="#97CADB" />
              <h3 style={{ margin: 0, color: '#EAF6F6' }}>AI Generated Learning Plan</h3>
            </div>
            <p style={{ lineHeight: '1.6', fontSize: '0.92rem', color: '#D6E8EE', whiteSpace: 'pre-wrap' }}>
              {typeof learningPlan === 'string' ? learningPlan : JSON.stringify(learningPlan, null, 2)}
            </p>

            <button className="button primary" onClick={() => navigate('/employee/career-roadmap')} style={{ marginTop: '1.25rem' }}>
              Build Career Roadmap <ArrowRight size={16} />
            </button>
          </article>
        </>
      )}
    </div>
  );
}
