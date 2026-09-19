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
