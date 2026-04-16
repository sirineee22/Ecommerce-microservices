# E-commerce Microservices Platform

A microservices-ready e-commerce platform with Angular frontend and Spring Cloud backend infrastructure.

## Architecture Overview

```
ecommerce-microservices/
├── frontend/              # Angular SPA (MyShop)
│   └── Product catalog, cart, checkout with TND pricing
├── backend/
│   ├── discovery-server/  # Eureka Server - Service Discovery (port 8761)
│   ├── api-gateway/       # Spring Cloud Gateway - API Routing (port 8080)
│   └── services/
│       └── forum-service/ # Forum API (port 8084)
```

## Tech Stack

**Frontend**
- Angular 19, Tailwind CSS, Flowbite
- Products from [FakeStore API](https://fakestoreapi.com) (converted to TND)
- Prices displayed in Tunisian Dinar (TND)

**Backend**
- Spring Boot, Eureka, Spring Cloud Gateway
- Forum service with JPA/H2

## Prerequisites

- **Java 17+**
- **Node.js 18+**
- **Maven 3.8+**

## Quick Start

### 1. Start Discovery Server (Eureka)

```bash
cd backend/discovery-server
mvn spring-boot:run
```

Runs at: http://localhost:8761

### 2. Start API Gateway

```bash
cd backend/api-gateway
mvn spring-boot:run
```

Runs at: http://localhost:8080

### 3. Start Forum Service

```bash
cd backend/services/forum-service
mvn spring-boot:run
```

Runs at: http://localhost:8084

### 4. Start Frontend

```bash
cd frontend
npm install
npm start
```

Runs at: http://localhost:4200

**Forum API** (via Gateway): `http://localhost:8080/api/forum/discussions`

> **Note:** The frontend forum currently uses mock data. Update the forum service to consume `http://localhost:8080/api/forum` when ready.

## Service Ports

| Service          | Port |
|------------------|------|
| Discovery Server | 8761 |
| API Gateway      | 8080 |
| Forum Service    | 8084 |
| Frontend         | 4200 |
