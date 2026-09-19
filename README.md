# Buildathon-The-Finale
The project repo for The BIULDATHON FINALE


Yes. Since your GitHub `main` branch is now the final branch, the **root `README.md`** should be the main project documentation that judges/reviewers see first.

Below is a complete README you can paste into:

```text
D:\Buildathon_final\README.md
```

## Complete `README.md`

````markdown
# CompanyOS — AI-Powered Internal Talent Discovery & Career Mobility Platform

An AI-powered internal talent mobility platform that helps organizations understand employee skills, discover suitable internal opportunities, identify skill gaps, generate personalized career roadmaps, and provide an AI career assistant.

The platform combines a React-based employee/HR portal with Amazon API Gateway, AWS Lambda, and Amazon Bedrock-Mantle using Gemma 4 E2B.

---

## 🚀 Overview

Organizations often have employees with valuable skills that are not fully visible across teams. At the same time, employees may not know which internal roles they can move into or what skills they need to develop.

CompanyOS addresses this problem by connecting:

- Employee skills
- Projects and experience
- Internal role requirements
- AI-powered skill analysis
- Role matching
- Skill-gap identification
- Personalized career roadmaps
- AI career assistance

### Core idea

```text
Employee Profile
       ↓
AI Skill Discovery
       ↓
Internal Role Matching
       ↓
Skill Gap Analysis
       ↓
Career Roadmap
       ↓
AI Career Assistant
````

---

# ✨ Key Features

## 1. AI Skill Discovery

Analyzes an employee profile and identifies:

* Explicit skills
* Transferable skills
* Strengths
* Potential future roles
* Skill gaps
* Recommended learning
* Career roadmap

---

## 2. Internal Role Matching

Compares an employee's skills against the requirements of an internal role.

The system calculates a deterministic skill-match percentage and provides:

* Matching skills
* Missing skills
* Transferable skills
* AI-generated explanation

Example:

```text
Employee Skills:
Python, SQL, React, AWS

Target Role:
Cloud Engineer

Matching Skills:
Python
AWS

Skill Gaps:
Docker
Linux
Networking
```

---

## 3. Skill Gap Analysis

Identifies the skills an employee needs to develop for a target internal role.

The system provides:

* Missing skills
* Priority areas
* Recommended learning
* Recommended projects
* Suggested timeline

---

## 4. Career Roadmap

Generates a personalized roadmap based on the employee profile and desired role.

The roadmap includes:

* Current position
* Short-term goals
* Mid-term goals
* Long-term goals
* Recommended learning
* Recommended projects
* Milestones

---

## 5. AI Career Assistant

An interactive AI assistant that allows employees to ask career-related questions.

Example:

> What skills should I learn to move toward a Cloud Engineer role?

The assistant uses the employee profile when generating its response.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │ Employee + HR Portal│
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS / JSON
                                    ▼
                         ┌─────────────────────┐
                         │   Amazon API        │
                         │      Gateway        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    AWS Lambda       │
                         │ talent-discovery-api│
                         └──────────┬──────────┘
                                    │
                                    │ API Request
                                    ▼
                         ┌─────────────────────┐
                         │ Amazon Bedrock-     │
                         │       Mantle        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Gemma 4 E2B      │
                         │ google.gemma-4-e2b  │
                         └─────────────────────┘
```

---

# ☁️ AWS Architecture

### AWS Services Used

| Service               | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| Amazon API Gateway    | Exposes HTTP API endpoints to the frontend              |
| AWS Lambda            | Runs the backend business logic                         |
| Amazon Bedrock-Mantle | Provides model access through the OpenAI-compatible API |
| Gemma 4 E2B           | Generates AI-based career analysis and recommendations  |
| Amazon CloudWatch     | Lambda execution logs and monitoring                    |

### AWS Region

```text
us-east-1
```

### Lambda Function

```text
talent-discovery-api
```

### Lambda Configuration

```text
Runtime: Python 3.13
Memory: 512 MB
Timeout: 1 minute
```

