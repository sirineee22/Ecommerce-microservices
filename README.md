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
│   └── services/          # Microservices (to be added)
```

## Tech Stack

**Frontend**
- Angular 19, Tailwind CSS, Flowbite
- Products from [FakeStore API](https://fakestoreapi.com) (converted to TND)
- Prices displayed in Tunisian Dinar (TND)

**Backend**
- Spring Boot, Eureka, Spring Cloud Gateway
- Ready for microservices (product, order, user) to be added

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

### 3. Start Frontend

```bash
cd frontend
npm install
npm start
```

Runs at: http://localhost:4200

> **Note:** The frontend currently uses FakeStore API directly. Update `src/environments/` to point to the API Gateway when backend services are deployed.

## Service Ports

| Service          | Port |
|------------------|------|
| Discovery Server | 8761 |
| API Gateway      | 8080 |
| Frontend         | 4200 |
