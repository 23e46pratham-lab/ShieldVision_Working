# 🚨 AI-Powered Debit Card Fraud Detection System

Smart, real-time fraud detection using Machine Learning, IBM Cloud, Node.js, and a modern TypeScript frontend.

## 📌 📖 Project Overview

This project is an end-to-end Fraud Detection System designed to classify debit-card transactions as Fraudulent or Legitimate in real time.

The system uses:

- A no-code ML model deployed on IBM Cloud Machine Learning

- A backend REST API built with Node.js + Express

- A full modern UI built using React + TypeScript + Vite

- A CSV-based batch prediction system

- A dashboard visualizing key insights like:

- Fraud count

- Legitimate transactions

- Accuracy metrics

- Recent fraud alerts

- Transaction logs

- This application is designed to be clean, modular, and production ready.

---

## ⚙️ Tools & Technologies Used
### 🧠 Machine Learning

IBM Watson Machine Learning

No-code pipeline model

Binary classification (Fraud / Legitimate)

Random Forest Classifier (Auto ML generated)

### 🖥️ Frontend

React (TypeScript)

Vite

Tailwind CSS

Recharts (Pie charts, analytics)

Lucide Icons

### 🔧 Backend

Node.js

Express

Axios

Multer (CSV upload handling)

### ☁️ Cloud

IBM Cloud Machine Learning API

Render.com for backend hosting

Environment variables for secret isolation

### 📑 Other Tools

CSV Reader

GitHub

VS Code

---

## 🔍 Fraud Detection Lifecycle

Below is a clean breakdown of how the detection works end-to-end:

### 🟦 1. User Inputs Transaction Data

Either by:

✔ Manual form (/predict)
✔ Uploading a CSV (/upload-csv)
✔ Auto-generated logs from previous sessions

### 🟩 2. Backend Preprocesses the Input

Backend receives:

```JSON
{
  "step": 1,
  "type": "PAYMENT",
  "amount": 5000,
  "oldbalanceOrg": 7000,
  "newbalanceOrig": 2000,
  ...
}
```

The server:

1. Validates fields

2. Normalizes numeric values

3. Formats request to IBM JSON payload

### 🟧 3. IBM Cloud ML Model Performs Prediction

Backend sends processed data to:

[https://us-south.ml.cloud.ibm.com/ml/v4/deployments/<deployment-id>/predictions](cloud.ibm.com)

IBM returns a structured result:
```
{
  "prediction": "Fraud",
  "confidence": 0.92
}
```
### 🟥 4. Backend Formats & Stores Output

Server converts IBM response into:

{
  "id": "TXN-47294",
  "amount": 5000,
  "status": "Fraud",
  "reason": "Unusual withdrawal pattern"
}


Then:

- Stores it in the in-memory log list

- Returns clean JSON to frontend

### 🟪 5. Frontend Displays Results Real-Time

Dashboard shows:

- 📌 Fraud count
- 📌 Legitimate count
- 📌 Detection Accuracy
- 📌 Pie chart distribution
- 📌 Latest alerts
- 📌 Full history logs
- 📌 Batch CSV results

```
🖼️ System Diagram
+--------------+         +------------------+         +-------------------------------+
|   Frontend   | ----->  |     Backend      | ----->  | IBM Cloud Machine Learning     |
| (React/Vite) |         | (Node.js Server) |         | (Random Forest No-Code Model)  |
+--------------+         +------------------+         +-------------------------------+
        |                         |                              |
        |  Display Results <------|<------- Prediction ----------+
        |  & Visualizations       |       
```
```
📁 Project Structure
/frontend
  ├── src
  │   ├── pages
  │   ├── components
  │   ├── services/api.ts
  │   └── types.ts
  └── vite.config.ts

```
---

## 🚀 How to Run Locally
### 1️⃣ Clone repo
```
git clone https://github.com/your-repo/FraudDetection.git
cd FraudDetection
```

### 2️⃣ Install frontend
```
cd frontend
npm install
npm run dev
```

### 3️⃣ Install backend
```
cd backend
npm install
npm start
```

### 🔐 Environment Variables
```
Backend .env
IBM_API_KEY=your-key
IBM_URL=your-ml-endpoint
PORT=5000
```

```
Frontend .env
VITE_BACKEND_URL=https://your-backend.onrender.com/api
```
---

## 📊 Dashboard Highlights

- Live pie chart for fraud ratio

- Transaction history table

- Latest fraud alerts

- CSV batch result preview

- Real-time prediction panel

## 🛠️ Features

✔ Real-time fraud prediction<br>
✔ CSV batch detection<br>
✔ Live dashboard with analytics<br>
✔ Backend logs<br>
✔ No mock data (fully connected to backend)<br>
✔ Cloud-deployed ML model<br>
✔ Clean error handling<br>
✔ Secure env-based configuration<br>

## 🎯 Future Enhancements

User authentication

Model monitoring dashboard

Database integration (MongoDB / PostgreSQL)

Advanced anomaly detection

Multi-card fraud correlation

## 🏁 Conclusion

This system demonstrates a complete production-level fraud detection pipeline powered by:

⚡ Cloud ML<br>
⚡ Modern frontend UI<br>
⚡ Scalable backend architecture<br>

## Perfect for:

- Academic projects

- Banking simulations

- AI/ML demonstrations

- Real-world fraud analytics
