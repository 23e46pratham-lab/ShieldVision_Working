import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictFraud } from '../services/api';
import { PredictionRequest } from '../types';
import {
  ShieldCheck,
  Banknote,
  User,
  ArrowLeftRight,
  History,
  CreditCard,
  AlertCircle
} from 'lucide-react';

const Predict: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numberFields = [
      'step',
      'amount',
      'oldbalanceOrg',
      'newbalanceOrig',
      'oldbalanceDest',
      'newbalanceDest'
    ];

    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    console.log(
      '%c[Predict] Sending REAL request →',
      'color: dodgerblue; font-weight:bold;',
      formData
    );

    try {
      const result = await predictFraud(formData);

      console.log(
        '%c[Predict] Received REAL IBM response:',
        'color: green; font-weight:bold;',
        result
      );

      navigate('/result', {
        state: { result, requestData: formData }
      });
    } catch (error) {
      console.error('%c[Predict ERROR] Backend failed', 'color:red;', error);

      setErrorMessage('Failed to fetch prediction from backend / IBM model.');

      // DO NOT navigate. DO NOT generate mock results.
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Fraud Prediction</h1>
        <p className="text-slate-500 mt-2">
          Enter the IBM Watson model parameters below.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Transaction Basics */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Banknote className="w-5 h-5 mr-2 text-blue-600" />
              Transaction Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Step */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Step <span className="text-slate-400 text-xs">(Time unit)</span>
                </label>

                <div className="relative">
                  <History className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    name="step"
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.step}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type</label>

                <div className="relative">
                  <ArrowLeftRight className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <select
                    name="type"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
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
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 2: Origin Account */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" /> Origin Account (Sender)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* nameOrig */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">nameOrig</label>
                <input
                  type="text"
                  name="nameOrig"
                  required
                  placeholder="e.g. C12345001"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.nameOrig}
                  onChange={handleChange}
                />
              </div>

              {/* oldbalanceOrg */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">oldbalanceOrg</label>
                <input
                  type="number"
                  name="oldbalanceOrg"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.oldbalanceOrg}
                  onChange={handleChange}
                />
              </div>

              {/* newbalanceOrig */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">newbalanceOrig</label>
                <input
                  type="number"
                  name="newbalanceOrig"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.newbalanceOrig}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 3: Destination Account */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" /> Destination Account (Receiver)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* nameDest */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">nameDest</label>
                <input
                  type="text"
                  name="nameDest"
                  required
                  placeholder="e.g. M12345001"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.nameDest}
                  onChange={handleChange}
                />
              </div>

              {/* oldbalanceDest */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">oldbalanceDest</label>
                <input
                  type="number"
                  name="oldbalanceDest"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.oldbalanceDest}
                  onChange={handleChange}
                />
              </div>

              {/* newbalanceDest */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">newbalanceDest</label>
                <input
                  type="number"
                  name="newbalanceDest"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.newbalanceDest}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 rounded-lg shadow-lg 
              text-base font-bold text-white bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
