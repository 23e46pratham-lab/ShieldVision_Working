export interface PredictionRequest {
  step: number;
  type: string;
  amount: number;
  nameOrig: string;
  oldbalanceOrg: number;
  newbalanceOrig: number;
  nameDest: string;
  oldbalanceDest: number;
  newbalanceDest: number;
}

export interface PredictionResponse {
  isFraud: boolean;
  probability: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
}

export interface TransactionLog {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  status: 'Fraud' | 'Legitimate';
  reason?: string;
}

export interface DashboardStats {
  totalTransactions: number;
  fraudDetected: number;
  detectionAccuracy: number;
}