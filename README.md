Microbank: A Full-Stack Microservice Banking Platform

Microbank is a simplified banking system built using a microservices architecture. It features two core backend services and a modern web-based frontend for both clients and administrators.

---

## Overview

The system is divided into:

- **Client Service**: Handles registration, authentication, user profile management, and blacklisting.
- **Banking Service**: Manages bank accounts, deposits, withdrawals, and transaction history.

The platform includes:

- A **Client Dashboard** for performing banking actions.
- An **Admin Panel** for managing users and controlling blacklist access.

---

## Features

### Client Service
- Register with email, name, and password
- JWT-based login and authentication
- Fetch current profile details
- Admins can toggle a client's blacklist status
- Automatically prevent blacklisted clients from accessing banking features

### Banking Service
- Secure deposit and withdrawal endpoints
- Prevent overdrafts
- Record every transaction
- Reject all actions from blacklisted clients

---

## Frontend

Built using **React + Tailwind CSS**.

- **Register/Login** pages with validations
- **Dashboard** to view balance and transactions
- **Deposit/Withdraw** interface
- Admin-only **Client Management** page to toggle blacklist status
- Inline error feedback for blacklisted or unauthorized actions

---

## Docker & DevOps

- Dockerized both services and the frontend
- Docker Compose to orchestrate services, database (PostgreSQL), RabbitMQ, and Nginx
- Uses RabbitMQ to sync blacklist status asynchronously
- Configured Nginx as an API gateway with optional rate limiting (currently disabled)
- GitHub Actions pipeline to deploy to AWS EC2

---

## Deployment

The project is deployable to AWS Free Tier using:

- Ubuntu 22 EC2 instance
- Docker & Docker Compose
- Nginx reverse proxy (port 8090)
- PostgreSQL and RabbitMQ containers managed via Docker Compose

---

## Security

- Only authenticated users can access protected resources
- JWT tokens validated across services
- Admin-only access to blacklist clients
- Service-to-service communication avoids Feign and uses RabbitMQ for async updates
- Sensitive endpoints (i.e. transactions) are rate-limit ready


---

## API Documentation

Swagger UI is available for both services:

- **Client Service**: `/swagger-ui.html` at port `8088`
- **Banking Service**: `/swagger-ui.html` at port `8089`

---

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tmoswa/microbank.git
   cd microbank

2. **Build and Run with Docker Compose**
   ```bash
   docker-compose up --build

3. **Access the App**

Once all containers are running, access the platform via:

- **Frontend (React UI)**:  
  [http://localhost](http://localhost:5173)

- **API Gateway (Nginx)** :  
  [http://localhost:8090](http://localhost:8090)

- **Client Service Swagger Docs**:  
  [http://localhost:8088/swagger-ui.html](http://localhost:8088/swagger-ui.html)

- **Banking Service Swagger Docs**:  
  [http://localhost:8089/swagger-ui.html](http://localhost:8089/swagger-ui.html)

- **RabbitMQ Management (guest/guest)**:  
  [http://localhost:15672](http://localhost:15672)



## *Deployed Application links (AWS)*

- **Frontend (React UI)**:  
  [http://13.60.68.0:5173](http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:5173)

- **API Gateway (Nginx)** (optional if enabled):  
  [http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:8090](http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:8090)

- **Client Service Swagger Docs**:  
  [http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:8088/swagger-ui.html](http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:8088/swagger-ui.html)

- **Banking Service Swagger Docs**:  
  [http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:8089/swagger-ui.html](http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:8089/swagger-ui.html)

- **RabbitMQ Management (guest/guest)**:  
  [http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:15672](http://ec2-13-61-146-139.eu-north-1.compute.amazonaws.com:15672)


###  Admin Login Credentials

- **Email**: `admin@microbank.com`
- **Password**: `admin123`


###  Note: Ports conflict and URL configuration

- **Ports are defined in docker-compose and services application.yml, if you need to update any ports look in these 3 files**
- **Client side(React), ports and url are defined in .env, for local use localhost unless changed in the above files then for deployment use necessary URLa**