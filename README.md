# Internship Intelligence

A full-stack web application that analyzes software engineering internship job descriptions, identifies technical skills, and compares them against a student's existing skill profile.

The goal is to help students understand job requirements, identify skill gaps, and make more informed decisions about what to learn next.

## Features

- **Job Description Analysis** — Extracts supported technical skills from pasted job descriptions.
- **Evidence-Backed Results** — Displays excerpts from the job description to show where detected skills appear.
- **Skill Gap Analysis** — Compares detected requirements against a student's skill profile to identify matched and missing skills.
- **Skill Coverage Score** — Calculates the percentage of detected job skills that match the student's profile.
- **Saved Analyses** — Stores analysis history in PostgreSQL so previous results can be revisited.
- **Backend API** — Uses a Spring Boot REST API to process job descriptions and return structured analysis results.
- **Automated Tests** — Includes frontend and backend tests to help verify application behaviour.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| Testing | Frontend test suite, JUnit |
| Tools | Git, GitHub, Maven, npm |

## How It Works

1. Paste a software engineering internship job description.
2. The backend identifies technical skills supported by its skill dictionary.
3. The application displays the detected skills and supporting text excerpts.
4. Detected skills are compared with the student's saved skill profile.
5. The application calculates skill coverage and highlights potential gaps.
6. The analysis is saved so it can be viewed again later.

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Java Development Kit compatible with the project's Spring Boot configuration
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/samiahehtaisham/internship-intelligence.git
cd internship-intelligence
```

### 2. Configure the Database

Create a PostgreSQL database named:

```sql
CREATE DATABASE internship_intelligence;
```

Configure the database connection in `backend/src/main/resources/application.properties`.

The application uses the following environment variables for database credentials:

- `DB_USERNAME` — PostgreSQL username; defaults to `postgres`.
- `DB_PASSWORD` — PostgreSQL password; must be configured before starting the backend.

Do not commit database passwords or other secrets to GitHub.

### 3. Start the Backend

Open a terminal in the `backend` directory:

```bash
cd backend
```

Set `DB_PASSWORD` in your environment, then run:

```bash
.\mvnw.cmd spring-boot:run
```

The backend runs on port `8080` by default.

### 4. Start the Frontend

Open another terminal in the project root:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Running Tests

### Frontend

Run these commands from the project root:

```bash
npm run test:run
npm run lint
npm run build
```

### Backend

Run this command from the `backend` directory:

```bash
.\mvnw.cmd test
```

Ensure the required database environment variables are configured if the tests need database access.

## Current Scope and Limitations

- Skill detection is based on a predefined dictionary of supported technical skills and their aliases.
- Evidence excerpts show matching text; they do not independently verify a candidate's proficiency.
- Skill coverage measures overlap with detected skills. It is not a prediction of interview success or hiring probability.
- Results depend on the wording of the job description and the skills supported by the analyzer.

## Future Improvements

- Distinguish mandatory skills from preferred or optional skills.
- Improve context-aware skill detection and reduce false positives.
- Expand skill coverage across software engineering roles and technologies.
- Develop more actionable, personalized learning recommendations.

## Author

**Samiah Ehtaisham**

[GitHub Repository](https://github.com/samiahehtaisham/internship-intelligence)

