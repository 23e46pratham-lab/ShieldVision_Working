import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/api';
import { TransactionLog } from '../types';
import { clsx } from 'clsx';
import { Search, Filter, Download } from 'lucide-react';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      console.log("%c[Logs] Fetching /logs...", "color: blue; font-weight: bold;");

      try {
        setLoading(true);

        const data = await getLogs();
        console.log("%c[Logs] Received logs from backend:", "color: green", data);

        setLogs(data);
      } catch (err) {
        console.error("%c[Logs] ERROR fetching logs", "color: red; font-weight: bold;", err);

        setLogs([]); // clean fallback — EMPTY, not mock
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
          <p className="text-slate-500">Audit log of all analyzed transactions.</p>
        </div>

        <div className="flex gap-2">
          <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
          <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by ID, Merchant or Amount"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Merchant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={clsx(
                          "px-2 inline-flex text-xs font-semibold rounded-full",
                          log.status === "Fraud"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        )}
                      >
                        {log.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{log.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{log.merchant}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">₹{log.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{log.reason || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
          <p className="text-sm text-slate-700">
            Showing {logs.length} of {logs.length} results
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logs;
