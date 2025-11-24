import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { FileText, AlertTriangle, PieChart as PieChartIcon, UploadCloud, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getMockStats, getMockLogs, getLogs } from '../services/api';
import { TransactionLog, DashboardStats } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to get real logs, fallback to mock if backend fails or returns empty
        let logs = [];
        try {
          logs = await getLogs();
        } catch (e) {
          console.warn("Backend unavailable, using mock data");
          logs = getMockLogs();
        }
        
        setRecentLogs(logs.slice(0, 3));
        setStats(getMockStats()); // Using mock stats for the visual demo
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: 'Legitimate', value: 1500 - 35, color: '#e2e8f0' }, // slate-200
    { name: 'Fraud', value: 35, color: '#ef4444' }, // red-500
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload CTA Section (Visual Match) */}
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

        {/* Chart Section */}
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-3xl font-bold text-slate-800">{stats?.fraudDetected}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Frauds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Info Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
         <h2 className="text-lg font-semibold text-center text-slate-900">Model Info: Random Forest Classifier v2.1</h2>
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
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">₹{log.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{log.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{log.reason || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6">
           <button onClick={() => navigate('/predict')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200">
             Generate New Report
           </button>
        </div>
      </div>
    </div>
  );
};

export default Home;