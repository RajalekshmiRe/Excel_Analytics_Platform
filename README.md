# 📊 Excel Analytics Platform

## 🧠 Overview
**Excel Analytics Platform** is a full-stack web application that enables users to upload Excel files (`.xls` / `.xlsx`), analyze the data, and visualize it using dynamic 2D and 3D charts. The platform offers smart insights, customizable analytics, and a dashboard for managing uploads and history.

This project was developed as part of my **Web Developer Internship at Zidio Development**, using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🚀 Features
- 📂 Upload Excel files and preview contents  
- 📈 Generate interactive 2D and 3D charts  
- 🔍 Choose columns for X and Y axes  
- 💾 Save upload and analysis history in user dashboard  
- 👩‍💻 User authentication and role-based access (User/Admin)  
- 🧮 Smart insights using AI APIs (optional module)  
- 📤 Download generated graphs and reports  
- ⚙️ Admin can manage users and data usage  

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Vite, Chart.js, Three.js, Lucide React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| File Parsing | XLSX / Papaparse libraries |
| Charts | Chart.js (2D) & Three.js (3D) |
| Authentication | JWT-based authentication |

---

## 📁 Project Structure
```
Excel_Analytics_Platform/
│
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── package.json            # Root package.json (runs both frontend & backend)
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔸 Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 🔸 Clone the repository
```bash
git clone https://github.com/RajalekshmiRe/Excel-Analytics-Platform.git
cd Excel-Analytics-Platform
```

### 🔸 Install all dependencies (Root, Frontend & Backend)
```bash
npm run install-all
```

### 🔸 Environment Variables
Create a `.env` file in `/backend` (copy from `.env.example`):
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual values:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 🔸 Run the application
From the ROOT folder:
```bash
npm run dev
```

This will start:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

### 🔸 Alternative: Run separately
**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

---

## 📊 Usage Instructions
1. Register and log in as a user  
2. Upload an Excel file from the dashboard  
3. Select columns for X and Y axes  
4. Choose a chart type (Bar, Line, Pie, 3D, etc.)  
5. View and download generated visualizations  
6. Access upload history anytime  

---

## 👨‍💼 Admin Features
- Manage users and uploaded data  
- View analytics summaries  
- Approve or restrict access  

---

## 🌟 Future Enhancements
- AI-based automatic data summary  
- Real-time collaboration  
- PDF/Excel export for reports  
- Dark mode UI  

---

## 📦 Scripts Reference
| Command | Description |
|---------|-------------|
| `npm run install-all` | Install dependencies for root, frontend, and backend |
| `npm run dev` | Run both frontend and backend together |
| `npm run dev:frontend` | Run only frontend |
| `npm run dev:backend` | Run only backend |
| `npm run build:frontend` | Build frontend for production |

---

## 💻 Author
**Rajalekshmi Reji**  
_Web Developer Intern @ Zidio Development_  
📧 your-email@example.com  
🔗 [GitHub Profile](https://github.com/RajalekshmiRe)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).