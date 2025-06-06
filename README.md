# Library Management System (SOA-Based)

A modular, scalable Library Management System built using Service-Oriented Architecture (SOA). The project features independent microservices for managing books, borrowers, and fines, with a modern React.js frontend and Docker-based deployment.

---

## Features

- **Book Service:** Add, update, delete, and list books in the library.
- **Borrower Service:** Register users, issue/return books, track borrowing history.
- **Fine Service:** Calculate and manage fines for overdue returns.
- **Frontend:** Responsive React.js interface for staff and users.
- **RESTful APIs:** All services communicate via HTTP APIs.
- **Swagger UI:** Interactive API documentation and testing.
- **Dockerized:** Easy deployment and scaling with Docker and Docker Compose.

---

## Architecture

- **Service-Oriented Architecture (SOA):**  
  Each core function (books, borrowers, fines) is implemented as an independent microservice.
- **Frontend:**  
  React.js app communicates with backend services via REST APIs.
- **Deployment:**  
  All services and frontend run in Docker containers for consistency and scalability.

  
---

## Project Structure

LIBRARY-SOA/
├── backend/
│ ├── static/
│ │ ├── swagger_book.yaml
│ │ ├── swagger_borrower.yaml
│ │ └── swagger_fine.yaml
│ ├── book_service.py
│ ├── borrower_service.py
│ ├── fine_service.py
│ ├── requirements.txt
│ ├── Dockerfile.book
│ ├── Dockerfile.borrower
│ └── Dockerfile.fine
├── frontend/
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
├── docker-compose.yml
└── README.md


---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Docker & Docker Compose
- Git

### Clone the Repository

## Deployment

### Using Docker Compose (Recommended)

1. **Build and Run All Services**
sudo docker-compose up --build


2. **Access the Application**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Book Service API: [http://localhost:5001/swagger](http://localhost:5001/swagger)
- Borrower Service API: [http://localhost:5002/swagger](http://localhost:5002/swagger)
- Fine Service API: [http://localhost:5003/swagger](http://localhost:5003/swagger)

### Deploy Frontend on Vercel

- Push the `frontend/` folder to a GitHub repository.
- Import the repo at [vercel.com](https://vercel.com/) and deploy with default settings.

---

## API Documentation

Each backend service provides interactive API docs via Swagger UI:
- Book Service: `/swagger`
- Borrower Service: `/swagger`
- Fine Service: `/swagger`

---

## Technologies Used

- **Backend:** Python, Flask, Flask-CORS, Swagger
- **Frontend:** React.js, Axios, Bootstrap
- **Deployment:** Docker, Docker Compose, AWS EC2, Vercel
- **Version Control:** Git, GitHub

---

## Future Enhancements

- Integrate persistent databases (e.g., PostgreSQL, MongoDB)
- Add user authentication and authorization
- Implement notifications and analytics
- Deploy backend as serverless functions or managed services

---
![image](https://github.com/user-attachments/assets/620a8851-ef0c-40b5-bcc8-88e3885b588c)
![image](https://github.com/user-attachments/assets/2ff058bf-6ffb-4c43-8e22-d593936ee829)
![image](https://github.com/user-attachments/assets/1b97cf18-05c0-4893-98b1-ad5a74103717)
![image](https://github.com/user-attachments/assets/cd323560-77d7-48ab-b8b5-ef87f01a95cd)
![image](https://github.com/user-attachments/assets/37d0c51e-1879-42e9-84df-b91b50912170)









