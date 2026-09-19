import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import { employeeService, parseAIResponse } from '../../services/api';
import StatusBadge from '../common/StatusBadge';

export default function CareerRoadmap() {
  const { employee, selectedRole, roles, setSelectedRole } = useEmployee();

  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        employee: {
          name: employee.name,
          current_role: employee.current_role,
          experience: employee.experience,
          skills: employee.skills,
          projects: employee.projects,
          certifications: employee.certifications
        },
        role: {
          title: selectedRole.title,
          required_skills: selectedRole.required_skills
        }
      };
      const response = await employeeService.getCareerRoadmap(payload.employee, payload.role);
      if (response && response.data) {
        const parsed = parseAIResponse(response.data);
        setRoadmapData(parsed);
      } else {
        setRoadmapData(null);
      }
    } catch (err) {
      console.error('Error fetching career roadmap:', err);
    } finally {
      setLoading(false);
    }
  }, [employee, selectedRole]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const parsed = roadmapData;

  const defaultSteps = [
    {
      id: 1,
      stage: 'Current Position',
      title: `${employee.current_role} (${employee.department})`,
      type: 'Role',
      duration: 'Present',
      status: 'Completed',
      desc: `Core background in ${employee.skills.slice(0, 3).join(', ')}.`
    },
    {
      id: 2,
      stage: 'Short Term Goal',
      title: 'Linux Fundamentals & Docker Containers',
      type: 'Course & Lab',
      duration: '3 weeks',
      status: 'In Progress',
      desc: 'Master containerization workflows, Dockerfiles, and command-line system admin.'
    },
    {
      id: 3,
      stage: 'Mid Term Goal',
      title: 'AWS Cloud Networking Project',
      type: 'Hands-on Project',
      duration: '4 weeks',
      status: 'Not Started',
      desc: 'Design VPCs, subnets, route tables, security groups, and cloud gateway architectures.'
    },
    {
      id: 4,
      stage: 'Long Term Transition',
      title: `Apply for ${selectedRole.title}`,
      type: 'Internal Mobility',
      duration: '1 week',
      status: 'Not Started',
      desc: 'Complete internal role application and interview with Cloud Engineering team.'
    },
    {
      id: 5,
      stage: 'Career Milestone',
      title: `Full ${selectedRole.title}`,
      type: 'Target Role',
      duration: 'Goal Achieved',
      status: 'Not Started',
      desc: `Operate as a full-fledged ${selectedRole.title} managing production cloud infrastructure.`
    }
  ];

  return (
    <div className="roadmap-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Career Progression</p>
          <h2>Career Roadmap: {employee.current_role} → {selectedRole.title}</h2>
          <p className="muted">
            Bedrock AI recommended step-by-step milestones, skill acquisitions, and project goals to reach {selectedRole.title}.
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

          <button className="button primary" onClick={fetchRoadmap} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="assistant-avatar" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <TrendingUp size={24} className="spin" />
          </div>
          <h3>Building your personalized career roadmap with Bedrock AI...</h3>
        </div>
      )}

      {!loading && (
        <>
          {/* Visual Milestone Journey Flow */}
          <article className="panel roadmap-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="roadmap-progress" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="eyebrow">Overall Readiness</p>
                <h3>{selectedRole.title} Transition</h3>
              </div>
              <b style={{ fontSize: '1.5rem', color: '#018ABE' }}>25% Complete</b>
            </div>

            <div className="progress-bar" style={{ height: '10px', margin: '1rem 0 2rem' }}>
              <i style={{ width: '25%', background: 'linear-gradient(90deg, #018ABE, #97CADB)' }} />
            </div>

            {/* Step-by-Step Timeline */}
            <div className="timeline">
              {defaultSteps.map((step) => (
                <div className="timeline-step" key={step.id}>
                  <div className={`step-number ${step.status === 'In Progress' ? 'current' : ''}`}>
                    {step.status === 'Completed' ? <CheckCircle2 size={16} /> : step.id}
                  </div>
                  <div className="step-content">
                    <div>
                      <p className="eyebrow" style={{ color: '#97CADB' }}>
                        {step.stage} · {step.type} ({step.duration})
                      </p>
                      <h3 style={{ fontSize: '1.1rem', color: '#EAF6F6', margin: '0.2rem 0 0.4rem' }}>{step.title}</h3>
                      <p className="muted" style={{ fontSize: '0.88rem' }}>{step.desc}</p>
                    </div>
                    <StatusBadge tone={step.status}>{step.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* AI Structured Data Output if available */}
          {parsed && (
            <article className="panel" style={{ padding: '1.5rem', background: 'rgba(2, 69, 122, 0.15)', border: '1px solid rgba(151, 203, 219, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sparkles size={18} color="#97CADB" />
                <h3 style={{ margin: 0, color: '#EAF6F6' }}>AI Recommendation Details</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.88rem', color: '#D6E8EE', whiteSpace: 'pre-wrap' }}>
                {typeof parsed === 'string'
                  ? parsed
                  : parsed.rawText
                  ? parsed.rawText
                  : JSON.stringify(parsed, null, 2)}
              </div>
            </article>
          )}
        </>
      )}
    </div>
  );
}
