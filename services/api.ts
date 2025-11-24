import axios from 'axios';
import { PredictionRequest, PredictionResponse, TransactionLog, DashboardStats } from '../types';

// Use environment variable or fallback to localhost for development
// Casting import.meta to any to resolve TypeScript error regarding missing 'env' property
const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error("Health check failed", error);
    return false;
  }
};

export const predictFraud = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>('/predict', data);
  return response.data;
};

export const uploadCSV = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getLogs = async (): Promise<TransactionLog[]> => {
  const response = await api.get<TransactionLog[]>('/logs');
  return response.data;
};

// Mock data service for frontend demo purposes if backend is offline
// You can remove this in production
export const getMockStats = (): DashboardStats => ({
  totalTransactions: 1500,
  fraudDetected: 35,
  detectionAccuracy: 85,
});

export const getMockLogs = (): TransactionLog[] => [
  { id: '123456', date: '2024-04-10', amount: 10000, merchant: 'CASH_OUT', status: 'Fraud', reason: 'Unusual balance change' },
  { id: '123457', date: '2024-04-09', amount: 3500, merchant: 'PAYMENT', status: 'Legitimate', reason: 'High amount' },
  { id: '123458', date: '2024-04-08', amount: 1200, merchant: 'DEBIT', status: 'Legitimate', reason: 'High amount' },
  { id: '123459', date: '2024-04-07', amount: 45000, merchant: 'TRANSFER', status: 'Fraud', reason: 'Large transaction' },
];

export default api;