# Backend - E-commerce Microservices

Spring Boot microservices architecture with Eureka and API Gateway.

## Structure

```
backend/
├── discovery-server/   # Eureka - Service discovery (port 8761)
├── api-gateway/        # Spring Cloud Gateway (port 8080)
└── services/
    └── forum-service/  # Forum API (port 8084)
```

## Start Order

1. **Discovery Server** - Must start first
2. **API Gateway**
3. **Forum Service** (or other microservices)
