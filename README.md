
# Microbank: Enterprise-Grade Microservice Banking Platform

Microbank is a modular banking system designed using microservices, clean architecture, and Spring Cloud. It supports client onboarding, secure JWT-based authentication, transaction handling, and real-time blacklist enforcement with RabbitMQ and Eureka-based service discovery.

---

## System Architecture

The platform is divided into the following services:

- **Client Service** *(Spring Boot 3.5.3)*  
  Handles registration, JWT authentication, user profile management, and client blacklisting.

- **Banking Service** *(Spring Boot 3.5.3)*  
  Manages bank accounts, deposits, withdrawals, transaction history, and blacklisted client handling.

- **Eureka Discovery Server** *(Spring Cloud 2025.0.0)*  
  Enables dynamic service registration and lookup for Feign clients.

- **Nginx API Gateway** *(Reverse Proxy)*  
  Handles routing, load balancing, and rate-limiting for frontend and APIs.

  - **Frontend** *(ReactJS + Tailwind CSS)*  
    Handles the UI.

---

## Features

### Authentication & Authorization

- JWT-based login
- Stateless security with Spring Security
- Role-based admin privileges
- CORS configured for React Frontend
- Secure endpoint-level access

### Banking Service

- Deposit & withdrawal APIs
- Overdraft protection
- Transaction recording with timestamps
- Swagger-documented endpoints

### Client Service

- User registration & login
- Admin can blacklist clients
- Real-time blacklist sync using RabbitMQ
- BankingService rejects operations from blacklisted users

## Frontend - UI

Built using **React + Tailwind CSS**.

- **Register/Login** pages with validations
- **Dashboard** to view balance and transactions
- **Deposit/Withdraw** interface
- Admin-only **Client Management** page to toggle blacklist status
- Inline error feedback for blacklisted or unauthorized actions

### Microservice Integration

- OpenFeign clients for service-to-service communication
- Eureka Service Discovery
- Spring Cloud LoadBalancer fallback support
- Request propagation with Feign interceptors

### Performance Enhancements

- In-memory caching (`@Cacheable`) on expensive Feign calls
- Retry logic for Feign clients (`@EnableRetry`)
- Graceful fallback when services are unavailable
- Blacklist logic extracted into `BlacklistService`

---

## API Documentation

Auto-generated using SpringDoc and Swagger UI:

| Service         | Port | Swagger URL                          |
| Client Service  | 8088 | `http://localhost:8088/swagger-ui.html` |
| Banking Service | 8089 | `http://localhost:8089/swagger-ui.html` |
| Eureka Server   | 8761 | `http://localhost:8761`             |

---

## Technologies

- Spring Boot 3.5.3
- Spring Security, Spring Data JPA, Spring Cloud
- RabbitMQ (message broker for async blacklist)
- PostgreSQL & H2 for persistence
- Eureka Server (for discovery)
- OpenFeign (for inter-service REST)
- Docker & Docker Compose
- Nginx (for reverse proxy and rate-limiting)
- React + Tailwind (frontend)

---

## Docker & DevOps

> All services are containerized and managed via Docker Compose

### Services

| Container          | Description                       | Port |
| `client-service`   | Handles users & blacklist         | 8088 |
| `banking-service`  | Handles accounts & transactions   | 8089 |
| `frontend`         | React client app                  | 5173 |
| `postgres`         | PostgreSQL DB                     | 5432 |
| `rabbitmq`         | Message broker                    | 5672 (AMQP), 15672 (Mgmt) |
| `eureka-server`    | Service registry                  | 8761 |
| `nginx`            | Reverse proxy                     | 8090 |

---

## Deployment

### Requirements

- Docker & Docker Compose
- Ubuntu 22 or AWS EC2 t2.medium+
- Nginx Reverse Proxy (configured with rate limiting)

### Run Locally

```bash
git clone https://github.com/tmoswa/microbank.git
cd microbank
cd services/eureka-server
mvn clean package
cd ../../
docker-compose up --build
```

Access the app:
- React UI: `http://localhost:5173`
- Swagger Docs: `http://localhost:8088/swagger-ui.html`, `:8089/swagger-ui.html`
- RabbitMQ: `http://localhost:15672` (user/pass: guest/guest)
- Eureka: `http://localhost:8761`

---

## 👤 Admin Credentials

| Email              | Password  |
| admin@microbank.com | admin123  |

---

## 🔐 Security Features

- JWT token validation across services
- Stateless sessions using Spring Security
- Blacklist enforcement through RabbitMQ
- Rate-limiting enabled on API gateway
- Input validation with Bean Validation annotations
- Global exception handler with custom response codes

---

## Maintainer

**Timothy Moswa**  
Email: `timothymoswa@gmail.com`  
GitHub: [github.com/tmoswa](https://github.com/tmoswa)

---

> Built with Spring Boot, Docker, and by a passionate Java backend developer!
