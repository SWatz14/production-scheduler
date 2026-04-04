# Production Scheduling System

A real-time production scheduling system for manufacturing companies.
This is built to replace whiteboards and spreadsheets with a live digital platform.

# Planner screenshots

# what it does

Manufacturing companies struggle to schedule jobs across machines without expensive
ERP software. This system gives small manufacturers:

- **Real-time Gantt chart** — visual schedule across all machines with color-coded job status
- **Automated scheduling** — EDD and SPT algorithms auto-slot jobs when created
- **Live job management** — create, update, and track work orders from a single dashboard
- **OTIF tracking** — On-Time-In-Full rate calculated automatically
- **At-risk detection** — overdue jobs highlighted instantly in red


## 🏭 Built For

Small CNC shops, job shops, and manufacturers currently scheduling on whiteboards or Excel — companies that can't afford SAP but need real scheduling software.

## 🛠 Tech Stack

- **Frontend:** React + TailwindCSS
- **Backend:** Java / Spring Boot
- **Scheduling Engine:** Python / FastAPI
- **Database:** PostgreSQL
- **Cache:** Redis
- **Infrastructure:** Docker Compose

## ⚙️ Getting Started

**1. Start the database and cache**
```bash
docker-compose up postgres redis -d
```

**2. Start the Spring Boot backend**
```bash
cd backend
mvn spring-boot:run
```

**3. Start the Python scheduling engine**
```bash
cd scheduler
.venv\Scripts\activate  # Windows
python main.py
```

**4. Start the React frontend**
```bash
cd frontend
npm start
```

Open **http://localhost:3000**
production-scheduler/
├── backend/          # Spring Boot REST API (Java)
├── scheduler/        # FastAPI scheduling engine (Python)
├── frontend/         # React dashboard
├── docs/             # Screenshots, architecture diagrams
└── docker-compose.yml

## 🔌 API Endpoints

### Machines
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/machines | Get all machines |
| POST | /api/machines | Create machine |
| PUT | /api/machines/{id} | Update machine |
| DELETE | /api/machines/{id} | Delete machine |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Create job |
| PUT | /api/jobs/{id} | Update job |
| DELETE | /api/jobs/{id} | Delete job |
| GET | /api/jobs/status/{status} | Filter by status |

### Scheduling Engine
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/schedule | Generate schedule |
| GET | /api/schedule/algorithms | List algorithms |

## 🧠 Why I Built This

I have a background in both mechanical engineering and software development — I've worked on CNC machines, quality assurance, and manufacturing processes. Most scheduling software is either too expensive for small shops or too generic to understand manufacturing constraints.

This project combines my manufacturing domain knowledge with full-stack engineering to build something that solves a real problem I've seen firsthand on the shop floor.



## 📄 License
MIT




