import axios from 'axios';
import { PredictionRequest, PredictionResponse, TransactionLog, DashboardStats } from '../types';

// Backend URL (supports Render + local)
const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// -----------------------------
// HEALTH CHECK
// -----------------------------
export const checkHealth = async (): Promise<boolean> => {
  console.log("%c[Frontend] Checking backend health...", "color: #ffaa00");
  try {
    const res = await api.get('/health');
    console.log("%c[Frontend] Backend health OK", "color: #22cc22");
    return res.status === 200;
  } catch (err) {
    console.error("[Frontend] Backend health FAILED", err);
    return false;
  }
};

// -----------------------------
// PREDICT FRAUD (REAL IBM ONLY)
// -----------------------------
export const predictFraud = async (data: PredictionRequest): Promise<PredictionResponse> => {
  console.log("%c[Frontend] Sending REAL request → /predict", "color: dodgerblue; font-weight: bold;", data);

  try {
    const response = await api.post<PredictionResponse>('/predict', data);
    console.log("%c[Frontend] REAL IBM Response Received:", "color: green; font-weight: bold;", response.data);
    return response.data;
  } catch (err: any) {
    console.error("%c[ERROR] Backend prediction FAILED:", "color: red; font-weight: bold;", err);

    throw new Error("Failed to fetch prediction from backend");
  }
};

// -----------------------------
// CSV UPLOAD (REAL BACKEND)
// -----------------------------
export const uploadCSV = async (file: File): Promise<any> => {
  console.log("%c[Frontend] Uploading CSV to backend...", "color: purple");

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api.post('/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log("%c[Frontend] CSV Upload Result:", "color: green;", res.data);
    return res.data;

  } catch (err) {
    console.error("%c[ERROR] CSV Upload FAILED", "color: red", err);
    throw new Error("Failed to upload CSV");
  }
};

// -----------------------------
// LOGS (Backend only — no mocks)
// -----------------------------
export const getLogs = async (): Promise<TransactionLog[]> => {
  console.log("%c[Frontend] Fetching logs...", "color: cyan");
  try {
    const res = await api.get('/logs');
    return res.data;
  } catch (err) {
    console.error("[ERROR] Failed to fetch logs", err);
    throw new Error("Failed to fetch logs");
  }
};

export const getStats = async (): Promise<{
  totalRowsProcessed: number;
  fraudCount: number;
  lastUpload: string | null;
}> => {
  console.log("%c[API] Fetching /stats", "color: purple; font-weight: bold;");

  const response = await api.get('/stats');
  console.log("%c[API] /stats response:", "color: green; font-weight: bold;", response.data);

  return response.data;
};


export default api;
