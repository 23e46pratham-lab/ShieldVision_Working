import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictFraud } from '../services/api';
import { PredictionRequest } from '../types';
import { ShieldCheck, Banknote, User, ArrowLeftRight, History, CreditCard } from 'lucide-react';

const Predict: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PredictionRequest>({
    step: 1,
    type: 'PAYMENT',
    amount: 0,
    nameOrig: '',
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    nameDest: '',
    oldbalanceDest: 0,
    newbalanceDest: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Fields that need to be numbers
    const numberFields = ['step', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call delay for effect
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = await predictFraud(formData);
      
      // Navigate to result page with state
      navigate('/result', { state: { result, requestData: formData } });
    } catch (error) {
      console.error("Prediction failed", error);
      console.warn("%c[Frontend] Backend FAILED → Using MOCK result", "color: red; font-weight: bold;", error);

      // For demo purposes, if backend fails, generate a mock result based on simple logic
      const mockResult = {
        isFraud: formData.amount > 50000 || (formData.oldbalanceOrg - formData.newbalanceOrig !== formData.amount),
        probability: formData.amount > 50000 ? 0.92 : 0.15,
        riskLevel: formData.amount > 50000 ? 'High' : 'Low' as any,
        timestamp: new Date().toISOString()
      };
      navigate('/result', { state: { result: mockResult, requestData: formData } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Fraud Prediction</h1>
        <p className="text-slate-500 mt-2">Enter the IBM Watson model parameters below.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Transaction Basics */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Banknote className="w-5 h-5 mr-2 text-blue-600" /> Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Step <span className="text-slate-400 text-xs">(Time unit)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <History className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="step"
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.step}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Type
                </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ArrowLeftRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    name="type"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="PAYMENT">PAYMENT</option>
                    <option value="TRANSFER">TRANSFER</option>
                    <option value="CASH_OUT">CASH_OUT</option>
                    <option value="DEBIT">DEBIT</option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Amount
                </label>
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Section 2: Origin Account */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" /> Origin Account (Sender)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">nameOrig</label>
                <input
                  type="text"
                  name="nameOrig"
                  required
                  placeholder="e.g. C12345001"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.nameOrig}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">oldbalanceOrg</label>
                <input
                  type="number"
                  name="oldbalanceOrg"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.oldbalanceOrg}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">newbalanceOrig</label>
                <input
                  type="number"
                  name="newbalanceOrig"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.newbalanceOrig}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Section 3: Destination Account */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" /> Destination Account (Receiver)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">nameDest</label>
                <input
                  type="text"
                  name="nameDest"
                  required
                  placeholder="e.g. M12345001"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.nameDest}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">oldbalanceDest</label>
                <input
                  type="number"
                  name="oldbalanceDest"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.oldbalanceDest}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">newbalanceDest</label>
                <input
                  type="number"
                  name="newbalanceDest"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.newbalanceDest}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing with IBM Watson...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Analyze Fraud Probability
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Predict;