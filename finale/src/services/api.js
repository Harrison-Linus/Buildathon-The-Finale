const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error((await response.json()).error || 'Request failed');
  return response.json();
}

export const hrService = {
  getEmployees: () => request('/employees'), getRoles: () => request('/roles'), getSkills: () => request('/skills'),
  analyzeSkills: (employeeId) => request('/analyze-skills', { method: 'POST', body: JSON.stringify({ employeeId }) }),
  matchRole: (employeeId, roleId) => request('/match-role', { method: 'POST', body: JSON.stringify({ employeeId, roleId }) }),
  skillGap: (employeeId, roleId) => request('/skill-gap', { method: 'POST', body: JSON.stringify({ employeeId, roleId }) }),
  roadmap: (employeeId, roleId) => request('/career-roadmap', { method: 'POST', body: JSON.stringify({ employeeId, roleId }) }),
  chat: (message) => request('/career-chat', { method: 'POST', body: JSON.stringify({ message }) })
};

const AWS_API_BASE_URL = 'https://pqtforiaof.execute-api.us-east-1.amazonaws.com';

async function awsRequest(path, payload) {
  const response = await fetch(`${AWS_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Request failed');
    throw new Error(errorText || `API Error: ${response.status}`);
  }
  return response.json();
}

export function parseAIResponse(data) {
  if (!data) return null;
  if (typeof data === 'object') return data;
  if (typeof data === 'string') {
    let clean = data.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }
    try {
      return JSON.parse(clean);
    } catch (e) {
      return { rawText: clean };
    }
  }
  return { rawText: String(data) };
}

export const employeeService = {
  analyzeSkills: (employee) => awsRequest('/analyze-skills', employee),
  matchRole: (employee, role) => awsRequest('/match-role', { employee, role }),
  getSkillGap: (employee, role) => awsRequest('/skill-gap', { employee, role }),
  getCareerRoadmap: (employee, role) => awsRequest('/career-roadmap', { employee, role }),
  careerChat: (employee, question) => awsRequest('/career-chat', { employee, question })
};

