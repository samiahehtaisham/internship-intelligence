# Internship Intelligence

A full-stack web application that helps software engineering students analyze internship job descriptions, identify required skills, and track gaps against their existing skill set.

## Features

- **Job Description Analysis** — Extract and analyze skills mentioned in internship descriptions.
- **Skill Gap Identification** — Compare required skills against a student's current skills.
- **Skills Dashboard** — Review existing skills and identify areas for improvement.
- **Saved Analyses** — Save and retrieve previous job analyses.
- **Persistent Storage** — Store saved analyses in PostgreSQL.
- **Automated Tests** — Test skill-analysis logic and backend API behavior.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Maven

**Database**
- PostgreSQL

**Testing & Tools**
- JUnit
- MockMvc
- ESLint
- Git and GitHub

## Architecture

The application uses a React and TypeScript frontend that communicates with a Spring Boot REST API. The backend processes skill-analysis requests and uses PostgreSQL to persist saved analyses.

```text
React + TypeScript Frontend
          |
          | HTTP / REST API
          v
Spring Boot Backend
          |
          | Spring Data JPA
          v
      PostgreSQL
```

## Getting Started

### Prerequisites

- Node.js and npm
- Java 25
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/samiahehtaisham/internship-intelligence.git
cd internship-intelligence
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `internship_intelligence`.

Configure your database credentials using environment variables:

- `DB_USERNAME` — PostgreSQL username (defaults to `postgres`)
- `DB_PASSWORD` — PostgreSQL password

Do not commit real passwords or other secrets to GitHub.

### 3. Start the backend

Open a terminal in the `backend` directory and run:

```bash
.\mvnw.cmd spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### 4. Start the frontend

Open another terminal in the project root and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Running Tests

### Frontend tests

```bash
npm run test:run
```

### Backend tests

From the `backend` directory:

```bash
.\mvnw.cmd test
```

## Project Status

This project is being developed as a portfolio project to demonstrate full-stack software engineering, REST API development, database persistence, and automated testing.

## Author

**Samiah Ehtaisham**

- GitHub: [@samiahehtaisham](https://github.com/samiahehtaisham)
