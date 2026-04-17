# 🛒 MyShop — E-Commerce Microservices Platform

Application e-commerce complète basée sur une architecture microservices avec Spring Boot, Angular, Keycloak, RabbitMQ et Docker.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Angular Frontend                      │
│                     (http://localhost:4200)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    API Gateway (port 8880)                   │
│         Spring Cloud Gateway + Keycloak JWT Security        │
└──┬──────────┬──────────┬──────────┬──────────┬─────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
Product    Order      Forum      Event     Keycloak
Service    Service    Service    Service   (port 8181)
(8081)     (8082)     (8084)     (8083)
PostgreSQL  MySQL      H2        MySQL
   │          │
   └──────────┘
   RabbitMQ (async)
   Feign Client (sync)
```

---

## 🚀 Microservices

| Service | Port | Technologie | Base de données |
|---------|------|-------------|-----------------|
| **api-gateway** | 8880 | Spring Cloud Gateway | - |
| **discovery-server** | 8761 | Eureka Server | - |
| **config-server** | 8888 | Spring Cloud Config | - |
| **product-service** | 8081 | Spring Boot 3.2 | PostgreSQL |
| **order-service** | 8082 | Spring Boot 3.2 | MySQL |
| **forum-service** | 8084 | Spring Boot 3.2 | H2 |
| **event-service** | 8083 | Spring Boot 3.2 | MySQL |
| **keycloak** | 8181 | Keycloak 23 | H2 |
| **rabbitmq** | 5672/15672 | RabbitMQ 3 | - |

---

## 🔐 Sécurité — Keycloak + JWT

### Rôles
- **ADMIN** : accès complet (gestion produits, commandes)
- **USER** : accès lecture produits, forum, events

### Règles Gateway
| Route | Accès |
|-------|-------|
| `GET /product-service/api/products` | Public |
| `POST /product-service/api/products` | ADMIN |
| `/order-service/**` | ADMIN |
| `/forum-service/**` | Public |
| `/event-service/**` | Public |

### Utilisateurs par défaut
| Username | Password | Rôle |
|----------|----------|------|
| admin | admin | ADMIN |
| user | user | USER |

---

## 📨 Communication entre Microservices

### Synchrone — Feign Client (3 scénarios)

**order-service → product-service**

1. `GET /api/products/{id}` — Valider le produit avant création de commande
2. `GET /api/products` — Lister les produits disponibles
3. `GET /api/orders/{id}/product` — Récupérer les détails produit d'une commande

### Asynchrone — RabbitMQ (2 scénarios)

**Exchange:** `order.exchange` (TopicExchange)

| Scénario | Routing Key | Producteur | Consommateur | Action |
|----------|-------------|------------|--------------|--------|
| Commande créée | `order.created` | order-service | product-service | Décrémente le stock |
| Commande annulée | `order.cancelled` | order-service | product-service | Restaure le stock |

---

## 🐳 Démarrage avec Docker Compose

```bash
# Cloner le projet
git clone <repo-url>
cd Ecommerce-microservices-main

# Lancer tous les services
docker-compose up --build -d

# Vérifier les containers
docker ps
```

### URLs d'accès
| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:8880 |
| Eureka Dashboard | http://localhost:8761 |
| Keycloak Admin | http://localhost:8181 (admin/admin) |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |
| Swagger UI | http://localhost:8880/swagger-ui.html |

---

## 📚 API Documentation — Swagger

Swagger centralisé au niveau du Gateway :
- **URL** : http://localhost:8880/swagger-ui.html
- **Services documentés** : product-service, order-service

---

## 🗂️ Structure du projet

```
Ecommerce-microservices-main/
├── backend/
│   ├── api-gateway/          # Spring Cloud Gateway + Security
│   ├── config-server/        # Spring Cloud Config Server
│   ├── discovery-server/     # Eureka Discovery Server
│   ├── product-service/      # CRUD produits + RabbitMQ consumer
│   ├── micro_s_ordre/        # Gestion commandes + Feign + RabbitMQ
│   ├── services/
│   │   ├── forum-service/    # Forum discussions
│   │   └── event_service/    # Gestion événements
│   ├── config-repo/          # Configurations centralisées
│   ├── realm-export.json     # Configuration Keycloak
│   └── init-mysql.sql        # Init bases MySQL
├── frontend/                 # Angular 19 + Keycloak
└── docker-compose.yml        # Orchestration complète
```

---

## 🔧 Technologies utilisées

- **Backend** : Spring Boot 3.2, Spring Cloud 2023, Spring Security OAuth2
- **Frontend** : Angular 19, Tailwind CSS, Flowbite, keycloak-js
- **Sécurité** : Keycloak 23, JWT, RBAC
- **Communication** : OpenFeign (sync), RabbitMQ (async)
- **Bases de données** : PostgreSQL, MySQL, H2
- **Infrastructure** : Docker, Docker Compose, Eureka, Spring Cloud Config
- **Documentation** : Swagger/OpenAPI 3 centralisé
