import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BrainCircuit
} from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';
import { employeeService, parseAIResponse } from '../../services/api';

const suggestedQuestions = [
  "What skills should I learn for Cloud Engineer?",
  "Which internal roles match my profile?",
  "What are my biggest skill gaps?",
  "How can I move to a DevOps role?",
  "Create a career roadmap for me."
];

export default function AICareerAssistant() {
  const { employee, selectedRole } = useEmployee();
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Hello ${employee.name}! I am your AI Career Assistant powered by Amazon Bedrock. How can I help you advance your career at CompanyOS?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    const userMsg = { from: 'user', text: q };
    const tempAiMsg = { from: 'ai', text: 'AI is thinking...', isLoading: true };

    setMessages((prev) => [...prev, userMsg, tempAiMsg]);
    setLoading(true);

    try {
      const payloadEmployee = {
        name: employee.name,
        current_role: employee.current_role,
        skills: employee.skills,
        projects: employee.projects
      };

      const response = await employeeService.careerChat(payloadEmployee, q);

      let aiText = '';
      if (response && response.data) {
        const parsed = parseAIResponse(response.data);
        aiText = typeof parsed === 'string' ? parsed : parsed.rawText || JSON.stringify(parsed);
      } else {
        aiText = 'Thank you for your question. To reach your career goals, focus on mastering cloud networking, container orchestration (Docker/Kubernetes), and infrastructure as code.';
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: 'ai', text: aiText }
      ]);
    } catch (err) {
      console.error('Error calling careerChat:', err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          from: 'ai',
          text: 'Unable to reach the AI assistant right now. Please check your connection and try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistant-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Interactive AI Copilot</p>
          <h2>AI Career Assistant</h2>
          <p className="muted">
            Ask questions about career advancement, skill development, internal roles, and roadmap strategy.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() =>
            setMessages([
              {
                from: 'ai',
                text: `Hello ${employee.name}! I am your AI Career Assistant powered by Amazon Bedrock. How can I help you advance your career?`
              }
            ])
          }
        >
          Clear Chat History
        </button>
      </div>

      <div className="assistant-layout">
        <article className="panel chat-panel">
          <div className="chat-head">
            <div className="assistant-avatar">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3>Bedrock AI Career Assistant</h3>
              <p>
                <i className="online-dot" /> Connected to AWS Bedrock API Gateway
              </p>
            </div>
          </div>

          <div className="messages" style={{ minHeight: '340px', maxHeight: '480px', overflowY: 'auto', padding: '1rem' }}>
            {messages.map((msg, idx) => (
              <div className={`message ${msg.from}`} key={idx} style={{ marginBottom: '1rem' }}>
                <div className="message-avatar">
                  {msg.from === 'ai' ? (
                    <Sparkles size={14} className={msg.isLoading ? 'spin' : ''} />
                  ) : (
                    employee.name.split(' ').map((n) => n[0]).join('')
                  )}
                </div>
                <div className="message-bubble" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions */}
          <div className="suggestions" style={{ padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {suggestedQuestions.map((sq) => (
              <button
                key={sq}
                onClick={() => sendMessage(sq)}
                disabled={loading}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: '14px', background: 'rgba(1, 138, 190, 0.15)', border: '1px solid rgba(1, 138, 190, 0.3)', color: '#97CADB', cursor: 'pointer' }}
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI about skills, internal roles, skill gaps, or roadmaps..."
              disabled={loading}
            />
            <button className="button primary" type="submit" disabled={loading} aria-label="Send question">
              <Send size={16} />
            </button>
          </form>
        </article>

        {/* Sidebar info */}
        <aside className="assistant-aside">
          <div className="aside-icon">
            <Sparkles size={20} />
          </div>
          <h3>Personalized Career Advice</h3>
          <p>
            Grounded in your employee profile ({employee.name}), verified skills ({employee.skills.join(', ')}), and target role ({selectedRole.title}).
          </p>

          <div className="assistant-stat" style={{ marginTop: '1rem' }}>
            <b>{employee.skills.length}</b>
            <span>Verified Core Skills</span>
          </div>

          <div className="assistant-stat">
            <b>{selectedRole.title}</b>
            <span>Target Role Goal</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
