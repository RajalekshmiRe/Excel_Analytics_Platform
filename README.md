# 📊 Excel Analytics Platform

🚀 **Live Demo:** [https://excel-analytics-platform.onrender.com](https://excel-analytics-platform.onrender.com)
⚠️ *Note: The first load may take 30–60 seconds due to Render cold start.*

---

## 📌 Overview

The **Excel Analytics Platform** is a full-stack MERN web application that allows users to upload Excel files (`.xls`, `.xlsx`), analyze data, and generate interactive **2D and 3D charts**. The platform supports **role-based access control** with **User**, **Admin**, and **Super Admin** modules.

This project was developed as part of a **Web Developer Internship at Zidio Development** and demonstrates real-world application architecture, authentication, data visualization, and production deployment.

---

## ✨ Key Features

### 📁 File Management

* Upload Excel files (`.xls`, `.xlsx`)
* Automatic column detection
* File validation and error handling
* Upload history tracking

### 📊 Data Visualization & Analytics

* Interactive charts (Bar, Line, Pie, Scatter, 3D charts)
* Dynamic X-axis and Y-axis selection
* Real-time chart rendering
* Download charts and reports

### 🔐 Role-Based Access Control

* User, Admin, and Super Admin roles
* Secure JWT-based authentication
* Role-specific dashboards and permissions

### 🧑‍💼 Admin & Super Admin Controls

* User management (block / unblock)
* Admin management (Super Admin)
* Platform analytics overview
* System-level controls and monitoring

---

## 🖼️ Screenshots

### 🌐 Home Page

![Home Page](screenshots/homepage.png)

### 🔐 Authentication

![Login Page](screenshots/login.png)

### 👤 User Dashboard

![User Dashboard](screenshots/userdashboard.png)

### 📁 Excel Upload

![Excel Upload](screenshots/excelupload.png)

### 📈 Analytics & Charts

![Analytics Charts](screenshots/analytics.png)

### 🛠️ Admin Dashboard

![Admin Dashboard](screenshots/admindashboard.png)

### 👑 Super Admin Dashboard

![Super Admin Dashboard](screenshots/superadmindashboard.png)

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose            |
| ------------------- | ------------------ |
| React.js            | UI Development     |
| React Router        | Routing            |
| Axios               | API Requests       |
| Chart.js / Recharts | Data Visualization |
| Tailwind CSS        | Styling            |

### Backend

| Technology | Purpose        |
| ---------- | -------------- |
| Node.js    | Server Runtime |
| Express.js | API Framework  |
| MongoDB    | Database       |
| Mongoose   | ODM            |
| JWT        | Authentication |

### Deployment

| Service       | Usage                      |
| ------------- | -------------------------- |
| Render        | Backend & Frontend Hosting |
| MongoDB Atlas | Cloud Database             |

---

## 📂 Project Structure

```bash
Excel_Analytics_Platform/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   └── App.jsx
│
│── screenshots/
│── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RajalekshmiRe/Excel_Analytics_Platform.git
cd Excel_Analytics_Platform
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints (Sample)

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/login    | User/Admin login     |
| POST   | /api/auth/register | User registration    |
| POST   | /api/upload        | Upload Excel file    |
| GET    | /api/files         | Fetch upload history |
| GET    | /api/admin/users   | Admin – manage users |

---

## 🔒 Security & Performance

* JWT authentication & authorization
* Password hashing
* Protected routes
* Environment variable configuration
* Optimized API responses

---

## 🚀 Future Enhancements

* AI-based insights from Excel data
* PDF report generation
* Advanced chart customization
* Real-time collaboration
* Email notifications

---

## 👩‍💻 Author

**Rajalekshmi Reji**

📧 Email: [rajalekshmireji07@gmail.com](mailto:rajalekshmireji07@gmail.com)
💼 LinkedIn: [https://www.linkedin.com/in/rajalekshmi-reji](https://www.linkedin.com/in/rajalekshmi-reji)
💻 GitHub: [https://github.com/RajalekshmiRe](https://github.com/RajalekshmiRe)

🎓 MCA Student | MERN Stack Developer | Web Developer Intern

---

⭐ *If you like this project, don’t forget to star the repository!*