### Model

```text
google.gemma-4-e2b
```

---

# 🔌 API Documentation

## Base URL

```text
https://pqtforiaof.execute-api.us-east-1.amazonaws.com
```

All endpoints use:

```text
POST
Content-Type: application/json
```

---

## 1. Analyze Skills

### Endpoint

```http
POST /analyze-skills
```

### Full URL

```text
https://pqtforiaof.execute-api.us-east-1.amazonaws.com/analyze-skills
```

### Request

```json
{
  "name": "Demo Employee",
  "current_role": "Software Developer",
  "experience": "2 years",
  "skills": [
    "Python",
    "SQL",
    "React",
    "AWS"
  ],
  "projects": [
    "Serverless Application"
  ],
  "certifications": [
    "AWS Cloud Practitioner"
  ]
}
```

### Purpose

Generates an AI-based employee skill profile containing:

```text
explicit_skills
transferable_skills
strengths
potential_future_roles
skill_gaps
recommended_learning
career_roadmap
```

---

# 2. Match Role

### Endpoint

```http
POST /match-role
```

### Full URL

```text
https://pqtforiaof.execute-api.us-east-1.amazonaws.com/match-role
```

### Request

```json
{
  "employee": {
    "id": "EMP001",
    "name": "Demo Employee",
    "current_role": "Software Developer",
    "skills": [
      "Python",
      "SQL",
      "React",
      "AWS"
    ],
    "projects": [
      "Serverless Application"
    ]
  },
  "role": {
    "id": "ROLE001",
    "title": "Cloud Engineer",
    "required_skills": [
      "AWS",
      "Python",
      "Docker",
      "Linux",
      "Networking"
    ]
  }
}
```

### Response structure

```json
{
  "success": true,
  "data": {
    "employee_id": "EMP001",
    "role_id": "ROLE001",
    "role_title": "Cloud Engineer",
    "match_percentage": 40,
    "matching_skills": [
      "aws",
      "python"
    ],
    "skill_gaps": [
      "docker",
      "linux",
      "networking"
    ],
    "transferable_skills": [],
    "explanation": "..."
  }
}
```

---

# 3. Skill Gap

### Endpoint

```http
POST /skill-gap
```

### Full URL

```text
https://pqtforiaof.execute-api.us-east-1.amazonaws.com/skill-gap
```

### Request

```json
{
  "employee": {
    "id": "EMP001",
    "name": "Demo Employee",
    "current_role": "Software Developer",
    "skills": [
      "Python",
      "SQL",
      "React",
      "AWS"
    ]
  },
  "role": {
    "id": "ROLE001",
    "title": "Cloud Engineer",
    "required_skills": [
      "AWS",
      "Python",
      "Docker",
      "Linux",
      "Networking"
    ]
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "target_role": "Cloud Engineer",
    "missing_skills": [
      "Docker",
      "Linux",
      "Networking"
    ],
    "ai_learning_plan": "..."
  }
}
```

---

# 4. Career Roadmap

### Endpoint

```http
POST /career-roadmap
```

### Full URL

```text
https://pqtforiaof.execute-api.us-east-1.amazonaws.com/career-roadmap
```

### Request

```json
{
  "employee": {
    "name": "Demo Employee",
    "current_role": "Software Developer",
    "experience": "2 years",
    "skills": [
      "Python",
      "SQL",
      "React",
      "AWS"
    ],
    "projects": [
      "Serverless Application"
    ],
    "certifications": [
      "AWS Cloud Practitioner"
    ]
  },
  "role": {
    "title": "Cloud Engineer",
    "required_skills": [
      "AWS",
      "Python",
      "Docker",
      "Linux",
      "Networking"
    ]
  }
}
```

### Generated roadmap includes

```text
Current Position
Short-Term Goals
Mid-Term Goals
Long-Term Goals
Recommended Learning
Recommended Projects
Milestones
```

---

# 5. AI Career Chat

### Endpoint

```http
POST /career-chat
```

