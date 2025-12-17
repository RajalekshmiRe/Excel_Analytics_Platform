# 📊 Excel Analytics Platform

A modern full-stack MERN web application that allows users to upload Excel files, analyze data, and generate interactive 2D and 3D charts with role-based access control.

## 🌐 Live Demo

**Experience Excel Analytics Platform live!**

🔗 **Frontend Application**: [https://excel-analytics-platform-ivory.vercel.app](https://excel-analytics-platform-ivory.vercel.app)

🔗 **Backend API**: [https://excel-analytics-platform.onrender.com](https://excel-analytics-platform.onrender.com)

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
| **Deployed on Vercel** | **Frontend Hosting** |

### Backend

| Technology | Purpose        |
| ---------- | -------------- |
| Node.js    | Server Runtime |
| Express.js | API Framework  |
| MongoDB    | Database       |
| Mongoose   | ODM            |
| JWT        | Authentication |
| **Deployed on Render** | **Backend Hosting** |

### Deployment

| Service       | Usage                      |
| ------------- | -------------------------- |
| Vercel        | Frontend Hosting           |
| Render        | Backend API Hosting        |
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
NODE_ENV=development
```

Run backend:

```bash
npm start
```

Backend will run on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/login    | User/Admin login     |
| POST   | /api/auth/register | User registration    |

### File Management

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | /api/upload   | Upload Excel file    |
| GET    | /api/files    | Fetch upload history |

### Admin Controls

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | /api/admin/users  | Manage users       |
| PUT    | /api/admin/users/:id | Update user status |

### Analytics

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | /api/analytics     | Get analytics data       |
| POST   | /api/charts        | Generate chart           |

---

## 🚀 Deployment

This application is deployed and live with separate frontend and backend services:

### Frontend Deployment (Vercel)
- **Platform**: Vercel
- **URL**: [https://excel-analytics-platform-ivory.vercel.app](https://excel-analytics-platform-ivory.vercel.app)
- **Features**: Automatic deployments from main branch, CDN distribution, SSL certificate

### Backend Deployment (Render)
- **Platform**: Render
- **URL**: [https://excel-analytics-platform.onrender.com](https://excel-analytics-platform.onrender.com)
- **Features**: Environment variables securely configured, automatic SSL, health monitoring
- **Note**: First request may take 30-60 seconds due to cold start on free tier

### Database
- **Platform**: MongoDB Atlas
- **Type**: Cloud-hosted NoSQL database
- **Features**: Automatic backups, monitoring, scalability

---

## 🔒 Security & Performance

* JWT authentication & authorization
* Password hashing with bcrypt
* Protected routes and middleware
* Environment variable configuration
* CORS configuration
* Input validation and sanitization
* Optimized API responses
* Rate limiting on API endpoints

---

## 🚀 Future Enhancements

* AI-based insights from Excel data
* PDF report generation
* Advanced chart customization
* Real-time collaboration features
* Email notifications for reports
* Multi-language support
* Advanced data filtering options
* Export to multiple formats (CSV, JSON, PDF)

---

## 👩‍💻 Author

**Rajalekshmi Reji**

📧 Email: [rajalekshmireji07@gmail.com](mailto:rajalekshmireji07@gmail.com)  
💼 LinkedIn: [https://www.linkedin.com/in/rajalekshmi-reji](https://www.linkedin.com/in/rajalekshmi-reji)  
💻 GitHub: [https://github.com/RajalekshmiRe](https://github.com/RajalekshmiRe)  
🌐 Live Demo: [https://excel-analytics-platform-ivory.vercel.app](https://excel-analytics-platform-ivory.vercel.app)

🎓 MCA Student | MERN Stack Developer | Web Developer Intern at Zidio Development

---

## 📄 License

This project is developed as part of an internship program. All rights reserved.

---

## 🙏 Acknowledgments

* **Zidio Development** - For the internship opportunity and guidance
* Thanks to all contributors and mentors who helped improve this project
* Built with modern MERN stack technologies
* Inspired by enterprise-level data analytics platforms

---

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository or contact via email.

---

⭐ **If you like this project, don't forget to star the repository!**

**Live at**: [https://excel-analytics-platform-ivory.vercel.app](https://excel-analytics-platform-ivory.vercel.app)
