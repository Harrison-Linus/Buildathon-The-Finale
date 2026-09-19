# CompanyOS HR Dashboard

CompanyOS is an AI-powered company intelligence platform. This HR module supports discovering skills, matching internal roles, analyzing gaps, creating career roadmaps, and asking a mock AI talent assistant questions.

## Run locally

```bash
npm install
npm run dev
```

The React dashboard runs at `http://localhost:3000` and the Express API runs at `http://localhost:5000`.

Run them separately with `npm start` and `npm run server` when preferred. Set `REACT_APP_API_BASE_URL` to point the frontend at another API host.

## Included workflows

- Overview analytics with Recharts skill, department, and gap visualizations
- Talent Discovery search, department filtering, employee profile modal, and transferable skills
- Role Matching with percentage score, matching skills, missing skills, and recommendation
- Skill Gap Analysis with learning actions and durations
- Career Roadmap with progress timeline
- AI Talent Assistant with suggested questions and mock service responses

## Structure

- `src/data/mockData.js`: frontend fallback data and local domain logic
- `src/services/api.js`: frontend REST service layer
- `src/components/common/`: reusable stat, badge, and loading primitives
- `src/App.js`: route shell and page-level workflow composition
- `server/server.js`: Express API entry point
- `server/data/mockData.js`: backend mock data and analysis functions

## API

`GET /api/health`, `/api/employees`, `/api/employees/:id`, `/api/roles`, `/api/skills`

`POST /api/analyze-skills`, `/api/match-role`, `/api/skill-gap`, `/api/career-roadmap`, `/api/career-chat`

The mock services intentionally keep the API boundary ready for a future DynamoDB repository and Amazon Bedrock-backed assistant.
