# SmartBook - Event Booking Platform

> A full-stack event booking platform with real-time seat availability, QR-code tickets, and role-based access control.

🌐 **Live Demo:** [smartbook-ecru.vercel.app](https://smartbook-ecru.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Author](#author)

---

## Overview

SmartBook is a full-stack event booking application that allows users to browse events by category, book seats in real time, and receive QR-code-embedded tickets. Admins can manage events and monitor bookings through a protected dashboard.

Built as a portfolio project to demonstrate end-to-end full-stack development from REST API design and JWT authentication to CI/CD pipelines and cloud deployment.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth & Roles** | JWT-based login with Admin and User role separation |
| 🪑 **Real-Time Seat Tracking** | Seat availability updates live on booking/cancellation |
| 🎫 **QR Code Tickets** | Auto-generated QR code ticket on successful booking |
| ❌ **Booking Cancellation** | Users can cancel bookings; seats are released instantly |
| 🎨 **Category Themes** | Dynamic color and emoji themes per event category |
| 📧 **Email Confirmations** | Booking confirmation emails via EmailJS |
| 🛡️ **Admin Dashboard** | Protected routes for event management (Admin only) |
| 📱 **Responsive Design** | Works across desktop and mobile |

---

## 🛠️ Tech Stack

### Backend
- **Java 17** + **Spring Boot 3**
- **Spring Security** — JWT authentication
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL** — relational database
- **Maven** — build tool

### Frontend
- **React.js** + **Vite**
- **React Router** — client-side routing
- **Axios** — HTTP client
- **EmailJS** — transactional email
- **QR Code library** — ticket generation

### DevOps & Cloud
- **Docker** — containerization
- **GitHub Actions** — CI/CD pipeline
- **Render** — backend hosting
- **Vercel** — frontend hosting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│           React / Vite              │  ← Vercel
│   (Frontend SPA)                    │
└────────────────┬────────────────────┘
                 │ HTTPS REST API
┌────────────────▼────────────────────┐
│        Spring Boot API              │  ← Render
│   Auth │ Events │ Bookings          │
└────────────────┬────────────────────┘
                 │ JDBC
┌────────────────▼────────────────────┐
│          PostgreSQL DB              │  ← Render (managed)
└─────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+
- Docker (optional)

---

## 🔐 Environment Variables

### Backend (`application.properties` or environment)

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/smartbook
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

# JWT
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/POKAS008/smartbook.git
cd smartbook
```

### 2. Start the Backend

```bash
cd backend
# Configure your DB credentials in src/main/resources/application.properties
mvn clean install
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. (Optional) Run with Docker

```bash
docker-compose up --build
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Events
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/events` | List all events | Public |
| GET | `/api/events/{id}` | Get event by ID | Public |
| POST | `/api/events` | Create event | Admin |
| PUT | `/api/events/{id}` | Update event | Admin |
| DELETE | `/api/events/{id}` | Delete event | Admin |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bookings` | Book an event | User |
| GET | `/api/bookings/my` | View my bookings | User |
| DELETE | `/api/bookings/{id}` | Cancel booking | User |
| GET | `/api/bookings` | View all bookings | Admin |

---

## 📁 Project Structure

```
smartbook/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartbook/
│   │   │   │   ├── config/         # Security, JWT config
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/            # Request/Response DTOs
│   │   │   │   ├── entity/         # JPA entities
│   │   │   │   ├── repository/     # Spring Data repos
│   │   │   │   └── service/        # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # Axios API calls
│   │   ├── context/        # Auth context / state
│   │   └── App.jsx
│   ├── .env.example
│   └── vite.config.js
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD
└── README.md
```



## 📸 Screenshots
<img width="1914" height="926" alt="image" src="https://github.com/user-attachments/assets/910546b9-635c-4929-9e6a-7af4d13614ae" />
<img width="1888" height="918" alt="image" src="https://github.com/user-attachments/assets/8694fc57-219a-41d7-a40f-a9c230f746db" />
<img width="1604" height="941" alt="image" src="https://github.com/user-attachments/assets/c1820aa0-3e18-46dd-8a16-e35a57a0374f" />
<img width="1881" height="959" alt="image" src="https://github.com/user-attachments/assets/59d60fdf-b297-4e35-afd6-9c61864628ff" />
<img width="1602" height="797" alt="image" src="https://github.com/user-attachments/assets/484c2ca6-9b35-46b8-85d6-8bad4a75a9d4" />
<img width="1573" height="914" alt="image" src="https://github.com/user-attachments/assets/6df3e0a1-9bcd-4f87-91ce-255d861af8ac" />
<img width="591" height="742" alt="image" src="https://github.com/user-attachments/assets/6dc747c5-18af-4caa-9ebd-227b9d3e3e61" />
<img width="537" height="774" alt="image" src="https://github.com/user-attachments/assets/fd41707e-b623-49a7-a79e-94c2c937b855" />
<img width="1068" height="145" alt="image" src="https://github.com/user-attachments/assets/64d4fd0e-0aa1-4d53-a6e3-037a02807169" />
<img width="978" height="145" alt="image" src="https://github.com/user-attachments/assets/91b5ae60-9488-49db-8581-2ec331f4f7b1" />



> 🌐 Live at [smartbook-ecru.vercel.app](https://smartbook-ecru.vercel.app)

| Home / Events | Booking Flow | QR Ticket |
|---|---|---|
| Browse events by category | Select seats & confirm | Auto-generated QR code ticket |

---

## 👤 Author

**Saranya Pokala**
- 📧 saranyaeng123@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/saranya-pokala)
- 🐙 [GitHub](https://github.com/POKAS008)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> ⭐ If you found this project helpful, please consider giving it a star!
