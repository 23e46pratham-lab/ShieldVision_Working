import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { FileText, AlertTriangle, PieChart as PieChartIcon, UploadCloud, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { getLogs, getStats } from "../services/api";
import { TransactionLog, DashboardStats } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      console.log("%c[Home] Fetching dashboard data...", "color: blue");

      try {
        setLoading(true);

        // 🟦 Fetch REAL stats from backend
        const apiStats = await getStats();
        console.log("[Home] Stats received:", apiStats);

        setStats({
          totalTransactions: apiStats.totalRowsProcessed || 0,
          fraudDetected: apiStats.fraudCount || 0,
          detectionAccuracy:
            apiStats.totalRowsProcessed > 0
              ? Math.round((apiStats.fraudCount / apiStats.totalRowsProcessed) * 100)
              : 0
        });

        // 🟦 Fetch REAL logs
        const apiLogs = await getLogs();
        console.log("[Home] Logs received:", apiLogs);

        setRecentLogs(apiLogs.slice(0, 3));
      } catch (error) {
        console.error("[Home] Dashboard error:", error);

        // If backend fails → show safe empty UI
        setStats({
          totalTransactions: 0,
          fraudDetected: 0,
          detectionAccuracy: 0
        });

        setRecentLogs([]);
      } finally {
        setLoading(false);
        console.log("%c[Home] Dashboard load complete", "color: green");
      }
    };

    fetchDashboard();
  }, []);

  // Pie chart based on REAL stats
  const pieData = stats
    ? [
        { name: 'Legitimate', value: stats.totalTransactions - stats.fraudDetected, color: '#e2e8f0' },
        { name: 'Fraud', value: stats.fraudDetected, color: '#ef4444' }
      ]
    : [];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fraud Detection Dashboard</h1>
          <p className="text-slate-500">Real-time overview of transaction security.</p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload New Dataset
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Total Transactions"
          value={stats?.totalTransactions || 0}
          icon={FileText}
          colorClass="text-blue-600"
        />
        <StatsCard 
          label="Fraud Detected"
          value={stats?.fraudDetected || 0}
          icon={AlertTriangle}
          colorClass="text-red-500"
        />
        <StatsCard 
          label="Detection Accuracy"
          value={`${stats?.detectionAccuracy}%`}
          icon={PieChartIcon}
          colorClass="text-green-500"
        />
      </div>

      {/* Upload + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload CTA */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Upload Dataset</h2>

          <div
            onClick={() => navigate('/upload')}
            className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="bg-slate-50 p-4 rounded-full mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
            </div>
            <p className="text-slate-600 font-medium">Drag & drop your CSV file here</p>

            <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 shadow-sm group-hover:border-blue-200 group-hover:text-blue-600">
              Select File
            </button>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Fraudulent vs. Legitimate</h2>

          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-3xl font-bold text-slate-800">{stats?.fraudDetected}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Frauds</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Model Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-center text-slate-900">
          Model Info:Snap Random Forest Classifier v2.1
        </h2>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Fraud Alerts</h2>

          <button
            onClick={() => navigate('/logs')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <tbody className="bg-white divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">₹{log.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{log.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.reason || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6">
          <button
            onClick={() => navigate('/predict')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            Generate New Report
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
