# SmartInterview & Evaluation System

SmartInterview is an intelligent end-to-end platform for scheduling, managing, and evaluating technical interviews. It leverages AI (Google Gemini) to provide objective feedback and scores based on interviewer observations and candidate backgrounds.

## 🚀 Key Features

- **Multi-Role Dashboards**: Specific views for Admins, HR Specialists, Interviewers, and Applicants.
- **AI-Powered Evaluation**: Automated analysis of interview performance using Gemini AI.
- **Smart Scheduling**: HR can easily assign interviewers and schedule sessions with automated email notifications.
- **Real-time Tracking**: Applicants can track their progress through Applied, Scheduled, Interviewed, and Decision stages.
- **Rich User Experience**: Modern UI built with React, Framer Motion, and Lucide Icons.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, TailwindCSS (for some components), Framer Motion, Axios.
- **Backend**: Java Spring Boot, Spring Security (JWT), Spring Data JPA.
- **Database**: PostgreSQL.
- **AI**: Google Gemini Pro (1.5 Flash).
- **Communication**: Java Mail Sender for automated job & interview alerts.

---

## 💻 Setup Instructions

### 1. Prerequisites
- Java JDK 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

### 2. Database Setup
1. Create a database named `smartinterview` in PostgreSQL.
   ```sql
   CREATE DATABASE smartinterview;
   ```

### 3. Backend Configuration
Open `backend/src/main/resources/application.properties` and update the following placeholders:
- `spring.datasource.username`: Your PostgreSQL username
- `spring.datasource.password`: Your PostgreSQL password
- `gemini.api.key`: Your Google Gemini API Key
- `spring.mail.username`: Your Gmail address
- `spring.mail.password`: Your App Password (not regular password)

### 4. Run the Application

#### Run Backend:
```bash
cd backend
mvn spring-boot:run
```
The server starts on `http://localhost:8080/api`

#### Run Frontend:
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **HR** | `hr1` | `hr123` |
| **Interviewer** | `interviewer1` | `int123` |

---

## 📄 License

This project is for internal evaluation and demonstration purposes.
