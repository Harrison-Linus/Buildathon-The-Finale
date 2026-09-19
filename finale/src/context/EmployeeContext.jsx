import React, { createContext, useContext, useState } from 'react';

const defaultEmployee = {
  id: "EMP001",
  name: "Keerthivasan M",
  current_role: "Software Developer",
  department: "Engineering",
  experience: "2 years",
  skills: ["Python", "SQL", "React", "AWS"],
  projects: [
    "Serverless Order Processing System",
    "Resume Screening System"
  ],
  certifications: [
    "AWS Cloud Practitioner"
  ]
};

const defaultRoles = [
  {
    id: "ROLE001",
    title: "Cloud Engineer",
    department: "Cloud & Infrastructure",
    required_skills: ["AWS", "Python", "Docker", "Linux", "Networking"],
    description: "Build reliable, scalable cloud infrastructure and serverless services."
  },
  {
    id: "ROLE002",
    title: "Backend Developer",
    department: "Engineering",
    required_skills: ["Python", "SQL", "Docker", "REST APIs", "System Design"],
    description: "Design performant microservices and data pipelines."
  },
  {
    id: "ROLE003",
    title: "DevOps Engineer",
    department: "Engineering",
    required_skills: ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD"],
    description: "Automate build pipelines and maintain containerized clusters."
  },
  {
    id: "ROLE004",
    title: "Data Analyst",
    department: "Product & Analytics",
    required_skills: ["SQL", "Python", "Data Visualization", "Statistics"],
    description: "Extract business insights and build executive dashboards."
  },
  {
    id: "ROLE005",
    title: "ML Engineer",
    department: "AI Lab",
    required_skills: ["Python", "PyTorch", "SQL", "AWS", "Docker"],
    description: "Deploy machine learning models and LLM applications to production."
  },
  {
    id: "ROLE006",
    title: "Product Engineer",
    department: "Product",
    required_skills: ["React", "JavaScript", "Python", "UX Design"],
    description: "Bridge customer experience and high-quality frontend code."
  }
];

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employee, setEmployee] = useState(defaultEmployee);
  const [selectedRole, setSelectedRole] = useState(defaultRoles[0]);
  const [roles] = useState(defaultRoles);
  const [aiSkillAnalysis, setAiSkillAnalysis] = useState(null);

  const updateEmployee = (updatedFields) => {
    setEmployee((prev) => ({ ...prev, ...updatedFields }));
  };

  const selectRoleById = (roleId) => {
    const found = roles.find((r) => r.id === roleId || r.title.toLowerCase() === roleId.toLowerCase());
    if (found) {
      setSelectedRole(found);
      return found;
    }
    return selectedRole;
  };

  return (
    <EmployeeContext.Provider
      value={{
        employee,
        setEmployee,
        updateEmployee,
        selectedRole,
        setSelectedRole,
        selectRoleById,
        roles,
        aiSkillAnalysis,
        setAiSkillAnalysis
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}
