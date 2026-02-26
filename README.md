# Real-Time Collaborative Task Board

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

<br />

A high-performance, full-stack Kanban application designed for real-time multi-user collaboration. Built with a robust modern tech stack to handle concurrent updates, data synchronization across multiple instances, and conflict resolution gracefully.

## ✨ Features

- **Real-Time Synchronization**: Instantaneous task updates across all connected clients via WebSockets (`Socket.IO`).
- **Distributed Architecture Ready**: Uses **Redis Pub/Sub** adapter for WebSockets to scale Node.js instances seamlessly.
- **Drag-and-Drop Interface**: Smooth, accessible drag-and-drop Kanban board built with React and `@dnd-kit`.
- **Conflict Resolution**: Optimistic concurrency control (OCC) using versioning on tasks stored in PostgreSQL.
- **Role-Based Access Control (RBAC)**: Secure Express REST API using JWT authentication and authorization.
- **Indexed Database Schema**: Efficient Prisma configuration with proper database indexing for performant queries.
- **Containerized**: Fully configured with `docker-compose` for local development, providing the database, Redis cache, backend, and frontend with a single command.

## 🏗 System Architecture

1. **Frontend**: React SPA communicating with backend via REST for operations and WebSocket for real-time sync.
2. **Backend**: Express API server establishing WebSocket rooms for specific boards.
3. **Cache / Message Broker**: Redis instance handling Socket.io message broadcasting across nodes.
4. **Database**: PostgreSQL storing users, boards, columns, and task states with relational integrity.

## 🚀 Getting Started

### Prerequisites

You need [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/soumyadipsarkar2/Real-Time-Collaborative-Task-Board.git
   cd Real-Time-Collaborative-Task-Board
   ```

2. **Start the containers**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend running at: `http://localhost:5173`
   - Backend API running at: `http://localhost:5000`

### Local Development (Without Docker)

If you prefer to run services manually to debug the codebase:

**1. Postgres and Redis**
Ensure you have local instances of PostgreSQL and Redis running.
Configure your `.env` in the `backend/` directory:
```env
DATABASE_URL=postgres://user:password@localhost:5432/taskboard
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecretjwtkey
```

**2. Backend**
```bash
cd backend
npm install
npx prisma db push
npm start
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```bash
├── backend
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── auth.ts         # JWT logic & RBAC middleware
│   │   ├── index.ts        # Entry point
│   │   ├── redis.ts        # Redis pub/sub integration
│   │   ├── routes.ts       # Express REST APIs
│   │   └── socket.ts       # WebSocket event handlers
│   ├── Dockerfile
│   └── package.json
├── frontend
│   ├── src/
│   │   ├── App.tsx         # Main interactive Kanban Kanban Component
│   │   ├── index.css       # Tailwind CSS V4 definitions
│   │   └── main.tsx        # React Root
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml      # Container orchestration
└── README.md
```

## 🔒 Security & Performance

- Passwords hashed using `bcryptjs`.
- Foreign key cascading deletes properly implemented in Prisma schema.
- Database indexes `@@index([boardId])` and `@@index([columnId])` ensure efficient data retrieval when loading boards.
- Strict Typescript definitions to mitigate run-time errors.

## 📄 License

This project is licensed under the MIT License.
