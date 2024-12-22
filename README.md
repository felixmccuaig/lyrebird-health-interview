# Lyrebird Health Interview - API

A Node.js/Express RESTful API demonstrating:

- **CRUD** operations for consultations, notes, and recordings.
- **Audio transcription** via OpenAI’s Whisper API.
- **Summaries** using OpenAI GPT (gpt-4).
- **Integration** with TypeORM entities and repositories.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Database Setup (Docker)](#database-setup-docker)
6. [Running the App](#running-the-app)
7. [Database Migrations](#database-migrations)
8. [Available Endpoints](#available-endpoints)
9. [Testing](#testing)
10. [Project Structure](#project-structure)
11. [License](#license)

---

## 1. Features

- **Consultations**: Create, retrieve, and manage consultation data.
- **Notes**: Create/update and retrieve notes associated with a consultation.
- **Recordings & Transcriptions**: Upload an audio file to a specific consultation and transcribe it using OpenAI.
- **Summary**: Generate a summary of doctor notes and audio transcriptions using GPT.
- **Error Handling**: Express middleware for error responses in JSON.
- **ORM**: TypeORM for data models and database migrations (SQL or via the `typeorm` CLI).
- **Testing**: Jest for unit and integration tests.

---

## 2. Prerequisites

- **Node.js** (v22.12.0 recommended as per `.nvmrc`).
- **npm** or **yarn** (npm v7+ recommended).
- **Docker** (if you want to run the PostgreSQL container via Docker Compose).
- **A running PostgreSQL database** if you don’t use the Docker approach.

---

## 3. Installation

1. **Clone** the repository:

   ```bash
   git clone https://github.com/felixmccuaig/lyrebird-health-interview.git
   cd lyrebird-health-interview
   ```

2. **Switch to Node v22.12.0** (if you use [nvm](https://github.com/nvm-sh/nvm)):

   ```bash
   nvm use
   # or manually: nvm install 22.12.0 && nvm use 22.12.0
   ```

3. **Navigate** into the `api` directory:

   ```bash
   cd api
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **(Optional) Build** the application if you wish to compile TypeScript:

   ```bash
   npm run build
   ```

> **Note**: You can run in development mode with TypeScript directly (`npm run dev`) without having to build every time.

---

## 4. Environment Variables

Create a `.env` file in the `api` directory (or your root) with the following variables:

```ini
# Example .env

# Node environment: development, test, or production
NODE_ENV=development

# OpenAI API key for transcription & GPT
OPENAI_API_KEY=your_openai_api_key_here

# Database credentials (replace placeholders if you won't use Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=lyrebird

# OPTIONAL: If using a different database type (e.g., MySQL), specify here:
DB_TYPE=postgres
```

> **Note**: If you are using Docker Compose (see below), the defaults above (user=postgres, password=password, DB=lyrebird) will match the container environment.

---

## 5. Database Setup (Docker)

The repository includes a `docker-compose.yml` at `docker-compose/docker-compose.yml` to quickly spin up a **PostgreSQL** database.

1. **Ensure Docker is running**.
2. **Navigate to** the `docker-compose` directory:

   ```bash
   cd ../docker-compose
   ```

3. **Start** the database:

   ```bash
   docker compose up -d
   ```

   - This launches a PostgreSQL 15 container on port `5432`.
   - Credentials: `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=password`, `POSTGRES_DB=lyrebird`.
   - A Docker volume named `postgres_data` will store the data.

4. Verify the container is running by checking logs or `docker ps`.

---

## 6. Running the App

**In the `api` directory**:

- **Development Mode** (using **ts-node** / **nodemon**):

  ```bash
  npm run dev
  ```

  By default, it should start on [http://localhost:3000](http://localhost:3000).

- **Production Mode**:

  1. **Build** the TypeScript:

     ```bash
     npm run build
     ```

  2. **Start**:

     ```bash
     npm run start
     ```

---

## 7. Database Migrations

A sample migration file is located at:

```
lyrebird-health-interview/
  database/
    migrations/
      18122024.sql
```

This file contains raw SQL for updating your PostgreSQL schema.

### Running the Migration

If you’re using the **Docker** container for Postgres:

1. Confirm Docker container is running (see [Database Setup](#database-setup-docker)).
2. You can manually execute the SQL script:

   ```bash
   # from lyrebird-health-interview directory
   psql -h localhost -U postgres -d lyrebird -f ./database/migrations/18122024.sql
   ```

   - Password is `password` (as set in the docker-compose).

> Alternatively, if you manage migrations via TypeORM CLI or a different tool, adapt these instructions accordingly.

---

## 8. Available Endpoints

Below is a quick reference of the main routes. More details in `api/src/routes`:

### Consultations

| Method | Endpoint                    | Description                            |
| -----: | :-------------------------- | :------------------------------------- |
|   POST | `/consultations`            | Create a new consultation              |
|    GET | `/consultations`            | Get all consultations                  |
|    GET | `/consultations/:id`        | Get a specific consultation by ID      |
|   POST | `/consultations/:id/upload` | Upload an audio file to a consultation |

### Notes

| Method | Endpoint                 | Description                                  |
| -----: | :----------------------- | :------------------------------------------- |
|    GET | `/notes/:consultationId` | Get the note for a given consultation        |
|   POST | `/notes/:consultationId` | Create or update the note for a consultation |

### Consultation Summary

| Method | Endpoint                                              | Description                       |
| -----: | :---------------------------------------------------- | :-------------------------------- |
|   POST | `/consultationSummary/:consultationId/generate-notes` | Generate summarized notes via GPT |

---

## 9. Testing

1. **Unit & Integration Tests**: In the `api` directory, run:

   ```bash
   npm test
   ```

   - This will execute Jest tests located under `api/src/__tests__`.
   - Use `npm run test:watch` for watch mode.

2. **Coverage**:

   ```bash
   npm run test:coverage
   ```

### Notes on Test Output

- You may see `console.error` logs in the test output when the code’s error path is triggered (e.g., mocking a failing API).
- To silence them, you can mock `console.error`. Otherwise, it’s normal to see these logs.

---

## 10. Project Structure

```
lyrebird-health-interview/
  ├─ api/
  │   ├─ src/
  │   │   ├─ __tests__/            # Tests for services, controllers, etc.
  │   │   ├─ config/               # Config files for Multer, OpenAI, etc.
  │   │   ├─ controllers/          # Express controllers
  │   │   ├─ entities/             # TypeORM entities
  │   │   ├─ middlewares/          # Express middlewares (error handling)
  │   │   ├─ repositories/         # Data access layers (TypeORM Repositories)
  │   │   ├─ routes/               # Express route definitions
  │   │   ├─ services/             # Business logic (NoteService, etc.)
  │   │   ├─ data-source.ts        # TypeORM data source config
  │   │   └─ server.ts             # Express server setup
  │   ├─ package.json
  │   └─ tsconfig.json
  ├─ database/
  │   └─ migrations/               # Raw SQL migration files
  ├─ docker-compose/
  │   └─ docker-compose.yml        # Docker Compose file for Postgres
  ├─ frontend/                     # NextJS frontend
  ├─ .nvmrc                        # Node version (22.12.0)
  ├─ turbo.json                    # (if using Turborepo)
  └─ README.md
```

---

## 11. License

This project is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for details (if provided).

---

**Thank you for using the Lyrebird Health Interview API!**  
If you have any questions or suggestions, feel free to open an issue or submit a pull request.
