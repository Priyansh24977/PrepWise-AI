# 🚀 PrepWise AI

PrepWise AI is an AI-powered interview preparation platform that helps users practice technical interviews, receive AI-generated feedback, and generate professional resume PDFs.

The application provides secure authentication, personalized interview reports, resume analysis, and an interactive user experience using modern web technologies.

---

## ✨ Features

- 🔐 JWT Authentication with HTTP-only Cookies
- 👤 User Registration & Login
- 🛡️ Protected Routes
- 🤖 AI-Powered Interview Feedback
- 📄 Resume Upload & Analysis
- 📑 Resume PDF Generation
- 📊 Interview Performance Report
- 💻 Modern Responsive UI
- ☁️ Cloud Deployment

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Puppeteer (PDF Generation)

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📁 Project Structure

```
PrepWise-AI/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── components/
│   │   ├── assets/
│   │   └── router.jsx
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Priyansh24977/PrepWise-AI.git

cd PrepWise-AI
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

FRONTEND_URL=http://localhost:5173
```

Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:5000
```

Start Frontend

```bash
npm run dev
```

---

## 🌐 Live Demo

### Frontend

https://prepwise-ai-kappa.vercel.app

### Backend API

https://prepwise-ai-981v.onrender.com

---

## 🔒 Authentication

PrepWise AI uses:

- JWT Authentication
- HTTP-only Cookies
- Protected Routes
- bcrypt Password Hashing

---

## 📄 Resume PDF

The application generates downloadable PDF resumes using Puppeteer.

---

## 📸 Screenshots

> Add screenshots here

Example:

- Login Page
- Register Page
- Dashboard
- Interview Screen
- AI Report
- Resume PDF

---

## 📌 Future Improvements

- Google Authentication
- Email Verification
- Interview History
- AI Chat Assistant
- Dark Mode
- Resume Templates
- Mock Coding Interviews
- Interview Analytics Dashboard

---

## 👨‍💻 Author

**Priyansh Dwivedi**

GitHub

https://github.com/Priyansh24977

LinkedIn

https://www.linkedin.com/in/priyansh-dwivedi-a69a19333

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.