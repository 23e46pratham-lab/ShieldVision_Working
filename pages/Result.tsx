import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { PredictionResponse, PredictionRequest } from '../types';

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: PredictionResponse; requestData: PredictionRequest } | null;

  if (!state) {
    return <Navigate to="/predict" replace />;
  }

  const { result, requestData } = state;
  const isFraud = result.isFraud;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className={clsx("p-8 text-center", isFraud ? "bg-red-50" : "bg-green-50")}>
          <div className={clsx("mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm", isFraud ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
            {isFraud ? <AlertTriangle size={40} /> : <ShieldCheck size={40} />}
          </div>
          <h1 className={clsx("text-3xl font-bold mb-2", isFraud ? "text-red-700" : "text-green-700")}>
            {isFraud ? "High Fraud Probability" : "Safe Transaction"}
          </h1>
          <p className="text-slate-600">
            Analysis Reference: <span className="font-mono text-slate-800">REF-{Math.floor(Math.random() * 1000000)}</span>
          </p>
        </div>

        {/* Details Body */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-slate-50 p-4 rounded-lg text-center">
               <p className="text-xs text-slate-500 uppercase font-semibold">Model Confidence</p>
               <p className={clsx("text-2xl font-bold", isFraud ? "text-red-600" : "text-green-600")}>
                 {(result.probability * 100).toFixed(1)}%
               </p>
             </div>
             <div className="bg-slate-50 p-4 rounded-lg text-center">
               <p className="text-xs text-slate-500 uppercase font-semibold">Risk Classification</p>
               <p className="text-2xl font-bold text-slate-800">{result.riskLevel || (isFraud ? 'High' : 'Low')}</p>
             </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">IBM Model Input Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">step</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.step}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">type</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.type}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">amount</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.amount}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">nameOrig</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.nameOrig}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">oldbalanceOrg</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.oldbalanceOrg}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">newbalanceOrig</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.newbalanceOrig}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">nameDest</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.nameDest}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">oldbalanceDest</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.oldbalanceDest}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">newbalanceDest</span>
               <span className="font-medium text-slate-900 font-mono">{requestData.newbalanceDest}</span>
             </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate('/predict')}
              className="flex-1 flex items-center justify-center py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Another
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;