### Full URL

```text
https://pqtforiaof.execute-api.us-east-1.amazonaws.com/career-chat
```

### Request

```json
{
  "employee": {
    "name": "Demo Employee",
    "current_role": "Software Developer",
    "skills": [
      "Python",
      "SQL",
      "React",
      "AWS"
    ],
    "projects": [
      "Serverless Application"
    ]
  },
  "question": "What should I learn to move toward a Cloud Engineer role?"
}
```

### Response

```json
{
  "success": true,
  "data": "AI-generated career guidance..."
}
```

---

# 🖥️ Frontend

The frontend is built using React.

### Employee Portal Flow

```text
Dashboard
   ↓
Employee Profile
   ↓
AI Skills
   ↓
Internal Opportunities
   ↓
Role Match
   ↓
Skill Gap
   ↓
Career Roadmap
   ↓
AI Career Assistant
```

### HR Portal

The application also contains an HR portal for viewing and working with employee and role information.

---

# 🛠️ Technology Stack

## Frontend

* React
* React Router
* JavaScript / JSX
* CSS
* React Testing Library
* Jest

## Backend

* Python
* AWS Lambda
* Amazon API Gateway
* Amazon Bedrock-Mantle
* Gemma 4 E2B

## Development Tools

* Node.js
* npm
* Git
* GitHub

---

# 📁 Project Structure

```text
Buildathon-The-Finale/
│
├── backend/
│   ├── lambda_function.py
│   ├── local_test.py
│   └── requirements.txt
│
├── finale/
│   ├── public/
│   ├── server/
│   │   ├── data/
│   │   │   └── mockData.js
│   │   └── server.js
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── employee/
│   │   ├── context/
│   │   ├── data/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── package.json
└── package-lock.json
```

---

# ⚙️ Local Setup

## Prerequisites

Install:

* Node.js
* npm
* Python 3.13
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/Harrison-Linus/Buildathon-The-Finale.git
cd Buildathon-The-Finale
```

---

## 2. Frontend setup

```bash
cd finale
npm install
npm start
```

The development server normally runs at:

```text
http://localhost:3000
```

---

# 🧪 Testing

## Frontend build

```bash
cd finale
npm run build
```

The optimized production build was successfully generated during final verification.

## Frontend tests

```bash
npm test -- --watchAll=false
```

Current verified result:

```text
Test Suites: 1 passed
Tests:       2 passed
```

---

# 🔐 Environment Variables

The backend uses environment variables for the Bedrock-Mantle configuration.

Required variables:

```text
OPENAI_API_KEY
OPENAI_BASE_URL
BEDROCK_MODEL
```

Example:

```env
OPENAI_API_KEY=YOUR_BEDROCK_API_KEY
OPENAI_BASE_URL=https://bedrock-mantle.us-east-1.api.aws/openai/v1
BEDROCK_MODEL=google.gemma-4-e2b
```

### Security

Never commit `.env` files or API keys to GitHub.

The project `.gitignore` includes:

```gitignore
.env
__pycache__/
*.pyc
node_modules/
```

For a production deployment, sensitive credentials should be managed using a dedicated secrets-management approach rather than committed to source code.

---

# 🌐 Frontend API Integration

The React frontend uses the deployed AWS API Gateway endpoint:

```javascript
const AWS_API_BASE_URL =
  'https://pqtforiaof.execute-api.us-east-1.amazonaws.com';
