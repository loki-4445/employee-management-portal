# Employee Management Portal
A full-stack responsive Employee Management System built with Spring Boot, PostgreSQL, and React, supporting user authentication, employee CRUD, filtering, and cloud deployment on Render and Netlify.
**A modern employee management system built with Spring Boot, PostgreSQL, and React.**

This application allows organizations to manage employee details, with powerful features including user authentication, secure CRUD operations, advanced filtering/search, and full mobile responsiveness. The backend is deployed on [Render](https://render.com/) and the frontend is hosted on [Netlify](https://netlify.com/).

---

## 🚀 Features

- User registration and authentication (JWT/Basic Auth)
- Add, view, edit, and delete employees
- Search, filter, and sort employees
- Responsive design for desktop, tablet, and mobile
- PostgreSQL integration for persistent storage
- Secure RESTful API with Spring Boot & Spring Security
- Deployed backend (Render) and frontend (Netlify)
- Modern UI with React and CSS

---

## 🛠️ Stack

- **Frontend:** React, CSS
- **Backend:** Java 17, Spring Boot, Spring Data JPA, Spring Security
- **Database:** PostgreSQL
- **Deployment:** Render (API), Netlify (Frontend)

---

## 💻 Live Demo

- **Frontend:** [https://gvrtracker.netlify.app/](https://gvrtracker.netlify.app/)
- **Backend API:** [https://employee-management-api-nql8.onrender.com](https://employee-management-api-nql8.onrender.com)

---

## 📦 Project Structure
employee-management-portal/
├─ backend/ # Spring Boot (Java), database, API
└─ frontend/ # React app


---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/loki-4445/employee-management-portal.git
cd employee-management-portal



### 2. Run Backend Locally

- Navigate to `backend/`  
- Configure your PostgreSQL DB connection in `.env` or `application.properties`
- Run Spring Boot app with your IDE or `mvn spring-boot:run`

### 3. Run Frontend Locally

cd frontend
npm install
npm start


- Update `src/api/http.js` to point to your local backend for development

---

## 🌐 Deployment

- **Frontend:** Push `/frontend` to Netlify (set the backend API base URL in production)
- **Backend:** Push `/backend` to Render (set environment variables for DB and frontend origin)

---

## 🙌 Contributing

Pull requests and issues are welcome! Please open a PR or issue to discuss improvements, features, or bugs.

---

## 📄 License

MIT License

---

## 👨‍💻 Maintainer

- [Gandham Lokesh](https://github.com/loki-4445)


