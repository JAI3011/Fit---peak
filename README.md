# Fit Peak — Web-Based Fitness Tracking Application

The **Web-Based Fit Peak** is a modern fitness tracking application designed to help users manage their workouts, monitor health progress, and maintain a healthy lifestyle using digital technology. The system combines fitness and technology to provide an interactive, user-friendly, and secure platform for fitness management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11 + FastAPI |
| **Database** | MongoDB 7 (via Motor async driver) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Frontend** | React.js 18 + React Router v6 |
| **Containerization** | Docker + Docker Compose |

## Features

- 🔐 **User Authentication** — Secure register / login with JWT tokens
- 🏋️ **Workout Tracking** — Create, view, update, and delete workout sessions
- 💪 **Exercise Library** — Manage exercises grouped by muscle group
- 🥗 **Diet / Nutrition Tracking** — Log meals with macro breakdowns (calories, protein, carbs, fat)
- 📈 **Progress Monitoring** — Record body measurements over time and visualise trends
- 📊 **Dashboard** — At-a-glance summary of recent activity and health metrics

## Project Structure

```
Fit---peak/
├── backend/              # Python FastAPI application
│   ├── app/
│   │   ├── main.py       # FastAPI entry point & CORS config
│   │   ├── config.py     # Environment-based settings (pydantic-settings)
│   │   ├── database.py   # Motor (async MongoDB) connection
│   │   ├── models/       # Pydantic v2 data models
│   │   ├── routers/      # API route handlers
│   │   └── utils/        # JWT & password utilities
│   ├── tests/            # pytest-asyncio test suite (29 tests)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/             # React.js application
│   ├── public/
│   ├── src/
│   │   ├── context/      # Auth context (JWT state management)
│   │   ├── services/     # Axios API client
│   │   ├── components/   # Navbar, StatCard, PrivateRoute
│   │   └── pages/        # Login, Register, Dashboard, Workouts,
│   │                     #   Exercises, Diet, Progress
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
└── docker-compose.yml    # Orchestrates MongoDB + backend + frontend
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) ≥ 24 and Docker Compose ≥ 2
- **or** Node.js ≥ 18 and Python ≥ 3.11 (for running without Docker)

### Run with Docker Compose (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/JAI3011/Fit---peak.git
cd Fit---peak

# 2. (Optional) Set a secure secret key
export SECRET_KEY="your-super-secret-random-string"

# 3. Start all services
docker compose up --build

# The app is now available at:
#   Frontend  → http://localhost:3000
#   Backend   → http://localhost:8000
#   API Docs  → http://localhost:8000/docs
```

### Run Locally (without Docker)

#### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment variables
cp .env.example .env

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env

# Start the React development server
npm start
```

Make sure MongoDB is running locally on the default port `27017`.

## API Endpoints

The interactive Swagger docs are available at **http://localhost:8000/docs**.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login (returns JWT) |
| `GET` | `/api/auth/me` | Get current user |
| `GET/PUT` | `/api/users/profile` | View / update profile |
| `GET/POST` | `/api/workouts` | List / create workouts |
| `GET/PUT/DELETE` | `/api/workouts/{id}` | Get / update / delete workout |
| `GET/POST` | `/api/exercises` | List / create exercises |
| `GET/PUT/DELETE` | `/api/exercises/{id}` | Get / update / delete exercise |
| `GET/POST` | `/api/diet` | List / create diet entries |
| `GET/PUT/DELETE` | `/api/diet/{id}` | Get / update / delete diet entry |
| `GET/POST` | `/api/progress` | List / create progress records |
| `GET` | `/api/progress/summary` | Latest progress summary |

## Running Backend Tests

```bash
cd backend
pip install -r requirements.txt
pytest -v
```

The test suite uses `mongomock-motor` so no real MongoDB instance is required.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | `fitpeak` | MongoDB database name |
| `SECRET_KEY` | *(required in prod)* | JWT signing secret |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiry duration |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8000` | Backend API base URL |