```

The frontend calls:

```text
/analyze-skills
/match-role
/skill-gap
/career-roadmap
/career-chat
```

No AWS credentials or Bedrock API keys are required in the browser.

---

# 📊 Example Use Case

### Employee


Role:
Software Developer

Skills:
Python
SQL
React
AWS

Experience:
2 years

### Target role


Cloud Engineer

Required Skills:
AWS
Python
Docker
Linux
Networking


### System analysis


Matching Skills:
AWS
Python

Skill Gaps:
Docker
Linux
Networking


The platform then generates:


✔ Skill analysis
✔ Internal role match
✔ Skill-gap analysis
✔ Learning recommendations
✔ Career roadmap
✔ AI career guidance



# 🔄 End-to-End Request Flow


1. Employee interacts with React UI
             ↓
2. Frontend sends HTTPS POST request
             ↓
3. Amazon API Gateway receives request
             ↓
4. API Gateway invokes AWS Lambda
             ↓
5. Lambda processes employee/role information
             ↓
6. Lambda sends prompt to Bedrock-Mantle
             ↓
7. Gemma 4 E2B generates AI analysis
             ↓
8. Lambda returns the response
             ↓
9. API Gateway returns JSON to frontend
             ↓
10. React renders the result




# ✅ Verification Status

The final integrated application was verified with:


Frontend pages                         ✅
AI Career Assistant                    ✅
AI Skill Analysis                      ✅
Internal Role Matching                 ✅
Skill Gap Analysis                     ✅
Career Roadmap                         ✅

AWS Lambda                             ✅
Amazon API Gateway                     ✅
Bedrock-Mantle                         ✅
Gemma 4 E2B                            ✅
CORS                                   ✅

npm run build                          ✅
npm test -- --watchAll=false           ✅
5 AWS API endpoints                    ✅




# 🚀 Future Enhancements

Potential future improvements include:

* Persistent employee and role storage with Amazon DynamoDB
* Role discovery across multiple internal openings
* Learning-resource recommendations from a centralized catalog
* HR analytics and skill heatmaps
* Authentication and role-based access control
* Secure secrets management
* Improved AI response validation and structured JSON handling
* Production monitoring and alerting
* Fine-grained API security
* Personalized learning progress tracking



# 🔮 Future Architecture


                    ┌───────────────────┐
                    │   React Frontend  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   API Gateway     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   AWS Lambda      │
                    └──────┬───────┬────┘
                           │       │
                           │       ▼
                           │  ┌──────────────┐
                           │  │   DynamoDB   │
                           │  └──────────────┘
                           │
                           ▼
                  ┌──────────────────────┐
                  │ Bedrock-Mantle       │
                  │ Gemma 4 E2B          │
                  └──────────────────────┘




# 🏆 Project Highlights

* End-to-end serverless AI architecture
* React employee and HR portals
* Five AI-powered backend capabilities
* Real AWS API Gateway + Lambda integration
* Amazon Bedrock-Mantle model integration
* Gemma 4 E2B powered career analysis
* Role matching with deterministic skill comparison
* Personalized career development recommendations
* Browser-accessible API with CORS enabled
* Production build successfully generated
* Automated frontend tests passing

---

# 📌 Repository

GitHub:


https://github.com/Harrison-Linus/Buildathon-The-Finale


Primary branch:


main




# 👥 Team

Buildathon project developed as a collaborative team project.

Frontend:

* Employee Portal
* HR Portal
* UI and user flows
* API integration

Backend / Cloud:

* AWS Lambda
* Amazon API Gateway
* Amazon Bedrock-Mantle
* Gemma 4 E2B
* AI API implementation
* Cloud integration and testing

---

# 📜 License

This project was developed as a buildathon project for demonstration and evaluation purposes.

<img width="1600" height="735" alt="WhatsApp Image 2026-09-19 at 2 03 30 PM" src="https://github.com/user-attachments/assets/d0a6234f-df07-4178-b0d3-4e2902e0e552" />

<img width="1600" height="685" alt="WhatsApp Image 2026-09-19 at 2 03 31 PM" src="https://github.com/user-attachments/assets/d5dc74d6-9d28-47f4-a2bb-f75294ade1db" />

<img width="1600" height="694" alt="WhatsApp Image 2026-09-19 at 2 03 31 PM (1)" src="https://github.com/user-attachments/assets/b14288f8-d9ad-4c9c-a9e8-c4f7c5c11d07" />




![Uploading WhatsApp Image 2026-09-19 at 2.03.31 PM (2).jpeg…]()
