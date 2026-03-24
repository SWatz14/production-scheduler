# Production Scheduling System

A real-time production scheduling system for manufacturing companies.

## Tech Stack
- **Frontend:** React + TailwindCSS
- **Backend:** Java / Spring Boot
- **Scheduling Engine:** Python / FastAPI
- **Database:** PostgreSQL
- **Cache:** Redis
- **Deploy:** Docker + Railway

## Project Structure
production-scheduler/
├── backend/       # Spring Boot API
├── scheduler/     # Python FastAPI scheduling engine
├── frontend/      # React app
├── docs/          # Wireframes, architecture diagrams, spec
└── docker-compose.yml

## Getting Started
```bash
docker-compose up
```

## Screens
1. Planner Dashboard — Gantt chart + job scheduling
2. Floor Dashboard — Live machine status
3. Operator Queue — Job cards per machine
4. KPI Dashboard — OTIF, utilization, throughput
