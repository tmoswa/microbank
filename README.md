# Microbank: A Full-Stack Microservice Banking Platform

A banking system with Client and Banking Services, built with Spring Boot, ReactJS, and deployed on AWS Free Tier.

## Tech Stack
- Backend: Java 21, Spring Boot 3.3.5
- Frontend: ReactJS 18, Tailwind CSS
- Database: PostgreSQL (AWS RDS Free Tier)
- Infrastructure: Docker, Terraform, GitHub Actions
- Code Quality: SonarQube
- API Docs: Swagger/OpenAPI

## Setup Instructions
1. Clone the repo: `git clone <repo-url>`
2. Install Java 21, Node.js 20, Docker, and Maven.
3. Run `docker-compose up` for local services.
4. Access frontend at `http://localhost:3000`.

## Assumptions
- JWT for authentication.
- PostgreSQL for data persistence.
- Event-driven blacklisting via RabbitMQ.