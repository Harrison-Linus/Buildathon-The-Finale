export const employees = [
  { id: 'EMP001', name: 'Arun Kumar', department: 'Engineering', currentRole: 'Software Developer', experience: 3, skills: ['Python', 'React', 'SQL', 'AWS'], transferableSkills: ['Problem Solving', 'System Thinking'], projects: ['Internal Analytics Platform'], certifications: ['AWS Cloud Practitioner'], potentialRoles: ['Cloud Engineer', 'Backend Developer'] },
  { id: 'EMP002', name: 'Maya Chen', department: 'Product', currentRole: 'Product Specialist', experience: 5, skills: ['SQL', 'Product Strategy', 'Figma', 'Data Analysis'], transferableSkills: ['Stakeholder Management', 'Systems Thinking'], projects: ['Customer Insights Hub'], certifications: ['CSPO'], potentialRoles: ['Product Analyst', 'Product Manager'] },
  { id: 'EMP003', name: 'Jon Bell', department: 'Engineering', currentRole: 'Frontend Developer', experience: 4, skills: ['JavaScript', 'React', 'TypeScript', 'Figma'], transferableSkills: ['User Empathy', 'Mentoring'], projects: ['Design System'], certifications: [], potentialRoles: ['Full Stack Developer', 'Product Engineer'] },
  { id: 'EMP004', name: 'Priya Shah', department: 'Finance', currentRole: 'Financial Analyst', experience: 6, skills: ['SQL', 'Excel', 'Python', 'Data Analysis'], transferableSkills: ['Strategic Thinking', 'Attention to Detail'], projects: ['Forecasting Model'], certifications: ['CFA Level 1'], potentialRoles: ['Data Analyst', 'Product Analyst'] },
  { id: 'EMP005', name: 'Leo Martinez', department: 'Design', currentRole: 'UX Designer', experience: 2, skills: ['Figma', 'User Research', 'Prototyping', 'React'], transferableSkills: ['Storytelling', 'Collaboration'], projects: ['Mobile Onboarding'], certifications: [], potentialRoles: ['Product Designer', 'Product Analyst'] },
  { id: 'EMP006', name: 'Nora Williams', department: 'Engineering', currentRole: 'QA Engineer', experience: 7, skills: ['Python', 'SQL', 'Docker', 'AWS'], transferableSkills: ['Risk Analysis', 'Process Design'], projects: ['Release Automation'], certifications: ['ISTQB'], potentialRoles: ['DevOps Engineer', 'Cloud Engineer'] },
  { id: 'EMP007', name: 'Sam Okafor', department: 'Marketing', currentRole: 'Growth Strategist', experience: 3, skills: ['Data Analysis', 'SQL', 'Content Strategy', 'Figma'], transferableSkills: ['Experimentation', 'Communication'], projects: ['Lifecycle Campaigns'], certifications: [], potentialRoles: ['Product Analyst', 'Product Manager'] },
  { id: 'EMP008', name: 'Elena Rossi', department: 'Engineering', currentRole: 'Platform Engineer', experience: 8, skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Python'], transferableSkills: ['Systems Thinking', 'Incident Leadership'], projects: ['Developer Platform'], certifications: ['AWS Solutions Architect'], potentialRoles: ['DevOps Engineer', 'Cloud Engineer'] }
];

export const roles = [
  { id: 'ROLE001', title: 'Cloud Engineer', department: 'Engineering', requiredSkills: ['Python', 'AWS', 'SQL', 'Docker', 'Linux'], description: 'Build reliable, observable cloud infrastructure.' },
  { id: 'ROLE002', title: 'Backend Developer', department: 'Engineering', requiredSkills: ['Python', 'SQL', 'Docker', 'REST APIs'], description: 'Design services that power our products.' },
  { id: 'ROLE003', title: 'Data Analyst', department: 'Product', requiredSkills: ['SQL', 'Python', 'Data Analysis', 'Statistics'], description: 'Turn business questions into decisions.' },
  { id: 'ROLE004', title: 'DevOps Engineer', department: 'Engineering', requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD'], description: 'Create a fast, safe path to production.' },
  { id: 'ROLE005', title: 'Product Analyst', department: 'Product', requiredSkills: ['SQL', 'Data Analysis', 'Product Strategy', 'Statistics'], description: 'Connect product behavior to outcomes.' }
];

export const skills = ['Python', 'JavaScript', 'React', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Linux', 'REST APIs', 'Data Analysis', 'Statistics', 'Figma', 'Product Strategy', 'CI/CD', 'System Design'];
export const learningResources = [
  { title: 'Docker Fundamentals', type: 'Course', duration: '2 weeks' },
  { title: 'AWS Networking Essentials', type: 'Course', duration: '3 weeks' },
  { title: 'Linux for Developers', type: 'Course', duration: '1 week' },
  { title: 'Cloud Architecture Project', type: 'Project', duration: '4 weeks' },
  { title: 'AWS Solutions Architect', type: 'Certification', duration: '8 weeks' }
];
export const skillGaps = [
  { skill: 'Docker', value: 72, priority: 'High' }, { skill: 'Cloud Networking', value: 58, priority: 'High' },
  { skill: 'Kubernetes', value: 46, priority: 'Medium' }, { skill: 'System Design', value: 39, priority: 'Medium' }, { skill: 'Data Engineering', value: 31, priority: 'Low' }
];

export function matchRole(employeeId, roleId) {
  const employee = employees.find(item => item.id === employeeId);
  const role = roles.find(item => item.id === roleId);
  if (!employee || !role) return null;
  const matchingSkills = role.requiredSkills.filter(skill => employee.skills.includes(skill));
  const missingSkills = role.requiredSkills.filter(skill => !employee.skills.includes(skill));
  const matchPercentage = Math.round((matchingSkills.length / role.requiredSkills.length) * 100);
  return { employeeId, roleId, matchPercentage, matchingSkills, missingSkills, experienceMatch: employee.experience >= 3 ? 'Good' : 'Developing', explanation: `${employee.name} has a strong foundation in ${matchingSkills.slice(0, 3).join(', ')}. Focused development in ${missingSkills.slice(0, 2).join(' and ') || 'the role context'} will improve readiness.`, recommendation: matchPercentage >= 80 ? 'Ready for internal consideration' : 'Suitable with targeted upskilling' };
}

export function skillGap(employeeId, roleId) {
  const employee = employees.find(item => item.id === employeeId);
  const role = roles.find(item => item.id === roleId);
  if (!employee || !role) return null;
  const match = matchRole(employeeId, roleId);
  return { employeeId, roleId, matchingSkills: match.matchingSkills, missingSkills: match.missingSkills.map((skill, index) => ({ skill, priority: index === 0 ? 'High' : 'Medium', currentLevel: 'Beginner', requiredLevel: 'Intermediate', recommendedAction: `Complete ${skill} fundamentals learning`, estimatedDuration: index === 0 ? '2 weeks' : '3 weeks' })) };
}

export function roadmap(employeeId, roleId) {
  const match = matchRole(employeeId, roleId);
  if (!match) return null;
  const actions = ['Learn Linux Fundamentals', 'Complete Docker Fundamentals', 'Learn AWS Networking', 'Complete a cloud-based project', 'Apply for the target internal role'];
  return { employeeId, roleId, progress: 20, steps: actions.map((title, index) => ({ id: index + 1, title, type: index === 4 ? 'Milestone' : index === 3 ? 'Project' : 'Course', duration: index === 3 ? '4 weeks' : index === 4 ? '1 week' : `${index + 1} weeks`, priority: index < 2 ? 'High' : 'Medium', status: index === 0 ? 'In Progress' : 'Not Started' })) };
}
